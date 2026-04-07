import Link from "next/link";
import { Code2, Megaphone } from "lucide-react";

import { jobOpenings, sectorMeta, type Sector } from "@/data/jobs";
import { TiltCard } from "@/components/home/tilt-card";

const sectors: Sector[] = ["technical", "digital-marketing"];

const sectorIcons: Record<Sector, typeof Code2> = {
  technical: Code2,
  "digital-marketing": Megaphone,
};

export function HomeCategories() {
  return (
    <section className="reveal-on-scroll mt-14 grid gap-6 bg-[#0F1C3F] lg:grid-cols-2">
      {sectors.map((sector) => {
        const jobs = jobOpenings.filter((job) => job.sector === sector);
        const SectorIcon = sectorIcons[sector];

        return (
          <TiltCard
            key={sector}
            maxTilt={8}
            enableShine
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="mt-3 font-(family-name:--font-heading) text-2xl text-[#F0F4FF]">
                {sectorMeta[sector].title}
              </h3>
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1E3A5F] bg-[rgba(37,99,235,0.12)] text-[#93C5FD]">
                <SectorIcon size={20} aria-hidden="true" />
              </span>
            </div>

            <p className="mt-4 text-[#93C5FD]">{jobs.length} openings</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {jobs
                .flatMap((job) => job.skills)
                .slice(0, 4)
                .map((skill) => (
                  <span
                    key={`${sector}-${skill}`}
                    className="tag-badge px-3 py-1 text-xs"
                  >
                    {skill}
                  </span>
                ))}
            </div>
            <Link
              href="/jobs"
              className="mt-5 inline-flex text-sm font-semibold text-[#93C5FD]"
            >
              Browse roles →
            </Link>
          </TiltCard>
        );
      })}
    </section>
  );
}
