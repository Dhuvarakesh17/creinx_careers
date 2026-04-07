"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { JobsEmptyState } from "@/components/jobs/jobs-empty-state";
import { JobsFilterBar } from "@/components/jobs/jobs-filter-bar";
import { JobsPagination } from "@/components/jobs/jobs-pagination";
import { JobsResultsToolbar } from "@/components/jobs/jobs-results-toolbar";
import { JobsSearchBar } from "@/components/jobs/jobs-search-bar";
import { PublicShell } from "@/components/public-shell";
import { jobOpenings, type JobOpening } from "@/data/jobs";
import { useJobFilters } from "@/hooks/use-job-filters";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

function matchesLocation(job: JobOpening, filter: string) {
  if (filter === "All") {
    return true;
  }
  return job.location === filter || job.workMode === filter;
}

export default function JobsPage() {
  const { filters, effectiveFilters, setFilters, resetFilters } =
    useJobFilters();
  const [location, setLocation] = useState("All");
  const [department, setDepartment] = useState<
    "All" | "Technical" | "Digital Marketing"
  >("All");
  const [experience, setExperience] = useState("All Levels");
  const [workMode, setWorkMode] = useState<
    "All" | "Remote" | "Hybrid" | "Onsite"
  >("All");
  const [jobType, setJobType] = useState<
    "All" | "Full-time" | "Part-time" | "Internship" | "Contract"
  >("All");
  const [sortBy, setSortBy] = useState("Newest First");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem("saved-jobs");
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  });

  function toggleBookmark(slug: string) {
    setBookmarks((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug];
      window.localStorage.setItem("saved-jobs", JSON.stringify(next));
      return next;
    });
  }

  const filtered = useMemo(() => {
    let items = [...jobOpenings];

    if (effectiveFilters.query.trim()) {
      const text = effectiveFilters.query.toLowerCase();
      items = items.filter(
        (job) =>
          job.title.toLowerCase().includes(text) ||
          job.skills.join(" ").toLowerCase().includes(text) ||
          job.summary.toLowerCase().includes(text),
      );
    }

    if (department !== "All") {
      items = items.filter((job) => job.department === department);
    }

    if (location !== "All") {
      items = items.filter((job) => matchesLocation(job, location));
    }

    if (workMode !== "All") {
      items = items.filter((job) => job.workMode === workMode);
    }

    if (jobType !== "All") {
      items = items.filter((job) => job.type === jobType);
    }

    if (experience !== "All Levels") {
      items = items.filter((job) => {
        if (experience === "Fresher") return job.experienceRange === "0-1";
        if (experience === "1-3 Years") return job.experienceRange === "1-3";
        if (experience === "3-5 Years") return job.experienceRange === "3-5";
        if (experience === "5+ Years") return job.experienceRange === "5+";
        return true;
      });
    }

    items.sort((a, b) => {
      if (sortBy === "Newest First") {
        return a.postedDaysAgo - b.postedDaysAgo;
      }
      if (sortBy === "Oldest First") {
        return b.postedDaysAgo - a.postedDaysAgo;
      }
      const salaryA =
        Number.parseInt(a.salaryRange.replace(/\D/g, ""), 10) || 0;
      const salaryB =
        Number.parseInt(b.salaryRange.replace(/\D/g, ""), 10) || 0;
      if (sortBy === "Salary High-Low") {
        return salaryB - salaryA;
      }
      if (sortBy === "Salary Low-High") {
        return salaryA - salaryB;
      }
      return 0;
    });

    return items;
  }, [
    department,
    effectiveFilters.query,
    experience,
    jobType,
    location,
    sortBy,
    workMode,
  ]);

  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedJobs = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const activeFilters = [
    department !== "All" ? `Department: ${department}` : null,
    location !== "All" ? `Location: ${location}` : null,
    experience !== "All Levels" ? `Experience: ${experience}` : null,
    workMode !== "All" ? `Work Mode: ${workMode}` : null,
    jobType !== "All" ? `Job Type: ${jobType}` : null,
  ].filter(Boolean) as string[];

  function clearFilters() {
    setLocation("All");
    setDepartment("All");
    setExperience("All Levels");
    setWorkMode("All");
    setJobType("All");
    setSortBy("Newest First");
    resetFilters();
  }

  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-7xl bg-[#0F1C3F] px-5 py-10 text-[#F0F4FF] lg:px-10">
        <section className="rounded-3xl border border-transparent bg-transparent p-8">
          <h1 className="font-(family-name:--font-space) text-4xl text-[#F0F4FF]">
            Open Positions at CREINX
          </h1>
          <p className="mt-3 text-[#A8B8D8]">
            Showing {filtered.length} open roles across 2 departments.
          </p>
        </section>

        <section className="glass-card mt-6 p-4">
          <JobsSearchBar
            query={filters.query}
            location={location}
            onQueryChange={(value) =>
              setFilters((prev) => ({ ...prev, query: value }))
            }
            onLocationChange={setLocation}
          />

          <JobsFilterBar
            department={department}
            workMode={workMode}
            jobType={jobType}
            experience={experience}
            sortBy={sortBy}
            onDepartmentChange={setDepartment}
            onWorkModeChange={setWorkMode}
            onJobTypeChange={setJobType}
            onExperienceChange={setExperience}
            onSortByChange={setSortBy}
          />

          {activeFilters.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeFilters.map((chip) => (
                <span
                  key={chip}
                  className="pill-filter-active rounded-full px-3 py-1 text-xs"
                >
                  {chip}
                </span>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto text-xs text-[#2563EB] underline"
              >
                Clear all
              </button>
            </div>
          ) : null}
        </section>

        <JobsResultsToolbar
          count={filtered.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {pagedJobs.length === 0 ? (
          <JobsEmptyState onClear={clearFilters} />
        ) : (
          <section
            className={cn(
              "mt-6 gap-4",
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3"
                : "grid grid-cols-1",
            )}
          >
            {pagedJobs.map((job) => {
              const bookmarked = bookmarks.includes(job.slug);
              return (
                <article
                  key={job.id}
                  className="glass-card p-5 text-[#F0F4FF] transition hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_0_20px_rgba(37,99,235,0.14)]"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "inline-flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold",
                        job.department === "Technical"
                          ? "bg-blue-500/20 text-blue-200"
                          : "bg-emerald-500/20 text-emerald-200",
                      )}
                    >
                      {job.department === "Technical" ? "TE" : "DM"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(job.slug)}
                      className="text-lg text-[#A8B8D8]"
                      suppressHydrationWarning
                    >
                      {bookmarked ? "★" : "☆"}
                    </button>
                  </div>
                  <h3 className="mt-3 font-(family-name:--font-space) text-lg font-semibold text-[#F0F4FF]">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#A8B8D8]">{job.team}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="tag-badge px-2 py-1">
                      {job.department}
                    </span>
                    {job.statusTags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "tag-badge rounded-md px-2 py-1",
                          tag === "New"
                            ? "border-[#2563EB] text-[#A8B8D8]"
                            : tag === "Urgent"
                              ? "border-[#2563EB] text-[#A8B8D8]"
                              : "",
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-[#6B7FA3]">
                    {job.location} · {job.workMode}
                  </p>
                  <p className="text-sm text-[#6B7FA3]">
                    {job.experienceLevel} · {job.type}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="tag-badge px-2 py-1 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#93C5FD]">
                    {job.salaryRange}
                  </p>
                  <p className="mt-1 text-xs text-[#6B7FA3]">
                    Posted {job.postedDaysAgo} days ago
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="rounded-full border border-[#1E3A5F] px-4 py-2 text-xs text-[#F0F4FF]"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/jobs/${job.slug}/apply`}
                      className="rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white"
                    >
                      Quick Apply
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {filtered.length > pageSize ? (
          <JobsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        ) : null}
      </main>
    </PublicShell>
  );
}
