import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/public-shell";
import { JobBookmarkButton } from "@/components/jobs/job-bookmark-button";
import { ShareJobButton } from "@/components/jobs/share-job-button";
import { loadPublicJobBySlug, loadPublicJobs } from "@/lib/public-jobs";

function getExperienceLabel(level: "Fresher" | "Junior" | "Mid" | "Senior") {
  if (level === "Fresher") {
    return "Fresher";
  }

  if (level === "Senior") {
    return "3 to 5 years";
  }

  return "1 to 3 years";
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await loadPublicJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const similar = (await loadPublicJobs())
    .filter(
      (item) => item.department === job.department && item.slug !== job.slug,
    )
    .slice(0, 3);

  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-10">
        <nav className="text-sm text-[#6B7FA3]">
          <Link href="/">Home</Link> &gt; <Link href="/jobs">Jobs</Link> &gt;{" "}
          {job.title}
        </nav>

        <section className="glass-card mt-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag-badge px-3 py-1 text-xs">
              {job.department}
            </span>
            {job.statusTags.map((tag) => (
              <span key={tag} className="tag-badge px-3 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-3 font-(family-name:--font-space) text-4xl font-semibold text-[#F0F4FF]">
            {job.title}
          </h1>
          <p className="mt-3 text-sm text-[#6B7FA3]">
            {job.location} · {job.workMode} · Experience:{" "}
            {getExperienceLabel(job.experienceLevel)} · {job.type} · Posted{" "}
            {job.postedDaysAgo} days ago
          </p>
          <p className="mt-2 text-xl font-semibold text-[#2563EB]">
            {job.salaryRange}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={`/jobs/${job.slug}/apply`}
              className="rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Apply for this Role
            </a>
            <JobBookmarkButton slug={job.slug} title={job.title} />
            <ShareJobButton
              slug={job.slug}
              title={job.title}
              className="rounded-full border border-[#1E3A5F] px-4 py-2.5 text-sm text-[#F0F4FF]"
            />
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <article className="glass-card space-y-6 p-6">
            <section>
              <h2 className="font-(family-name:--font-space) text-2xl text-[#F0F4FF]">
                About the role
              </h2>
              <div className="mt-3 space-y-3 text-sm text-[#A8B8D8]">
                {job.aboutRole.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#F0F4FF]">
                Key responsibilities
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#A8B8D8]">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#F0F4FF]">
                Required qualifications
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#A8B8D8]">
                {job.requiredQualifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#F0F4FF]">
                Technical skills required
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span key={skill} className="tag-badge px-3 py-1 text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[#F0F4FF]">
                Interview process
              </h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#A8B8D8]">
                {job.interviewProcess.map((step: string) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          </article>

          <aside className="space-y-4">
            <div className="glass-card sticky top-24 p-5">
              <a
                href={`/jobs/${job.slug}/apply`}
                className="block rounded-full bg-[#2563EB] px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Apply Now
              </a>
              <p className="mt-3 text-xs text-[#6B7FA3]">
                {job.openings} openings · 42 people applied
              </p>

              <div className="mt-4 space-y-2 text-sm text-[#A8B8D8]">
                <p>Department: {job.department}</p>
                <p>Location: {job.location}</p>
                <p>Work Mode: {job.workMode}</p>
                <p>Type: {job.type}</p>
                <p>Experience: {getExperienceLabel(job.experienceLevel)}</p>
                <p>Salary: {job.salaryRange}</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="glass-card mt-6 p-6">
          <h3 className="text-lg font-semibold text-[#F0F4FF]">
            Similar roles
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <div key={item.id} className="glass-card rounded-xl p-3">
                <p className="text-sm font-semibold text-[#F0F4FF]">
                  {item.title}
                </p>
                <p className="text-xs text-[#6B7FA3]">{item.workMode}</p>
                <Link
                  href={`/jobs/${item.slug}`}
                  className="text-xs text-[#2563EB]"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
