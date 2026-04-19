import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function toDepartmentValue(value: string) {
  return value === "Digital Marketing" ? "digital-marketing" : "technical";
}

function toDepartmentLabel(value: string): "Technical" | "Digital Marketing" {
  return value === "digital-marketing" ? "Digital Marketing" : "Technical";
}

function makeSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapWorkMode(value: string) {
  return value.toLowerCase();
}

function mapExperience(value: string) {
  return value.toLowerCase();
}

function toInrAmount(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return Math.round(value);
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item).trim()).filter(Boolean);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title?: unknown;
    slug?: unknown;
    department?: unknown;
    location?: unknown;
    workMode?: unknown;
    experienceLevel?: unknown;
    experienceRange?: unknown;
    employmentType?: unknown;
    team?: unknown;
    salaryMinInr?: unknown;
    salaryMaxInr?: unknown;
    openings?: unknown;
    statusTags?: unknown;
    summary?: unknown;
    skills?: unknown;
    aboutRole?: unknown;
    responsibilities?: unknown;
    requiredQualifications?: unknown;
    niceToHave?: unknown;
    perks?: unknown;
    interviewProcess?: unknown;
  };

  try {
    body = (await request.json()) as { title?: unknown; department?: unknown };
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  const title = String(body.title ?? "").trim();
  const slugInput = String(body.slug ?? "").trim();
  const department = String(body.department ?? "").trim();
  const location = String(body.location ?? "Chennai").trim();
  const workMode = String(body.workMode ?? "Hybrid").trim();
  const experienceLevel = String(body.experienceLevel ?? "Mid").trim();
  const experienceRange = String(body.experienceRange ?? "1-3").trim();
  const employmentType = String(body.employmentType ?? "Full-time").trim();
  const team = String(body.team ?? "").trim();
  const openings = Number.parseInt(String(body.openings ?? "1"), 10);
  const summary = String(body.summary ?? "").trim();
  const salaryMinInr =
    typeof body.salaryMinInr === "number"
      ? body.salaryMinInr
      : Number.parseFloat(String(body.salaryMinInr ?? ""));
  const salaryMaxInr =
    typeof body.salaryMaxInr === "number"
      ? body.salaryMaxInr
      : Number.parseFloat(String(body.salaryMaxInr ?? ""));
  const statusTags = asStringArray(body.statusTags);
  const skills = asStringArray(body.skills);
  const aboutRole = asStringArray(body.aboutRole);
  const responsibilities = asStringArray(body.responsibilities);
  const requiredQualifications = asStringArray(body.requiredQualifications);
  const niceToHave = asStringArray(body.niceToHave);
  const perks = asStringArray(body.perks);
  const interviewProcess = asStringArray(body.interviewProcess);

  if (!title) {
    return NextResponse.json(
      { message: "Job title is required" },
      { status: 400 },
    );
  }

  if (department !== "Technical" && department !== "Digital Marketing") {
    return NextResponse.json(
      { message: "Invalid department" },
      { status: 400 },
    );
  }

  if (!["Chennai", "Bengaluru", "Remote"].includes(location)) {
    return NextResponse.json({ message: "Invalid location" }, { status: 400 });
  }

  if (!["Onsite", "Hybrid", "Remote"].includes(workMode)) {
    return NextResponse.json({ message: "Invalid work mode" }, { status: 400 });
  }

  if (!["Fresher", "Junior", "Mid", "Senior"].includes(experienceLevel)) {
    return NextResponse.json(
      { message: "Invalid experience level" },
      { status: 400 },
    );
  }

  if (!["0-1", "1-3", "3-5", "5+"].includes(experienceRange)) {
    return NextResponse.json(
      { message: "Invalid experience range" },
      { status: 400 },
    );
  }

  if (
    !["Full-time", "Part-time", "Internship", "Contract"].includes(
      employmentType,
    )
  ) {
    return NextResponse.json(
      { message: "Invalid employment type" },
      { status: 400 },
    );
  }

  if (!summary) {
    return NextResponse.json(
      { message: "Summary is required" },
      { status: 400 },
    );
  }

  if (
    aboutRole.length === 0 ||
    responsibilities.length === 0 ||
    requiredQualifications.length === 0
  ) {
    return NextResponse.json(
      {
        message:
          "About role, responsibilities and required qualifications are required",
      },
      { status: 400 },
    );
  }

  const slugBase = makeSlug(slugInput || title);
  const slug = `${slugBase}-${Date.now()}`;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      slug,
      title,
      department: toDepartmentValue(department),
      location,
      work_mode: mapWorkMode(workMode),
      experience: mapExperience(experienceLevel),
      experience_range: experienceRange,
      employment_type: employmentType,
      team,
      salary_min: toInrAmount(salaryMinInr),
      salary_max: toInrAmount(salaryMaxInr),
      description: summary,
      responsibilities,
      requirements: requiredQualifications,
      skills,
      status_tags: statusTags,
      openings: Number.isNaN(openings) ? 1 : Math.max(1, openings),
      about_role: aboutRole,
      nice_to_have: niceToHave,
      perks,
      interview_process: interviewProcess,
      status: "draft",
    })
    .select("id, title, department")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { message: error?.message ?? "Failed to create job" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    item: {
      id: String(data.id),
      title: String(data.title),
      department: toDepartmentLabel(String(data.department)),
      applicants: 0,
      postedDaysAgo: 0,
      status: "Active",
    },
    message: "Job role created",
  });
}
