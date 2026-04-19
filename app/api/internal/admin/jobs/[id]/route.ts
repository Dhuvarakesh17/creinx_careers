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
    return undefined;
  }

  return value.map((item) => String(item).trim()).filter(Boolean);
}

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

  const updates: Record<string, unknown> = {};
  const directMap: Array<[string, string]> = [
    ["slug", "slug"],
    ["title", "title"],
    ["department", "department"],
    ["location", "location"],
    ["work_mode", "work_mode"],
    ["experience", "experience"],
    ["description", "description"],
    ["status", "status"],
    ["team", "team"],
    ["experience_range", "experience_range"],
    ["employment_type", "employment_type"],
  ];

  for (const [inKey, dbKey] of directMap) {
    if (Object.hasOwn(body, inKey)) {
      updates[dbKey] = body[inKey];
    }
  }

  if (Object.hasOwn(body, "salary_min")) {
    updates.salary_min =
      body.salary_min === null || body.salary_min === undefined
        ? null
        : Number(body.salary_min);
  }

  if (Object.hasOwn(body, "salary_max")) {
    updates.salary_max =
      body.salary_max === null || body.salary_max === undefined
        ? null
        : Number(body.salary_max);
  }

  if (Object.hasOwn(body, "openings")) {
    updates.openings = Math.max(1, Number(body.openings));
  }

  const arrayFields = [
    "responsibilities",
    "requirements",
    "skills",
    "status_tags",
    "about_role",
    "nice_to_have",
    "perks",
    "interview_process",
  ] as const;

  for (const key of arrayFields) {
    if (Object.hasOwn(body, key)) {
      updates[key] = parseTextArray(body[key]);
    }
  }

  if (Object.keys(updates).length === 0) {
    return withAdminCors(
      request,
      NextResponse.json({ message: "No fields to update" }, { status: 400 }),
    );
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("jobs")
    .update(updates)
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

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authError = validateAdminRequest(request);
  if (authError) {
    return withAdminCors(request, authError);
  }

  const { id } = await context.params;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("jobs")
    .update({ status: "closed" })
    .eq("id", id);

  if (error) {
    return withAdminCors(
      request,
      NextResponse.json({ message: error.message }, { status: 500 }),
    );
  }

  return withAdminCors(request, NextResponse.json({ message: "Job archived" }));
}
