"use client";

import { useMemo, useState } from "react";

type JobPostingRow = {
  id: string;
  title: string;
  department: "Technical" | "Digital Marketing";
  applicants: number;
  postedDaysAgo: number;
  status: "Active";
};

type NewJobFormState = {
  title: string;
  slug: string;
  department: "Technical" | "Digital Marketing";
  location: "Chennai" | "Remote";
  workMode: "Onsite" | "Hybrid" | "Remote";
  experienceLevel: "Fresher" | "Junior" | "Mid" | "Senior";
  experienceRange: "0-1" | "1-3" | "3-5" | "5+";
  employmentType: "Full-time" | "Part-time" | "Internship" | "Contract";
  team: string;
  salaryMinInr: string;
  salaryMaxInr: string;
  openings: string;
  statusTagsCsv: string;
  summary: string;
  skillsCsv: string;
  aboutRole: string;
  responsibilities: string;
  requiredQualifications: string;
  niceToHave: string;
  perks: string;
  interviewProcess: string;
};

type CreateJobRequest = {
  title: string;
  slug?: string;
  department: "Technical" | "Digital Marketing";
  location: "Chennai" | "Remote";
  workMode: "Onsite" | "Hybrid" | "Remote";
  experienceLevel: "Fresher" | "Junior" | "Mid" | "Senior";
  experienceRange: "0-1" | "1-3" | "3-5" | "5+";
  employmentType: "Full-time" | "Part-time" | "Internship" | "Contract";
  team: string;
  salaryMinInr?: number;
  salaryMaxInr?: number;
  openings: number;
  statusTags: string[];
  summary: string;
  skills: string[];
  aboutRole: string[];
  responsibilities: string[];
  requiredQualifications: string[];
  niceToHave: string[];
  perks: string[];
  interviewProcess: string[];
};

