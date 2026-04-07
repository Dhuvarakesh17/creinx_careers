export type Department = "technical" | "digital-marketing";
export type WorkMode = "onsite" | "hybrid" | "remote";
export type EmploymentStatus = "active" | "draft" | "closed";
export type ExperienceBand = "fresher" | "junior" | "mid" | "senior";

export interface Job {
  id: string;
  slug: string;
  title: string;
  department: Department;
  location: string;
  workMode: WorkMode;
  experience: ExperienceBand;
  salaryMin: number | null;
  salaryMax: number | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  status: EmploymentStatus;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  linkedin: string;
  portfolio: string;
  currentRole: string;
  totalExperience: number;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  skills: string[];
  howHeard: string;
  referralName: string | null;
  resumeUrl: string;
  coverLetter: string;
  status: "new" | "reviewing" | "shortlisted" | "rejected" | "hired";
  hrNotes: string | null;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super-admin" | "hr-admin";
  createdAt: string;
}

export interface JobsListParams {
  page: number;
  pageSize: number;
  query?: string;
  department?: Department;
  experience?: ExperienceBand;
  workMode?: WorkMode;
  sort?: "latest" | "oldest" | "salary-high" | "salary-low";
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
