import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  handleAdminOptions,
  validateAdminRequest,
  withAdminCors,
} from "@/lib/internal-admin-auth";

export const runtime = "nodejs";

const allowedStatuses = new Set([
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
]);

export async function OPTIONS(request: Request) {
  return handleAdminOptions(request);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authError = validateAdminRequest(request);
  if (authError) {
    return withAdminCors(request, authError);
  }

  const { id } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return withAdminCors(
      request,
      NextResponse.json({ message: "Invalid JSON body" }, { status: 400 }),
    );
  }

  const status = String(body.status ?? "").trim();
  if (!allowedStatuses.has(status)) {
    return withAdminCors(
      request,
      NextResponse.json({ message: "Invalid status" }, { status: 400 }),
    );
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("job_applications")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return withAdminCors(
      request,
      NextResponse.json({ message: error.message }, { status: 500 }),
    );
  }

  return withAdminCors(request, NextResponse.json({ item: data }));
}
