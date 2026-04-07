import type { Job, JobsListParams, PaginatedResult } from "@/types";
import { createSupabaseServerClient } from "@/lib/supabase";

function mapRowToJob(row: Record<string, unknown>): Job {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    department: row.department as Job["department"],
    location: String(row.location),
    workMode: row.work_mode as Job["workMode"],
    experience: row.experience as Job["experience"],
    salaryMin: (row.salary_min as number | null) ?? null,
    salaryMax: (row.salary_max as number | null) ?? null,
    description: String(row.description),
    responsibilities: (row.responsibilities as string[]) ?? [],
    requirements: (row.requirements as string[]) ?? [],
    skills: (row.skills as string[]) ?? [],
    status: row.status as Job["status"],
    createdAt: String(row.created_at),
  };
}

export async function getJobs(
  params: JobsListParams,
): Promise<PaginatedResult<Job>> {
  const page = Math.max(1, params.page);
  const pageSize = Math.min(24, Math.max(1, params.pageSize));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .eq("status", "active")
    .range(from, to);

  if (params.query) {
    query = query.ilike("title", `%${params.query}%`);
  }

  if (params.department) {
    query = query.eq("department", params.department);
  }

  if (params.experience) {
    query = query.eq("experience", params.experience);
  }

  if (params.workMode) {
    query = query.eq("work_mode", params.workMode);
  }

  const sort = params.sort ?? "latest";
  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sort === "salary-high") {
    query = query.order("salary_max", { ascending: false, nullsFirst: false });
  } else if (sort === "salary-low") {
    query = query.order("salary_min", { ascending: true, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }

  return {
    items: (data ?? []).map((row) =>
      mapRowToJob(row as Record<string, unknown>),
    ),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch job by slug: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapRowToJob(data as Record<string, unknown>);
}
