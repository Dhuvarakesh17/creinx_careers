import { jobOpenings, type JobOpening } from "@/data/jobs";

export type PublicJob = {
  id: string;
  slug: string;
  title: string;
  department: "Technical" | "Digital Marketing";
  sector: "technical" | "digital-marketing";
  team: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "Onsite";
  experienceLevel: "Fresher" | "Junior" | "Mid" | "Senior";
  experienceRange: "0-1" | "1-3" | "3-5" | "5+";
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  salaryRange: string;
  summary: string;
  skills: string[];
  postedDaysAgo: number;
  statusTags: string[];
  openings: number;
  responsibilities: string[];
  requiredQualifications: string[];
  aboutRole: string[];
  niceToHave: string[];
  perks: string[];
  interviewProcess: string[];
};

export type PublicJobsResponse = {
  ok?: boolean;
  data?: {
    items?: unknown[];
    total?: number;
  };
  error?: {
    message?: string;
  };
};

const DEFAULT_ADMIN_PORTAL_API_BASE_URL =
  "https://admin-portal-sooty.vercel.app";

const DEFAULT_INTERVIEW_PROCESS = [
  "Application Review (24-48 hours)",
  "Technical Screening",
  "Technical Interview",
  "HR Round",
  "Offer",
];

export const staticPublicJobs: PublicJob[] = jobOpenings.map(
  mapStaticJobToPublicJob,
);

export function getAdminPortalApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_ADMIN_PORTAL_API_BASE_URL?.trim() ||
    DEFAULT_ADMIN_PORTAL_API_BASE_URL
  ).replace(/\/$/, "");
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function normalizeDepartment(value: string): PublicJob["department"] {
  const normalized = value.trim().toLowerCase();
  if (normalized === "digital-marketing" || normalized === "marketing") {
    return "Digital Marketing";
  }

  return "Technical";
}

function normalizeSector(value: string): PublicJob["sector"] {
  const normalized = value.trim().toLowerCase();
  if (normalized === "digital-marketing" || normalized === "marketing") {
    return "digital-marketing";
  }

  return "technical";
}

function normalizeWorkMode(value: string): PublicJob["workMode"] {
  const normalized = value.trim().toLowerCase();
  if (normalized === "hybrid") return "Hybrid";
  if (normalized === "onsite") return "Onsite";
  return "Remote";
}

function normalizeExperienceLevel(value: string): PublicJob["experienceLevel"] {
  const normalized = value.trim().toLowerCase();
  if (normalized === "junior") return "Junior";
  if (normalized === "mid") return "Mid";
  if (normalized === "senior") return "Senior";
  return "Fresher";
}

function normalizeExperienceRange(
  experienceRange: string,
  level: PublicJob["experienceLevel"],
): PublicJob["experienceRange"] {
  const normalized = experienceRange.trim();
  if (["0-1", "1-3", "3-5", "5+"].includes(normalized)) {
    return normalized as PublicJob["experienceRange"];
  }

  if (level === "Fresher") return "0-1";
  if (level === "Senior") return "3-5";
  return "1-3";
}

function normalizeJobType(value: string): PublicJob["type"] {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
  if (normalized === "part-time") return "Part-time";
  if (normalized === "internship") return "Internship";
  if (normalized === "contract") return "Contract";
  return "Full-time";
}

function formatLpaValue(value: number) {
  const normalized = Number.parseFloat(value.toFixed(1));
  return Number.isInteger(normalized) ? `${normalized}` : normalized.toFixed(1);
}

function toLpa(value: number) {
  // Values above 1000 are treated as annual INR amounts.
  return value >= 1000 ? value / 100000 : value;
}

function convertUsdToRupees(value: number) {
  return value * 83;
}

function extractRangeValues(value: string) {
  return value.match(/\d[\d,]*(?:\.\d+)?/g) ?? [];
}

