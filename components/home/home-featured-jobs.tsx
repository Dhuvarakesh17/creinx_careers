"use client";

import { motion } from "framer-motion";

import { jobOpenings, type JobOpening } from "@/data/jobs";
import { TiltCard } from "@/components/home/tilt-card";

function getExperienceLabel(level: JobOpening["experienceLevel"]) {
  if (level === "Fresher") {
    return "Fresher";
  }

  if (level === "Senior") {
    return "3 to 5 years";
  }

  return "1 to 3 years";
}

function FeaturedJobCard({ job }: { job: JobOpening }) {
  return (
    <TiltCard className="glass-card group flex h-full flex-col rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,28,63,0.08)] hover:border-[#2563EB]/40">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-(family-name:--font-space) text-xl text-[#F0F4FF]">
          {job.title}
        </h3>
        <span
          className={`rounded-full bg-[#EFF6FF] px-3 py-1 text-xs text-[#2563EB] ${
            job.department === "Digital Marketing"
              ? "max-w-24 whitespace-normal text-center leading-tight"
              : "whitespace-nowrap"
          }`}
        >
          {job.department}
        </span>
      </div>
      <p className="mt-3 text-sm text-[#A8B8D8]">
        {job.location} · {job.workMode} · Experience:{" "}
        {getExperienceLabel(job.experienceLevel)}
      </p>
      <p className="mt-1 text-sm text-[#2563EB]">{job.salaryRange}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="tag-badge px-2.5 py-1 text-xs">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-4">
        <p className="text-xs text-[#94A3B8]">
          Posted {job.postedDaysAgo} days ago
        </p>
        <a
          href={`/jobs/${job.slug}/apply`}
          className="mt-4 inline-flex rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
        >
          Quick Apply
        </a>
      </div>
    </TiltCard>
  );
}

export function HomeFeaturedJobs() {
  const featuredJobs = jobOpenings.slice(0, 6);

  return (
    <section className="mt-14">
      <h2 className="reveal-on-scroll font-(family-name:--font-heading) text-3xl text-[#F0F4FF]">
        Featured Creinx Roles
      </h2>
      <div className="mt-6 grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featuredJobs.map((job) => (
          <motion.div
            key={job.id}
            className="reveal-on-scroll h-full"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <FeaturedJobCard job={job} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
