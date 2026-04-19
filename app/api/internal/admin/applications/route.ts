import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  handleAdminOptions,
  validateAdminRequest,
  withAdminCors,
} from "@/lib/internal-admin-auth";

export const runtime = "nodejs";

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
  const status = (searchParams.get("status") ?? "").trim();
  const roleId = (searchParams.get("roleId") ?? "").trim();
  const query = (searchParams.get("query") ?? "").trim();

  const supabase = getSupabaseAdmin();
  let builder = supabase
    .from("job_applications")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (status) {
    builder = builder.eq("status", status);
  }

  if (roleId) {
    builder = builder.eq("role_id", roleId);
  }

  if (query) {
    builder = builder.or(
      `candidate_name.ilike.%${query}%,candidate_email.ilike.%${query}%,role_title.ilike.%${query}%`,
    );
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