function computeSalaryRange(raw: Record<string, unknown>) {
  const salaryRange = raw.salaryRange;
  if (typeof salaryRange === "string" && salaryRange.trim()) {
    const trimmed = salaryRange.trim();
    const lower = trimmed.toLowerCase();
    const values = extractRangeValues(trimmed);

    if (lower.includes("lpa") || lower.includes("ctc")) {
      if (values.length >= 2) {
        const rawMin = values[0];
        const rawMax = values[1];
        if (!rawMin || !rawMax) {
          return trimmed;
        }

        const min = Number.parseFloat(rawMin.replace(/,/g, ""));
        const max = Number.parseFloat(rawMax.replace(/,/g, ""));

        if (!Number.isNaN(min) && !Number.isNaN(max)) {
          return `₹ ${formatLpaValue(min)} - ${formatLpaValue(max)} LPA`;
        }
      }
    }

    if (trimmed.includes("$") || lower.includes("usd")) {
      if (values.length >= 2) {
        const rawMin = values[0];
        const rawMax = values[1];
        if (!rawMin || !rawMax) {
          return trimmed;
        }

        const min = Number.parseFloat(rawMin.replace(/,/g, ""));
        const max = Number.parseFloat(rawMax.replace(/,/g, ""));

        if (!Number.isNaN(min) && !Number.isNaN(max)) {
          const minLpa = toLpa(convertUsdToRupees(min));
          const maxLpa = toLpa(convertUsdToRupees(max));
          return `₹ ${formatLpaValue(minLpa)} - ${formatLpaValue(maxLpa)} LPA`;
        }
      }

      return trimmed;
    }

    if (trimmed.includes("₹") || lower.includes("inr")) {
      if (values.length >= 2) {
        const rawMin = values[0];
        const rawMax = values[1];
        if (!rawMin || !rawMax) {
          return trimmed;
        }

        const min = Number.parseFloat(rawMin.replace(/,/g, ""));
        const max = Number.parseFloat(rawMax.replace(/,/g, ""));

        if (!Number.isNaN(min) && !Number.isNaN(max)) {
          return `₹ ${formatLpaValue(toLpa(min))} - ${formatLpaValue(toLpa(max))} LPA`;
        }
      }
    }

    return trimmed;
  }

  const minCandidate =
    typeof raw.salaryMin === "number"
      ? raw.salaryMin
      : typeof raw.salary_min === "number"
        ? raw.salary_min
        : null;
  const maxCandidate =
    typeof raw.salaryMax === "number"
      ? raw.salaryMax
      : typeof raw.salary_max === "number"
        ? raw.salary_max
        : null;

  if (
    typeof minCandidate !== "number" ||
    typeof maxCandidate !== "number" ||
    Number.isNaN(minCandidate) ||
    Number.isNaN(maxCandidate)
  ) {
    return "Salary based on experience";
  }

  const currency = String(raw.salaryCurrency ?? raw.salary_currency ?? "INR")
    .trim()
    .toUpperCase();
  const minInr =
    currency === "USD" ? convertUsdToRupees(minCandidate) : minCandidate;
  const maxInr =
    currency === "USD" ? convertUsdToRupees(maxCandidate) : maxCandidate;
  return `₹ ${formatLpaValue(toLpa(minInr))} - ${formatLpaValue(toLpa(maxInr))} LPA`;
}

