import { PublicShell } from "@/components/public-shell";
import StackedScrollCards from "@/components/about/StackedScrollCards";
import MissionHorizontalScroll from "@/components/about/MissionHorizontalScroll";
import { StoryBeam } from "@/components/about/story-beam";
import { Blocks, Sparkles, Workflow } from "lucide-react";

export default function AboutPage() {
  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-10">
        <section className="glass-card rounded-3xl p-8">
          <h1 className="font-(family-name:--font-space) text-4xl text-[#F0F4FF]">
            Turning Ideas Into High-Performance Software.
          </h1>
          <p className="mt-3 max-w-3xl text-[#A8B8D8]">
            Creinx is a premium software company blending elite design
            aesthetics with cutting-edge technology — engineering digital assets
            that drive tangible results.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="glass-card rounded-3xl border border-[#1E3A5F] bg-[linear-gradient(135deg,rgba(37,99,235,0.14),rgba(15,28,63,0.68)_35%,rgba(10,22,40,0.96)_100%)] p-7 lg:p-8">
            <p className="inline-flex rounded-full border border-[#2563EB]/50 bg-[#2563EB]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[2px] text-[#93C5FD]">
              Our Story
            </p>
            <h2 className="mt-4 max-w-3xl font-(family-name:--font-space) text-3xl leading-tight text-[#F0F4FF] lg:text-4xl">
              We Turned A Frustrating Gap Into A Product-First Engineering
              Studio.
            </h2>

            <div className="mt-6 space-y-4 text-[15px] leading-[1.85] text-[#A8B8D8]">
              <p>
                Creinx started with one recurring pattern: strong businesses had
                bold ideas, but weak software execution kept slowing them down.
                We saw teams burn time in brittle systems, patchwork tools, and
                platforms that looked modern but failed under real pressure.
              </p>
              <p>
                So we built Creinx around a clear promise: design with intent,
                engineer for scale, and ship for outcomes. From SEO-ready
                websites to high-performance web platforms, mobile experiences,
                and AI automations, every solution is built to move business
                metrics, not just launch a feature.
              </p>
              <p>
                Today we partner with ambitious startups and growth-stage teams
                to transform product ideas into reliable systems they can
                confidently scale.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#1E3A5F] bg-[#0A1628]/80 p-4">
                <p className="text-xs uppercase tracking-[2px] text-[#6B7FA3]">
                  Focus
                </p>
                <p className="mt-2 text-sm font-semibold text-[#F0F4FF]">
                  Product + Business Outcomes
                </p>
              </div>
              <div className="rounded-xl border border-[#1E3A5F] bg-[#0A1628]/80 p-4">
                <p className="text-xs uppercase tracking-[2px] text-[#6B7FA3]">
                  Approach
                </p>
                <p className="mt-2 text-sm font-semibold text-[#F0F4FF]">
                  Premium Design, Solid Engineering
                </p>
              </div>
              <div className="rounded-xl border border-[#1E3A5F] bg-[#0A1628]/80 p-4">
                <p className="text-xs uppercase tracking-[2px] text-[#6B7FA3]">
                  Delivery
                </p>
                <p className="mt-2 text-sm font-semibold text-[#F0F4FF]">
                  Built For Long-Term Scale
                </p>
              </div>
            </div>

            <StoryBeam />
          </article>

          <aside className="grid gap-4">
            <article className="glass-card rounded-2xl border border-[#1E3A5F] p-5">
              <p className="text-xs uppercase tracking-[2px] text-[#6B7FA3]">
                Then
              </p>
              <h3 className="mt-2 font-(family-name:--font-space) text-lg text-[#F0F4FF]">
                Fragmented Systems
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A8B8D8]">
                Businesses were trapped in disconnected tools and slow, fragile
                workflows.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#1E3A5F] bg-[#0A1628]/80 px-3 py-2 text-[#93C5FD]">
                <Blocks size={16} />
                <span className="text-xs uppercase tracking-[1.4px] text-[#6B7FA3]">
                  Siloed stack
                </span>
              </div>
            </article>

            <article className="glass-card rounded-2xl border border-[#1E3A5F] p-5">
              <p className="text-xs uppercase tracking-[2px] text-[#6B7FA3]">
                Now
              </p>
              <h3 className="mt-2 font-(family-name:--font-space) text-lg text-[#F0F4FF]">
                Unified Digital Engines
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A8B8D8]">
                We deliver scalable products where UX, performance, and growth
                strategy work as one system.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#1E3A5F] bg-[#0A1628]/80 px-3 py-2 text-[#93C5FD]">
                <Workflow size={16} />
                <span className="text-xs uppercase tracking-[1.4px] text-[#6B7FA3]">
                  Connected engine
                </span>
              </div>
            </article>

            <article className="rounded-2xl border border-[#2563EB]/40 bg-[#2563EB]/10 p-5">
              <p className="text-xs uppercase tracking-[2px] text-[#93C5FD]">
                Signature Belief
              </p>
              <p className="mt-2 font-(family-name:--font-space) text-lg leading-relaxed text-[#DBEAFE]">
                Great ideas deserve great execution and that execution should
                compound over time.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#2563EB]/45 bg-[#0F1C3F]/70 px-3 py-2 text-[#DBEAFE]">
                <Sparkles size={16} />
                <span className="text-xs uppercase tracking-[1.4px] text-[#BFDBFE]">
                  Outcome first
                </span>
              </div>
            </article>
          </aside>
        </section>

        <StackedScrollCards />

        <MissionHorizontalScroll />
      </main>
    </PublicShell>
  );
}
