import Image from "next/image";

import { PublicShell } from "@/components/public-shell";
import StackedScrollCards from "@/components/about/StackedScrollCards";
import MissionHorizontalScroll from "@/components/about/MissionHorizontalScroll";

export default function AboutPage() {
  return (
    <PublicShell>
      <main className="relative mx-auto w-full max-w-7xl px-5 py-10 pb-0 lg:px-10">
        <section className="glass-card rounded-3xl p-8">
          <h1 className="font-(family-name:--font-space) text-4xl text-[#93C5FD]">
            Turning Ideas Into High-Performance Software.
          </h1>
          <p className="mt-3 max-w-3xl text-[#A8B8D8]">
            Creinx is a premium software company blending elite design
            aesthetics with cutting-edge technology — engineering digital assets
            that drive tangible results.
          </p>
        </section>

        <section className="mt-7 grid gap-4 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-4 lg:p-6">
            <div className="flex h-full items-center justify-center">
              <Image
                src="/creinx-logo.png"
                alt="Creinx logo"
                width={900}
                height={300}
                className="about-logo-bounce h-auto w-full max-w-xl rounded-2xl object-contain"
                priority
              />
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 lg:p-8">
            <h2 className="font-(family-name:--font-space) text-3xl text-[#60A5FA]">
              The Creinx Story
            </h2>
            <p className="mt-4 max-w-4xl text-[#A8B8D8]">
              Creinx was born from a simple belief: great ideas deserve great
              execution.
            </p>

            <div className="mt-6 space-y-6 text-[#A8B8D8]">
              <div>
                <h3 className="mt-2 font-(family-name:--font-heading) text-xl text-[#F0F4FF]">
                  How It Started
                </h3>
                <p className="mt-2 max-w-4xl leading-7">
                  Creinx was founded by an elite team of engineers and designers
                  united by a single ethos: &quot;Build digital assets that
                  drive tangible results.&quot;
                </p>
                <p className="mt-2 max-w-4xl leading-7">
                  Rather than trying to do everything, we specialize in
                  delivering affordable premium solutions. From an SEO optimized
                  website to advanced scalable architecture, we engineer
                  future-ready platforms that consistently generate value.
                </p>
              </div>
              <div>
                <h3 className="font-(family-name:--font-heading) text-xl text-[#F0F4FF]">
                  The Gap
                </h3>
                <p className="mt-2 max-w-4xl leading-7">
                  We saw visionary businesses struggle to scale, not because
                  their ideas lacked potential, but because their digital
                  infrastructure could not keep up. Complex, outdated software
                  kills momentum.
                </p>
                <p className="mt-2 max-w-4xl leading-7">
                  As a modern website development company, we build
                  high-performance systems designed to accelerate growth, not
                  limit it. That gap became our launching platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        <StackedScrollCards />

        <MissionHorizontalScroll />
      </main>
    </PublicShell>
  );
}
