import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Megaphone,
  Sparkles,
} from "lucide-react";

import { jobOpenings, sectorMeta, type Sector } from "@/data/jobs";
import { TiltCard } from "@/components/home/tilt-card";

const sectors: Sector[] = ["technical", "digital-marketing"];

const sectorIcons: Record<Sector, typeof Code2> = {
  technical: Code2,
  "digital-marketing": Megaphone,
};

export function HomeCategories() {
  return (
    <section className="reveal-on-scroll mt-14 bg-[#0F1C3F]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7FA3]">
            <Sparkles size={14} aria-hidden="true" />
            Career Tracks
          </p>
          <h2 className="mt-2 font-(family-name:--font-heading) text-3xl text-[#F0F4FF]">
            Step Into Your Future
          </h2>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sectors.map((sector) => {
          const jobs = jobOpenings.filter((job) => job.sector === sector);
          const SectorIcon = sectorIcons[sector];

          return (
            <TiltCard
              key={sector}
              maxTilt={8}
              enableShine
              className="glass-card min-h-56 p-7 md:min-h-64 md:p-8 lg:min-h-72 lg:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="mt-4 font-(family-name:--font-heading) text-[34px] leading-tight text-[#F0F4FF]">
                  {sectorMeta[sector].title}
                </h3>
                <span className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-[#1E3A5F] bg-[rgba(37,99,235,0.12)] text-[#93C5FD]">
                  <SectorIcon size={24} aria-hidden="true" />
                </span>
              </div>

              <div className="mt-6 flex flex-col items-start gap-3">
                <p className="inline-flex items-center gap-2 text-[#93C5FD]">
                  <BriefcaseBusiness size={18} aria-hidden="true" />
                  {jobs.length} openings
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 text-base font-semibold text-[#93C5FD]"
                >
                  Browse roles
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}
