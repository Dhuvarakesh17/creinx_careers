"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type CardData = {
  number: string;
  label: string;
  title: string;
  description: string;
  tags: string[];
  background: string;
  visual: "code" | "phone" | "neural" | "chart";
};

const cards: CardData[] = [
  {
    number: "01",
    label: "01 ENGINEERING",
    title: "Web Applications",
    description:
      "We engineer high-performance web apps and platforms built for speed, scale, and conversion. Every line of code written with purpose.",
    tags: ["Next.js", "React", "Node.js", "PostgreSQL"],
    background: "#0F1729",
    visual: "code",
  },
  {
    number: "02",
    label: "02 ENGINEERING",
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile applications delivering premium experiences on iOS and Android.",
    tags: ["React Native", "Flutter", "iOS", "Android"],
    background: "#0A1628",
    visual: "phone",
  },
  {
    number: "03",
    label: "03 INTELLIGENCE",
    title: "AI Automation",
    description:
      "Intelligent automation systems that eliminate repetitive work surface insights and unlock new growth opportunities.",
    tags: ["Python", "OpenAI", "LangChain", "n8n"],
    background: "#111827",
    visual: "neural",
  },
  {
    number: "04",
    label: "04 GROWTH",
    title: "Digital Marketing",
    description:
      "Performance driven marketing combining SEO paid campaigns and analytics to scale demand and drive measurable results.",
    tags: ["SEO", "Google Ads", "Meta Ads", "GA4"],
    background: "#0D1B2A",
    visual: "chart",
  },
];

