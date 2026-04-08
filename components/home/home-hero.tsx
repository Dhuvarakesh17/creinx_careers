import Link from "next/link";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/hero-scene"), {
  ssr: false,
});

interface HomeHeroProps {
  openRoles: number;
}

export function HomeHero({ openRoles }: HomeHeroProps) {
  return (
    <section className="relative isolate -mx-5 min-h-screen overflow-hidden bg-[#0F1C3F] lg:-mx-10">
      <div className="absolute right-0 top-0 bottom-0 z-0 hidden lg:block lg:w-1/2 -translate-y-20">
        <HeroScene objectType="sphere" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col justify-between p-7 lg:p-14 lg:w-1/2">
        <div className="max-w-4xl">
          <p className="hero-badge text-sm uppercase tracking-[0.25em] text-[#93C5FD]">
            Now Hiring — Chennai and Remote
          </p>
          <h1 className="hero-headline mt-4 max-w-3xl font-(family-name:--font-heading) text-4xl leading-tight text-[#F0F4FF] md:text-6xl">
            <span className="inline-block pr-2">Turning</span>
            <span className="inline-block pr-2">Ideas</span>
            <span className="inline-block pr-2">Into</span>
            <span className="inline-block pr-2">High-Performance</span>
            <span className="inline-block">Careers.</span>
          </h1>
          <p className="hero-subtitle mt-5 max-w-2xl text-base text-[#A8B8D8] md:text-lg">
            Creinx is a premium software company engineering scalable web apps,
            mobile apps, and AI automations. We are hiring elite engineers and
            digital marketers who build with intention.
          </p>

          <div className="hero-pill mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(37,99,235,0.3)] bg-[rgba(37,99,235,0.15)] px-4 py-1.5 text-sm text-[#93C5FD]">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#2563EB]" />
            {openRoles} positions open right now
          </div>

          <div className="hero-buttons mt-8 flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="rounded-full bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white"
            >
              Explore Open Roles
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.04)] px-5 py-3 text-sm font-semibold text-[#E2E8F8]"
            >
              About Our Company
            </Link>
          </div>
        </div>

        <p className="hero-scroll mt-10 text-sm text-[#A8B8D8]">
          Scroll to explore ↓
        </p>
      </div>
    </section>
  );
}