function computePostedDaysAgo(raw: Record<string, unknown>) {
  const provided =
    raw.postedDaysAgo ?? raw.posted_days_ago ?? raw.live_posted_days_ago;
  if (typeof provided === "number" && !Number.isNaN(provided)) {
    return Math.max(0, Math.floor(provided));
  }

  const timestamp = String(raw.createdAt ?? raw.created_at ?? "").trim();
  if (!timestamp) {
    return 0;
  }

  const created = new Date(timestamp).getTime();
  if (Number.isNaN(created)) {
    return 0;
  }

  const diff = Date.now() - created;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function normalizeOptionalArray(value: unknown) {
  return toStringArray(value);
}

function mapApiJobToPublicJob(raw: Record<string, unknown>): PublicJob {
  const department = normalizeDepartment(
    String(raw.department ?? raw.sector ?? ""),
  );
  const sector = normalizeSector(String(raw.sector ?? raw.department ?? ""));
  const experienceLevel = normalizeExperienceLevel(
    String(raw.experienceLevel ?? raw.experience ?? ""),
  );

  return {
    id: String(raw.id ?? raw.slug ?? ""),
    slug: String(raw.slug ?? raw.id ?? ""),
    title: String(raw.title ?? ""),
    department,
    sector,
    team: typeof raw.team === "string" ? raw.team : "",
    location: String(raw.location ?? ""),
    workMode: normalizeWorkMode(String(raw.workMode ?? raw.work_mode ?? "")),
    experienceLevel,
    experienceRange: normalizeExperienceRange(
      String(raw.experienceRange ?? raw.experience ?? ""),
      experienceLevel,
    ),
    type: normalizeJobType(
      String(raw.type ?? raw.employmentType ?? raw.employment_type ?? ""),
    ),
    salaryRange: computeSalaryRange(raw),
    summary: String(raw.summary ?? raw.description ?? ""),
    skills: normalizeOptionalArray(raw.skills),
    postedDaysAgo: computePostedDaysAgo(raw),
    statusTags: normalizeOptionalArray(raw.statusTags ?? raw.status_tags),
    openings: Number(raw.openings ?? 0),
    responsibilities: normalizeOptionalArray(raw.responsibilities),
    requiredQualifications: normalizeOptionalArray(
      raw.requiredQualifications ?? raw.requirements,
    ),
    aboutRole: normalizeOptionalArray(raw.aboutRole ?? raw.about_role),
    niceToHave: normalizeOptionalArray(raw.niceToHave ?? raw.nice_to_have),
    perks: normalizeOptionalArray(raw.perks),
    interviewProcess:
      normalizeOptionalArray(raw.interviewProcess ?? raw.interview_process)
        .length > 0
        ? normalizeOptionalArray(raw.interviewProcess ?? raw.interview_process)
        : DEFAULT_INTERVIEW_PROCESS,
  };
}

function buildUrl(path: string) {
  const baseUrl = getAdminPortalApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export function mapStaticJobToPublicJob(job: JobOpening): PublicJob {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    department: job.department,
    sector: job.sector,
    team: job.team,
    location: job.location,
    workMode: job.workMode,
    experienceLevel: job.experienceLevel,
    experienceRange: job.experienceRange,
    type: job.type,
    salaryRange: job.salaryRange,
    summary: job.summary,
    skills: job.skills,
    postedDaysAgo: job.postedDaysAgo,
    statusTags: job.statusTags,
    openings: job.openings,
    responsibilities: job.responsibilities,
    requiredQualifications: job.requiredQualifications,
    aboutRole: job.aboutRole,
    niceToHave: job.niceToHave,
    perks: job.perks,
    interviewProcess: DEFAULT_INTERVIEW_PROCESS,
  };
}

export async function loadPublicJobs(): Promise<PublicJob[]> {
  try {
    const response = await fetch(buildUrl("/api/public/jobs"), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to load public jobs (${response.status})`);
    }

    const payload = (await response.json()) as PublicJobsResponse;
    const items = payload.data?.items ?? [];

    return items.map((item) =>
      mapApiJobToPublicJob(item as Record<string, unknown>),
    );
  } catch {
    return staticPublicJobs;
  }
}

export async function loadPublicJobBySlug(
  slug: string,
): Promise<PublicJob | null> {
  const safeSlug = slug.trim();
  if (!safeSlug) {
    return null;
  }

  try {
    const response = await fetch(
      buildUrl(`/api/public/jobs/${encodeURIComponent(safeSlug)}`),
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(`Failed to load public job (${response.status})`);
    }

    const payload = (await response.json()) as {
      ok?: boolean;
      data?: unknown;
    };

    if (payload.data && typeof payload.data === "object") {
      return mapApiJobToPublicJob(payload.data as Record<string, unknown>);
    }
  } catch {
    // Fall back to local seed data below.
  }

  return staticPublicJobs.find((job) => job.slug === safeSlug) ?? null;
}

export async function resolvePublicJobForApplication(input: {
  roleId: string;
  roleSlug?: string;
}) {
  if (input.roleSlug) {
    const bySlug = await loadPublicJobBySlug(input.roleSlug);
    if (bySlug) {
      return bySlug;
    }
  }

  const byId = staticPublicJobs.find((job) => job.id === input.roleId);
  if (byId) {
    return byId;
  }

  const jobs = await loadPublicJobs();
  return (
    jobs.find(
      (job) => job.id === input.roleId || job.slug === input.roleSlug,
    ) ?? null
  );
}
