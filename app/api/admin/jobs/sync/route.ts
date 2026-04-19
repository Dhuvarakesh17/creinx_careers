import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { jobOpenings } from "@/data/jobs";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function mapWorkMode(value: string) {
  return value.toLowerCase();
}

function mapExperience(value: string) {
  return value.toLowerCase();
}

function parseSalaryRange(value: string) {
  const trimmed = value.trim();
  const matches = trimmed.match(/\d[\d,]*(?:\.\d+)?/g);
  if (!matches || matches.length < 2) {
    return { min: null, max: null };
  }

  const minValue = Number.parseFloat(matches[0].replace(/,/g, ""));
  const maxValue = Number.parseFloat(matches[1].replace(/,/g, ""));

  if (Number.isNaN(minValue) || Number.isNaN(maxValue)) {
    return { min: null, max: null };
  }

  if (/lpa|ctc/i.test(trimmed)) {
    return {
      min: Math.round(minValue * 100000),
      max: Math.round(maxValue * 100000),
    };
  }

  return {
    min: Math.round(minValue),
    max: Math.round(maxValue),
  };
}

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rows = jobOpenings.map((job) => {
    const salary = parseSalaryRange(job.salaryRange);
    return {
      slug: job.slug,
      title: job.title,
      department: job.sector,
      team: job.team,
      location: job.location,
      work_mode: mapWorkMode(job.workMode),
      experience: mapExperience(job.experienceLevel),
      experience_range: job.experienceRange,
      employment_type: job.type,
      salary_min: salary.min,
      salary_max: salary.max,
      description: job.summary,
      status_tags: job.statusTags,
      openings: job.openings,
      about_role: job.aboutRole,
      responsibilities: job.responsibilities,
      requirements: job.requiredQualifications,
      nice_to_have: job.niceToHave,
      perks: job.perks,
      interview_process: [
        "Application Review (24-48 hours)",
        "Technical Screening",
        "Technical Interview",
        "HR Round",
        "Offer",
      ],
      skills: job.skills,
      status: "active",
    };
  });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("jobs").upsert(rows, {
    onConflict: "slug",
  });

  if (error) {
    return NextResponse.json(
      { message: `Failed to sync jobs: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: `Synced ${rows.length} jobs from jobs.ts to database`,
  });
}
