import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { jobOpenings } from "@/data/jobs";
import { AdminJobPostingsPanel } from "@/components/admin/admin-job-postings-panel";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const statusFlow = [
  "New",
  "In Review",
  "Shortlisted",
  "Interview Scheduled",
  "Offer Sent",
  "Hired",
  "Rejected",
];

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) {
    redirect("/admin/login");
  }

  const supabase = getSupabaseAdmin();
  const { data: jobsRows } = await supabase
    .from("jobs_with_posted_days")
    .select("id, title, department, live_posted_days_ago, created_at")
    .order("created_at", { ascending: false });

  const dbRows = (jobsRows ?? []).map((job) => {
    return {
      id: String(job.id),
      title: String(job.title),
      department:
        String(job.department) === "digital-marketing"
          ? ("Digital Marketing" as const)
          : ("Technical" as const),
      applicants: 0,
      postedDaysAgo: Number(job.live_posted_days_ago ?? 0),
      status: "Active" as const,
    };
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-10 lg:px-10">
      <header className="glass-card flex items-center justify-between p-5">
        <div>
          <h1 className="font-(family-name:--font-space) text-3xl text-[#F0F4FF]">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#A8B8D8]">
            Internal hiring operations panel
          </p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="rounded-full border border-[#1E3A5F] px-4 py-2 text-sm text-[#F0F4FF]"
          >
            Logout
          </button>
        </form>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ["Total Applications", "124"],
          ["New Today", "9"],
          ["Under Review", "37"],
          ["Shortlisted", "14"],
        ].map(([label, value]) => (
          <article key={label} className="glass-card rounded-xl p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#6B7FA3]">
              {label}
            </p>
            <p className="mt-2 text-3xl text-[#F0F4FF]">{value}</p>
          </article>
        ))}
      </section>

      <AdminJobPostingsPanel
        initialRows={
          dbRows.length > 0
            ? dbRows
            : jobOpenings.map((job) => ({
                id: job.id,
                title: job.title,
                department: job.department,
                applicants: Math.max(12, job.openings * 6),
                postedDaysAgo: job.postedDaysAgo,
                status: "Active" as const,
              }))
        }
      />

      <section className="glass-card mt-6 p-5">
        <h2 className="text-xl text-[#F0F4FF]">Applications Management</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            placeholder="Search applicant"
            className="field-solid px-3 py-2"
          />
          <select className="field-solid px-3 py-2">
            <option>All Roles</option>
          </select>
          <select className="field-solid px-3 py-2">
            <option>All Departments</option>
          </select>
          <select className="field-solid px-3 py-2">
            <option>All Status</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="text-[#6B7FA3]">
              <tr>
                <th className="py-2">Applicant</th>
                <th>Role</th>
                <th>Email</th>
                <th>Experience</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobOpenings.slice(0, 6).map((job, index) => (
                <tr
                  key={job.id}
                  className="border-t border-[#1E3A5F] text-[#A8B8D8]"
                >
                  <td className="py-3">Candidate {index + 1}</td>
                  <td>{job.title}</td>
                  <td>candidate{index + 1}@mail.com</td>
                  <td>{job.experienceLevel}</td>
                  <td>{job.postedDaysAgo + 1}d ago</td>
                  <td>
                    <select className="field-solid rounded px-2 py-1 text-xs">
                      {statusFlow.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>View · Resume · Notes</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
