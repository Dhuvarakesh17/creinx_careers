import { NextRequest, NextResponse } from "next/server";
import { getJobs } from "@/lib/jobs";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const page = parseInt(params.get("page") || "1", 10);
    const pageSize = parseInt(params.get("pageSize") || "24", 10);
    const query = params.get("query") || undefined;
    const department = params.get("department") || undefined;
    const experience = params.get("experience") || undefined;
    const workMode = params.get("workMode") || undefined;
    const sort = params.get("sort") || "latest";

    const result = await getJobs({
      page,
      pageSize,
      query,
      department: department as any,
      experience: experience as any,
      workMode: workMode as any,
      sort: sort as any,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
