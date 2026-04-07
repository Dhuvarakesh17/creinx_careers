import { NextResponse } from "next/server";

import {
  applicationSchema,
  MAX_RESUME_SIZE_BYTES,
} from "@/schemas/application";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendResendEmail } from "@/lib/resend";
import { jobOpenings } from "@/data/jobs";

export const runtime = "nodejs";

const resumeMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const parsed = applicationSchema.safeParse({
      roleId: formData.get("roleId"),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      experienceYears: formData.get("experienceYears"),
      portfolioUrl: formData.get("portfolioUrl"),
      coverLetter: formData.get("coverLetter"),
      website: formData.get("website"),
      city: formData.get("city"),
      linkedin: formData.get("linkedin"),
      currentRole: formData.get("currentRole"),
      currentCtc: formData.get("currentCtc"),
      expectedCtc: formData.get("expectedCtc"),
      noticePeriod: formData.get("noticePeriod"),
      skills: formData.get("skills"),
      heardFrom: formData.get("heardFrom"),
      referralName: formData.get("referralName"),
    });

    if (!parsed.success) {
      return badRequest("Please fill all required fields correctly.");
    }

    if (parsed.data.website) {
      // Honeypot trap for bots. Return success-like response to reduce retries.
      return NextResponse.json({ message: "Application submitted." });
    }

    const resume = formData.get("resume");

    if (!(resume instanceof File)) {
      return badRequest("Resume PDF is required.");
    }

    if (!resumeMimeTypes.includes(resume.type)) {
      return badRequest("Only PDF, DOC, and DOCX resumes are accepted.");
    }

    if (resume.size > MAX_RESUME_SIZE_BYTES) {
      return badRequest("Resume must be under 5MB.");
    }

    const role = jobOpenings.find((job) => job.id === parsed.data.roleId);
    if (!role) {
      return badRequest("Selected role is invalid.");
    }

    const supabase = getSupabaseAdmin();
    const safeName = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const extension =
      resume.type === "application/pdf"
        ? "pdf"
        : resume.type.includes("wordprocessingml")
          ? "docx"
          : "doc";
    const resumePath = `applications/${parsed.data.roleId}/${Date.now()}-${safeName}-${crypto.randomUUID()}.${extension}`;

    const bytes = await resume.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_RESUME_BUCKET ?? "resumes")
      .upload(resumePath, Buffer.from(bytes), {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Resume upload failed", uploadError);
      return NextResponse.json(
        { message: "Could not upload resume. Please retry." },
        { status: 500 },
      );
    }

    const { error: insertError } = await supabase
      .from("job_applications")
      .insert({
        role_id: parsed.data.roleId,
        role_title: role.title,
        sector: role.sector,
        candidate_name: parsed.data.name,
        candidate_email: parsed.data.email,
        candidate_phone: parsed.data.phone,
        experience_years: parsed.data.experienceYears,
        portfolio_url: parsed.data.portfolioUrl,
        cover_letter: parsed.data.coverLetter,
        city: parsed.data.city,
        linkedin_url: parsed.data.linkedin,
        current_role: parsed.data.currentRole,
        current_ctc: parsed.data.currentCtc,
        expected_ctc: parsed.data.expectedCtc,
        notice_period: parsed.data.noticePeriod,
        skills: parsed.data.skills,
        heard_from: parsed.data.heardFrom,
        referral_name: parsed.data.referralName,
        resume_path: resumePath,
        status: "new",
      });

    if (insertError) {
      console.error("Application insert failed", insertError);
    }

    const inbox = process.env.CAREERS_INBOX_EMAIL;

    let adminEmailError: unknown = null;
    if (inbox) {
      const { error } = await sendResendEmail({
        to: [inbox],
        replyTo: parsed.data.email,
        subject: `New Application: ${role.title} (${role.sector})`,
        html: `
          <h2>New Job Application</h2>
          <p><strong>Role:</strong> ${role.title}</p>
          <p><strong>Sector:</strong> ${role.sector}</p>
          <p><strong>Name:</strong> ${parsed.data.name}</p>
          <p><strong>Email:</strong> ${parsed.data.email}</p>
          <p><strong>Phone:</strong> ${parsed.data.phone}</p>
          <p><strong>Experience:</strong> ${parsed.data.experienceYears} years</p>
          <p><strong>Portfolio:</strong> <a href="${parsed.data.portfolioUrl}">${parsed.data.portfolioUrl}</a></p>
          <p><strong>Cover Letter:</strong></p>
          <p>${parsed.data.coverLetter.replace(/\n/g, "<br/>")}</p>
          <p><strong>Resume Path:</strong> ${resumePath}</p>
        `,
      });

      adminEmailError = error;
      if (adminEmailError) {
        console.error("Resend admin email failed", adminEmailError);
      }
    }

    const { error: applicantEmailError } = await sendResendEmail({
      to: [parsed.data.email],
      subject: `Application Received - ${role.title}`,
      html: `
        <h2>Thanks for applying to CREINX</h2>
        <p>Hi ${parsed.data.name},</p>
        <p>We have received your application for <strong>${role.title}</strong> (${role.sector}).</p>
        <p>Our team will review your profile and reach out if your experience matches the role.</p>
        <p><strong>Application details:</strong></p>
        <ul>
          <li>Role: ${role.title}</li>
          <li>Sector: ${role.sector}</li>
          <li>Email: ${parsed.data.email}</li>
          <li>Phone: ${parsed.data.phone}</li>
        </ul>
        <p>Regards,<br/>CREINX Hiring Team</p>
      `,
    });

    if (applicantEmailError) {
      console.error(
        "Resend applicant confirmation email failed",
        applicantEmailError,
      );
      return NextResponse.json(
        {
          message:
            "Application submitted, but confirmation email could not be sent right now.",
        },
        { status: 202 },
      );
    }

    if (adminEmailError || !inbox) {
      return NextResponse.json(
        {
          message:
            "Application submitted successfully. Confirmation email sent to applicant.",
        },
        { status: 202 },
      );
    }

    return NextResponse.json({
      message:
        "Application submitted successfully. Our team will contact you soon.",
    });
  } catch (error) {
    console.error("Application submission error", error);
    return NextResponse.json(
      { message: "Unexpected error while processing your application." },
      { status: 500 },
    );
  }
}