export function AdminJobPostingsPanel({
  initialRows,
}: {
  initialRows: JobPostingRow[];
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<NewJobFormState>({
    title: "",
    slug: "",
    department: "Technical",
    location: "Chennai",
    workMode: "Hybrid",
    experienceLevel: "Mid",
    experienceRange: "1-3",
    employmentType: "Full-time",
    team: "",
    salaryMinInr: "",
    salaryMaxInr: "",
    openings: "1",
    statusTagsCsv: "New",
    summary: "",
    skillsCsv: "",
    aboutRole: "",
    responsibilities: "",
    requiredQualifications: "",
    niceToHave: "",
    perks: "",
    interviewProcess:
      "Application Review (24-48 hours)\nTechnical Screening\nTechnical Interview\nHR Round\nOffer",
  });
  const [createdRows, setCreatedRows] = useState<JobPostingRow[]>([]);

  const rows = useMemo(() => {
    return [...createdRows, ...initialRows];
  }, [createdRows, initialRows]);

  function parseCsv(input: string) {
    return input
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parseMultiline(input: string) {
    return input
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleCreateJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const title = formState.title.trim();

    if (!title) {
      return;
    }

    setIsSaving(true);
    try {
      const salaryMin = Number.parseFloat(formState.salaryMinInr);
      const salaryMax = Number.parseFloat(formState.salaryMaxInr);

      const payloadBody: CreateJobRequest = {
        title,
        slug: formState.slug.trim() || undefined,
        department: formState.department,
        location: formState.location,
        workMode: formState.workMode,
        experienceLevel: formState.experienceLevel,
        experienceRange: formState.experienceRange,
        employmentType: formState.employmentType,
        team: formState.team.trim(),
        salaryMinInr: Number.isNaN(salaryMin) ? undefined : salaryMin,
        salaryMaxInr: Number.isNaN(salaryMax) ? undefined : salaryMax,
        openings: Math.max(1, Number.parseInt(formState.openings || "1", 10)),
        statusTags: parseCsv(formState.statusTagsCsv),
        summary: formState.summary.trim(),
        skills: parseCsv(formState.skillsCsv),
        aboutRole: parseMultiline(formState.aboutRole),
        responsibilities: parseMultiline(formState.responsibilities),
        requiredQualifications: parseMultiline(
          formState.requiredQualifications,
        ),
        niceToHave: parseMultiline(formState.niceToHave),
        perks: parseMultiline(formState.perks),
        interviewProcess: parseMultiline(formState.interviewProcess),
      };

      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadBody),
      });

      const payload = (await response.json()) as {
        message?: string;
        item?: JobPostingRow;
      };

      if (!response.ok || !payload.item) {
        setMessage(payload.message ?? "Failed to create job role.");
        return;
      }

      setCreatedRows((prev) => [payload.item!, ...prev]);
      setFormState({
        title: "",
        slug: "",
        department: "Technical",
        location: "Chennai",
        workMode: "Hybrid",
        experienceLevel: "Mid",
        experienceRange: "1-3",
        employmentType: "Full-time",
        team: "",
        salaryMinInr: "",
        salaryMaxInr: "",
        openings: "1",
        statusTagsCsv: "New",
        summary: "",
        skillsCsv: "",
        aboutRole: "",
        responsibilities: "",
        requiredQualifications: "",
        niceToHave: "",
        perks: "",
        interviewProcess:
          "Application Review (24-48 hours)\nTechnical Screening\nTechnical Interview\nHR Round\nOffer",
      });
      setIsFormOpen(false);
      setMessage("New job role added to database.");
    } catch {
      setMessage("Failed to create job role.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSyncStaticJobs() {
    setMessage("");
    setIsSyncing(true);
    try {
      const response = await fetch("/api/admin/jobs/sync", {
        method: "POST",
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setMessage(payload.message ?? "Failed to sync static jobs.");
        return;
      }

      setMessage(payload.message ?? "Static jobs synced successfully.");
    } catch {
      setMessage("Failed to sync static jobs.");
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <section className="glass-card mt-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl text-[#F0F4FF]">Job Postings</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSyncStaticJobs}
            disabled={isSyncing}
            className="rounded-full border border-[#1E3A5F] px-4 py-2 text-sm font-semibold text-[#F0F4FF] disabled:opacity-60"
          >
            {isSyncing ? "Syncing..." : "Sync jobs.ts to DB"}
          </button>
          <button
            type="button"
            onClick={() => setIsFormOpen((prev) => !prev)}
            className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
          >
            {isFormOpen ? "Cancel" : "Post New Job"}
          </button>
        </div>
      </div>

      {isFormOpen ? (
        <form onSubmit={handleCreateJob} className="mt-4 grid gap-5">
          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={formState.title}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Job title"
              required
              className="field-solid px-3 py-2 md:col-span-2"
            />
            <input
              value={formState.slug}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, slug: event.target.value }))
              }
              placeholder="Slug (optional)"
              className="field-solid px-3 py-2"
            />
            <select
              value={formState.department}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  department: event.target
                    .value as NewJobFormState["department"],
                }))
              }
              className="field-solid px-3 py-2"
            >
              <option value="Technical">Technical</option>
              <option value="Digital Marketing">Digital Marketing</option>
            </select>
            <select
              value={formState.location}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  location: event.target.value as NewJobFormState["location"],
                }))
              }
              className="field-solid px-3 py-2"
            >
              <option value="Chennai">Chennai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Remote">Remote</option>
            </select>
            <select
              value={formState.workMode}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  workMode: event.target.value as NewJobFormState["workMode"],
                }))
              }
              className="field-solid px-3 py-2"
            >
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
            <select
              value={formState.experienceLevel}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  experienceLevel: event.target
                    .value as NewJobFormState["experienceLevel"],
                }))
              }
              className="field-solid px-3 py-2"
            >
              <option value="Fresher">Fresher</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
            <select
              value={formState.experienceRange}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  experienceRange: event.target
                    .value as NewJobFormState["experienceRange"],
                }))
              }
              className="field-solid px-3 py-2"
            >
              <option value="0-1">0-1</option>
              <option value="1-3">1-3</option>
              <option value="3-5">3-5</option>
              <option value="5+">5+</option>
            </select>
            <select
              value={formState.employmentType}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  employmentType: event.target
                    .value as NewJobFormState["employmentType"],
                }))
              }
              className="field-solid px-3 py-2"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
            <input
              value={formState.team}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, team: event.target.value }))
              }
              placeholder="Team"
              className="field-solid px-3 py-2"
            />
            <input
              value={formState.salaryMinInr}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  salaryMinInr: event.target.value,
                }))
              }
              placeholder="Salary Min (INR)"
              className="field-solid px-3 py-2"
            />
            <input
              value={formState.salaryMaxInr}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  salaryMaxInr: event.target.value,
                }))
              }
              placeholder="Salary Max (INR)"
              className="field-solid px-3 py-2"
            />
            <input
              value={formState.openings}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  openings: event.target.value,
                }))
              }
              placeholder="Openings"
              className="field-solid px-3 py-2"
            />
            <input
              value={formState.statusTagsCsv}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  statusTagsCsv: event.target.value,
                }))
              }
              placeholder="Status tags (comma separated)"
              className="field-solid px-3 py-2 md:col-span-2"
            />
          </div>

          <div className="grid gap-3">
            <textarea
              value={formState.summary}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  summary: event.target.value,
                }))
              }
              placeholder="Summary (for card/listing)"
              rows={3}
              className="field-solid px-3 py-2"
            />
            <input
              value={formState.skillsCsv}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  skillsCsv: event.target.value,
                }))
              }
              placeholder="Skills (comma separated)"
              className="field-solid px-3 py-2"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <textarea
              value={formState.aboutRole}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  aboutRole: event.target.value,
                }))
              }
              placeholder="About the role (one point per line)"
              rows={6}
              className="field-solid px-3 py-2"
            />
            <textarea
              value={formState.responsibilities}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  responsibilities: event.target.value,
                }))
              }
              placeholder="Key responsibilities (one per line)"
              rows={6}
              className="field-solid px-3 py-2"
            />
            <textarea
              value={formState.requiredQualifications}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  requiredQualifications: event.target.value,
                }))
              }
              placeholder="Required qualifications (one per line)"
              rows={6}
              className="field-solid px-3 py-2"
            />
            <textarea
              value={formState.niceToHave}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  niceToHave: event.target.value,
                }))
              }
              placeholder="Nice to have (one per line)"
              rows={6}
              className="field-solid px-3 py-2"
            />
            <textarea
              value={formState.perks}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, perks: event.target.value }))
              }
              placeholder="Perks & benefits (one per line)"
              rows={6}
              className="field-solid px-3 py-2"
            />
            <textarea
              value={formState.interviewProcess}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  interviewProcess: event.target.value,
                }))
              }
              placeholder="Interview process (one step per line)"
              rows={6}
              className="field-solid px-3 py-2"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white"
            >
              {isSaving ? "Adding..." : "Add Role"}
            </button>
          </div>
        </form>
      ) : null}

      {message ? (
        <p className="mt-3 text-sm text-[#A8B8D8]">{message}</p>
      ) : null}

      <p className="mt-3 text-xs text-[#6B7FA3]">
        Roles added from this panel include all job detail modules and are saved
        in the database.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-195 text-left text-sm">
          <thead className="text-[#6B7FA3]">
            <tr>
              <th className="py-2">Title</th>
              <th>Department</th>
              <th>Applicants</th>
              <th>Status</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((job) => (
              <tr
                key={job.id}
                className="border-t border-[#1E3A5F] text-[#A8B8D8]"
              >
                <td className="py-3">{job.title}</td>
                <td>{job.department}</td>
                <td>{job.applicants}</td>
                <td>{job.status}</td>
                <td>{job.postedDaysAgo}d ago</td>
                <td>Edit · Close</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
