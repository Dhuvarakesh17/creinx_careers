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

function parseLpaRange(value: string) {
  const matches = value.match(/\d+(?:\.\d+)?/g);
  if (!matches || matches.length < 2) {
    return { min: null, max: null };
  }

  const minLpa = Number.parseFloat(matches[0]);
  const maxLpa = Number.parseFloat(matches[1]);

  if (Number.isNaN(minLpa) || Number.isNaN(maxLpa)) {
    return { min: null, max: null };
  }

  return {
    min: Math.round(minLpa * 100000),
    max: Math.round(maxLpa * 100000),
  };
}

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rows = jobOpenings.map((job) => {
    const salary = parseLpaRange(job.salaryRange);
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
