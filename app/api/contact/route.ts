import { NextResponse } from "next/server";

import { sendResendEmail } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "General inquiry").trim();
    const role = String(formData.get("role") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || message.length < 20) {
      return NextResponse.json(
        { message: "Invalid contact request." },
        { status: 400 },
      );
    }

    const inbox = process.env.CAREERS_INBOX_EMAIL;

    if (!inbox) {
      return NextResponse.json(
        { message: "Contact configuration missing." },
        { status: 500 },
      );
    }

    const { error } = await sendResendEmail({
      to: [inbox],
      replyTo: email,
      subject: `Contact: ${subject}`,
      html: `<h2>Contact Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Role Interested In:</strong> ${role || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>`,
    });

    if (error) {
      return NextResponse.json(
        { message: "Unable to send contact request." },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Message sent successfully." });
  } catch {
    return NextResponse.json(
      { message: "Unexpected server error." },
      { status: 500 },
    );
  }
}
