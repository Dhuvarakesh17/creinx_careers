import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  handleAdminOptions,
  validateAdminRequest,
  withAdminCors,
} from "@/lib/internal-admin-auth";

export const runtime = "nodejs";

function parseTextArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item).trim()).filter(Boolean);
}

export async function OPTIONS(request: Request) {
  return handleAdminOptions(request);
}

export async function GET(request: Request) {
  const authError = validateAdminRequest(request);
  if (authError) {
    return withAdminCors(request, authError);
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") ?? "1", 10),
  );
  const pageSize = Math.min(
    100,
    Math.max(1, Number.parseInt(searchParams.get("pageSize") ?? "20", 10)),
  );
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = (searchParams.get("query") ?? "").trim();
  const status = (searchParams.get("status") ?? "").trim();
  const department = (searchParams.get("department") ?? "").trim();

  const supabase = getSupabaseAdmin();
  let builder = supabase
    .from("jobs_with_posted_days")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (query) {
    builder = builder.ilike("title", `%${query}%`);
  }

  if (status) {
    builder = builder.eq("status", status);
  }

  if (department) {
    builder = builder.eq("department", department);
  }

  const { data, error, count } = await builder;

  if (error) {
    return withAdminCors(
      request,
      NextResponse.json({ message: error.message }, { status: 500 }),
    );
  }

  return withAdminCors(
    request,
    NextResponse.json({
      items: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
    }),
  );
}

export async function POST(request: Request) {
  const authError = validateAdminRequest(request);
  if (authError) {
    return withAdminCors(request, authError);
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return withAdminCors(
      request,
      NextResponse.json({ message: "Invalid JSON body" }, { status: 400 }),
    );
  }

  const title = String(body.title ?? "").trim();
  const slug = String(body.slug ?? "").trim();

  if (!title || !slug) {
    return withAdminCors(
      request,
      NextResponse.json(
        { message: "title and slug are required" },
        { status: 400 },
      ),
    );
  }

  const supabase = getSupabaseAdmin();
  const payload = {
    slug,
    title,
    department: String(body.department ?? "technical"),
    location: String(body.location ?? "Chennai"),
    work_mode: String(body.work_mode ?? "hybrid"),
    experience: String(body.experience ?? "mid"),
    salary_min:
      body.salary_min === null || body.salary_min === undefined
        ? null
        : Number(body.salary_min),
    salary_max:
      body.salary_max === null || body.salary_max === undefined
        ? null
        : Number(body.salary_max),
    description: String(body.description ?? ""),
    responsibilities: parseTextArray(body.responsibilities),
    requirements: parseTextArray(body.requirements),
    skills: parseTextArray(body.skills),
    status: String(body.status ?? "draft"),
    team: String(body.team ?? ""),
    experience_range: String(body.experience_range ?? "1-3"),
    employment_type: String(body.employment_type ?? "Full-time"),
    status_tags: parseTextArray(body.status_tags),
    openings: Math.max(1, Number(body.openings ?? 1)),
    about_role: parseTextArray(body.about_role),
    nice_to_have: parseTextArray(body.nice_to_have),
    perks: parseTextArray(body.perks),
    interview_process: parseTextArray(body.interview_process),
  };

  const { data, error } = await supabase
    .from("jobs")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return withAdminCors(
      request,
      NextResponse.json({ message: error.message }, { status: 500 }),
    );
  }

  return withAdminCors(
    request,
    NextResponse.json({ item: data }, { status: 201 }),
  );
}