function CardVisual({ visual }: { visual: CardData["visual"] }) {
  if (visual === "code") {
    return (
      <div className="h-full rounded-2xl bg-[#0A1628] p-5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#FB7185]" />
          <span className="h-3 w-3 rounded-full bg-[#FBBF24]" />
          <span className="h-3 w-3 rounded-full bg-[#34D399]" />
        </div>
        <div className="mt-5 space-y-3 text-sm">
          <div className="code-line code-line-1 h-2 rounded bg-[#3B82F6]/60" />
          <div className="code-line code-line-2 h-2 rounded bg-[#A78BFA]/60" />
          <div className="code-line code-line-3 h-2 rounded bg-[#22D3EE]/60" />
          <div className="code-line code-line-4 h-2 rounded bg-[#F59E0B]/60" />
          <div className="code-line code-line-5 h-2 rounded bg-[#10B981]/60" />
        </div>
      </div>
    );
  }

  if (visual === "phone") {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl bg-[#0A1628] p-6">
        <div className="h-full max-h-105 w-55 rounded-[36px] border-2 border-white/20 bg-[#0F1729] p-3">
          <div className="relative h-full overflow-hidden rounded-[28px] bg-linear-to-b from-[#2563EB] via-[#22D3EE] to-[#0EA5E9]">
            <div className="phone-sheen absolute -left-1/3 top-0 h-full w-1/3 bg-linear-to-r from-transparent via-white/35 to-transparent" />
            <div className="absolute inset-x-4 top-4 h-3 rounded-full bg-white/30" />
            <div className="absolute inset-x-6 top-11 h-2 rounded-full bg-white/20" />
            <div className="absolute inset-x-8 top-17 h-2 rounded-full bg-white/20" />
            <div className="absolute bottom-8 left-1/2 h-14 w-14 -translate-x-1/2 rounded-2xl bg-white/30" />
          </div>
        </div>
      </div>
    );
  }

  if (visual === "neural") {
    return (
      <div className="relative h-full overflow-hidden rounded-2xl bg-[#0A1628] p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.25),transparent_45%),radial-gradient(circle_at_68%_32%,rgba(167,139,250,0.22),transparent_40%)]" />

        <div className="relative z-10 mx-auto mt-3 h-52 w-52 rounded-full border border-white/20 bg-[#0F1729]/80">
          <div className="neural-ring neural-ring-outer absolute inset-3 rounded-full border border-[#60A5FA]/40" />
          <div className="neural-ring neural-ring-inner absolute inset-7 rounded-full border border-[#A78BFA]/40" />
          <div className="neural-core absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-b from-[#38BDF8] to-[#2563EB] shadow-[0_0_40px_rgba(56,189,248,0.35)]" />
          <span className="neural-node neural-node-1 absolute left-8 top-10 h-2.5 w-2.5 rounded-full bg-[#7DD3FC]" />
          <span className="neural-node neural-node-2 absolute right-9 top-14 h-2.5 w-2.5 rounded-full bg-[#A78BFA]" />
          <span className="neural-node neural-node-3 absolute bottom-11 left-10 h-2.5 w-2.5 rounded-full bg-[#22D3EE]" />
          <span className="neural-node neural-node-4 absolute bottom-10 right-8 h-2.5 w-2.5 rounded-full bg-[#60A5FA]" />
        </div>

        <div className="relative z-10 mt-6 grid grid-cols-3 gap-3 text-center text-[11px] text-[#A8B8D8]">
          <div className="neural-chip rounded-lg border border-white/10 bg-white/5 px-2 py-2">
            Input
          </div>
          <div className="neural-chip rounded-lg border border-white/10 bg-white/5 px-2 py-2">
            Model
          </div>
          <div className="neural-chip rounded-lg border border-white/10 bg-white/5 px-2 py-2">
            Output
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-end gap-4 rounded-2xl bg-[#0A1628] px-8 pb-8">
      <div className="chart-bar h-[30%] w-12 rounded-t-md bg-[#38BDF8]/70" />
      <div className="chart-bar h-[52%] w-12 rounded-t-md bg-[#60A5FA]/75" />
      <div className="chart-bar h-[75%] w-12 rounded-t-md bg-[#818CF8]/80" />
      <div className="chart-bar h-[90%] w-12 rounded-t-md bg-[#2563EB]/90" />
    </div>
  );
}

export default function StackedScrollCards() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const track =
        sectionRef.current?.querySelector<HTMLElement>(".stack-track");
      const layers = gsap.utils.toArray<HTMLElement>(
        ".stack-layer",
        sectionRef.current,
      );
      const panels = gsap.utils.toArray<HTMLElement>(
        ".stack-panel",
        sectionRef.current,
      );

      if (!track || !layers.length || !panels.length) {
        return;
      }

      gsap.set(layers, {
        yPercent: (index) => (index === 0 ? 0 : 110),
      });

      gsap.set(panels, { scale: 1 });

      const firstContent = layers[0].querySelectorAll<HTMLElement>(
        "[data-content-item]",
      );
      gsap.fromTo(
        firstContent,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          scrollTrigger: {
            trigger: track,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      for (let index = 1; index < cards.length; index += 1) {
        const incomingLayer = layers[index];
        const outgoingPanel = panels[index - 1];
        const incomingContent = incomingLayer.querySelectorAll<HTMLElement>(
          "[data-content-item]",
        );

        timeline
          .to(
            outgoingPanel,
            { scale: 0.95, duration: 1, ease: "none" },
            index - 1,
          )
          .to(
            incomingLayer,
            { yPercent: 0, duration: 1, ease: "power3.out" },
            index - 1,
          )
          .fromTo(
            incomingContent,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: "cubic-bezier(0.16, 1, 0.3, 1)",
            },
            index - 0.85,
          );
      }

      ScrollTrigger.refresh();
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative mt-8">
      <div className="hidden md:block">
        <div className="stack-track relative h-[260vh]">
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="relative h-full w-full">
              {cards.map((card) => (
                <div
                  key={card.number}
                  className="stack-layer absolute inset-0 flex h-screen w-full items-center justify-center"
                  style={{ zIndex: Number(card.number) }}
                >
                  <article
                    className="stack-panel relative mx-auto flex h-[80vh] w-full overflow-hidden rounded-3xl"
                    style={{ backgroundColor: card.background }}
                  >
                    <span className="pointer-events-none absolute right-6 top-3 font-(family-name:--font-cabinet-grotesk) text-[120px] font-extrabold leading-none text-white/4">
                      {card.number}
                    </span>

                    <div className="flex w-full">
                      <div className="flex w-1/2 flex-col justify-center px-12 py-10">
                        <p
                          data-content-item
                          className="font-(family-name:--font-satoshi) text-[11px] uppercase tracking-[3px] text-[#6B7FA3]"
                        >
                          {card.label}
                        </p>
                        <h3
                          data-content-item
                          className="mt-4 font-(family-name:--font-cabinet-grotesk) text-[48px] font-bold tracking-[-1.5px] text-[#F0F4FF]"
                        >
                          {card.title}
                        </h3>
                        <p
                          data-content-item
                          className="mt-5 max-w-105 font-(family-name:--font-satoshi) text-[17px] leading-[1.75] text-[#A8B8D8]"
                        >
                          {card.description}
                        </p>
                        <div
                          data-content-item
                          className="mt-6 flex flex-wrap gap-2"
                        >
                          {card.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-[#1E3A5F] bg-[#0A1628] px-3.5 py-1.5 font-(family-name:--font-satoshi) text-[12px] text-[#A8B8D8]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div data-content-item className="mt-8">
                          <Link
                            href="/jobs"
                            className="inline-flex rounded-full bg-[#2563EB] px-6 py-2.5 font-(family-name:--font-satoshi) text-sm font-semibold text-white"
                          >
                            View Roles
                          </Link>
                        </div>
                      </div>

                      <div className="w-1/2 p-10">
                        <div className="h-full rounded-2xl border border-white/10 bg-white/3 p-4">
                          <CardVisual visual={card.visual} />
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:hidden">
        {cards.map((card) => (
          <article
            key={`mobile-${card.number}`}
            className="relative overflow-hidden rounded-3xl px-6 py-8"
            style={{ backgroundColor: card.background }}
          >
            <span className="pointer-events-none absolute right-4 top-2 font-(family-name:--font-cabinet-grotesk) text-[72px] font-extrabold leading-none text-white/4">
              {card.number}
            </span>
            <p className="font-(family-name:--font-satoshi) text-[11px] uppercase tracking-[3px] text-[#6B7FA3]">
              {card.label}
            </p>
            <h3 className="mt-3 font-(family-name:--font-cabinet-grotesk) text-[34px] font-bold tracking-[-1px] text-[#F0F4FF]">
              {card.title}
            </h3>
            <p className="mt-4 font-(family-name:--font-satoshi) text-[16px] leading-[1.7] text-[#A8B8D8]">
              {card.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={`mobile-${card.number}-${tag}`}
                  className="rounded-md border border-[#1E3A5F] bg-[#0A1628] px-3.5 py-1.5 font-(family-name:--font-satoshi) text-[12px] text-[#A8B8D8]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/jobs"
                className="inline-flex rounded-full bg-[#2563EB] px-6 py-2.5 font-(family-name:--font-satoshi) text-sm font-semibold text-white"
              >
                View Roles
              </Link>
            </div>
            <div className="mt-6 h-65 rounded-2xl border border-white/10 bg-white/3 p-4">
              <CardVisual visual={card.visual} />
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .code-line {
          animation: codeLineFlow 3.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-origin: left center;
        }

        .code-line-1 {
          width: 76%;
          animation-delay: 0s;
        }

        .code-line-2 {
          width: 63%;
          animation-delay: 0.15s;
        }

        .code-line-3 {
          width: 84%;
          animation-delay: 0.3s;
        }

        .code-line-4 {
          width: 51%;
          animation-delay: 0.45s;
        }

        .code-line-5 {
          width: 58%;
          animation-delay: 0.6s;
        }

        .phone-sheen {
          animation: phoneSheen 2.6s ease-in-out infinite;
        }

        .neural-ring {
          transform-origin: center;
        }

        .neural-ring-outer {
          animation: spinSlow 8s linear infinite;
        }

        .neural-ring-inner {
          animation: spinReverse 6s linear infinite;
        }

        .neural-core {
          animation: corePulse 2.4s ease-in-out infinite;
        }

        .neural-node {
          animation: nodePulse 2.2s ease-in-out infinite;
        }

        .neural-node-2 {
          animation-delay: 0.2s;
        }

        .neural-node-3 {
          animation-delay: 0.4s;
        }

        .neural-node-4 {
          animation-delay: 0.6s;
        }

        .neural-chip {
          animation: chipFloat 3s ease-in-out infinite;
        }

        .neural-chip:nth-child(2) {
          animation-delay: 0.2s;
        }

        .neural-chip:nth-child(3) {
          animation-delay: 0.4s;
        }

        .chart-bar {
          animation:
            chartRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both,
            chartWave 2.4s ease-in-out infinite;
          transform-origin: bottom;
        }

        .chart-bar:nth-child(2) {
          animation-delay: 0.08s, 0.2s;
        }

        .chart-bar:nth-child(3) {
          animation-delay: 0.16s, 0.4s;
        }

        .chart-bar:nth-child(4) {
          animation-delay: 0.24s, 0.6s;
        }

        @keyframes codeLineFlow {
          0%,
          100% {
            opacity: 0.45;
            transform: scaleX(0.72);
          }
          35% {
            opacity: 1;
            transform: scaleX(1);
          }
          70% {
            opacity: 0.8;
            transform: scaleX(0.86);
          }
        }

        @keyframes phoneSheen {
          0%,
          20% {
            transform: translateX(-120%);
            opacity: 0;
          }
          50% {
            transform: translateX(40%);
            opacity: 0.9;
          }
          100% {
            transform: translateX(190%);
            opacity: 0;
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 24px rgba(56, 189, 248, 0.28);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
            box-shadow: 0 0 42px rgba(56, 189, 248, 0.45);
          }
        }

        @keyframes chipFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes nodePulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.35);
            opacity: 1;
          }
        }

        @keyframes chartRise {
          from {
            transform: scaleY(0.35);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes chartWave {
          0%,
          100% {
            transform: scaleY(0.84);
          }
          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </section>
  );
}
