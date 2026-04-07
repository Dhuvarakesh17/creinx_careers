import type { RefObject } from "react";

interface HomeStatsProps {
  statRef: RefObject<HTMLDivElement | null>;
  openRoles: number;
  teamSize: number;
  yearsActive: number;
  projectsDelivered: number;
}

export function HomeStats({
  statRef,
  openRoles,
  teamSize,
  yearsActive,
  projectsDelivered,
}: HomeStatsProps) {
  return (
    <section
      ref={statRef}
      className="glass-card reveal-on-scroll mt-8 grid grid-cols-2 divide-x divide-y divide-[#1E3A5F] overflow-hidden text-center md:grid-cols-4 md:divide-y-0"
    >
      <div className="p-6">
        <p className="text-3xl font-bold text-[#F0F4FF]" data-count={openRoles}>
          0
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#A8B8D8]">
          Open Roles
        </p>
      </div>
      <div className="p-6">
        <p className="text-3xl font-bold text-[#F0F4FF]" data-count={teamSize}>
          0
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#A8B8D8]">
          Team Members
        </p>
      </div>
      <div className="p-6">
        <p
          className="text-3xl font-bold text-[#F0F4FF]"
          data-count={yearsActive}
        >
          0
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#A8B8D8]">
          Years Active
        </p>
      </div>
      <div className="p-6">
        <p
          className="text-3xl font-bold text-[#F0F4FF]"
          data-count={projectsDelivered}
        >
          0
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#A8B8D8]">
          Projects Delivered
        </p>
      </div>
    </section>
  );
}
