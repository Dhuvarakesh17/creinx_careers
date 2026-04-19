"use client";

import { motion, type MotionProps } from "motion/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FoundationItem = {
  id: number;
  label: string;
  title: string;
  description: string;
  icon: "mission" | "vision" | "values" | "why";
};

export function throttle(fn: () => void, wait: number) {
  let shouldWait = false;

  return function throttledFunction() {
    if (!shouldWait) {
      fn();
      shouldWait = true;
      window.setTimeout(() => {
        shouldWait = false;
      }, wait);
    }
  };
}

const items: FoundationItem[] = [
  {
    id: 1,
    label: "MISSION",
    title: "Our Mission",
    description:
      "To empower businesses by delivering cutting-edge reliable and scalable software solutions.",
    icon: "mission",
  },
  {
    id: 2,
    label: "VISION",
    title: "Our Vision",
    description:
      "To build software that empowers businesses globally and create our own products that solve real problems.",
    icon: "vision",
  },
  {
    id: 3,
    label: "VALUES",
    title: "Our Values",
    description:
      "Clarity. Function. Scalability. Partnership. These four principles guide every decision we make and every product we build.",
    icon: "values",
  },
  {
    id: 4,
    label: "DELIVERY MODEL",
    title: "Execution First",
    description:
      "We focus on outcomes, not noise. Every sprint and deliverable is shaped for business impact and measurable progress.",
    icon: "why",
  },
  {
    id: 5,
    label: "WORKING STYLE",
    title: "Transparent Partnership",
    description:
      "You get clear timelines, honest trade-offs, and full visibility across design, development, and deployment.",
    icon: "why",
  },
  {
    id: 6,
    label: "ARCHITECTURE",
    title: "Built To Scale",
    description:
      "From MVP to production growth, our architecture choices are made to support reliability, security, and long-term evolution.",
    icon: "why",
  },
  {
    id: 7,
    label: "CRAFT + SYSTEMS",
    title: "Design + Engineering",
    description:
      "We blend product thinking, premium UI, and robust engineering so your platform feels great and performs under pressure.",
    icon: "why",
  },
];

function CardIcon({ icon }: { icon: FoundationItem["icon"] }) {
  if (icon === "mission") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (icon === "vision") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle
          cx="12"
          cy="12"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    );
  }

  if (icon === "values") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 21 4.5 13.8a4.7 4.7 0 0 1 6.7-6.6L12 8l.8-.8a4.7 4.7 0 0 1 6.7 6.6L12 21Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const slideAnimation: MotionProps = {
  variants: {
    full: { borderColor: "rgba(37,99,235,0.55)" },
    partial: { borderColor: "rgba(30,58,95,1)" },
  },
  initial: "partial",
  whileInView: "full",
  viewport: { amount: 0.6, once: false },
};

export default function MissionHorizontalScroll() {
  const mainRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [trackHeight, setTrackHeight] = useState("160vh");

  useEffect(() => {
    if (!carouselRef.current || !viewportRef.current) {
      return;
    }

    let horizontalTween: gsap.core.Tween | null = null;
    let latestTranslate = 0;

    const createHorizontalTween = () => {
      if (!mainRef.current || !carouselRef.current) {
        return;
      }

      horizontalTween?.kill();
      gsap.set(carouselRef.current, { x: 0 });

      if (latestTranslate <= 0) {
        ScrollTrigger.refresh();
        return;
      }

      horizontalTween = gsap.to(carouselRef.current, {
        x: -latestTranslate,
        ease: "none",
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    };

    const resetMaxTranslate = () => {
      const carousel = carouselRef.current;
      const viewport = viewportRef.current;
      if (!carousel || !viewport) {
        return;
      }

      const next = Math.max(0, carousel.scrollWidth - viewport.clientWidth);
      latestTranslate = next;

      // Vertical distance drives the horizontal movement. Give enough track
      // height so users can scroll through the full card rail.
      const viewportHeight = window.innerHeight;
      const nextTrackHeight = Math.max(
        viewportHeight * 1.1,
        viewportHeight + next * 0.72,
      );
      setTrackHeight(`${Math.ceil(nextTrackHeight)}px`);

      createHorizontalTween();
    };

    resetMaxTranslate();
    // Run an additional pass after layout settles (fonts/images/sticky metrics).
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resetMaxTranslate);
    });
    const delayedSync = window.setTimeout(resetMaxTranslate, 250);
    const handleResize = throttle(resetMaxTranslate, 16);
    const handlePageShow = () => resetMaxTranslate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      horizontalTween?.kill();
      window.clearTimeout(delayedSync);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <section ref={mainRef} className="relative mt-0 w-full">
      <div className="mx-auto w-full" style={{ height: trackHeight }}>
        <div
          ref={viewportRef}
          className="sticky top-[calc(50vh-10rem)] flex h-80 w-full items-start overflow-hidden"
        >
          <motion.div ref={carouselRef} className="flex gap-3 lg:gap-4">
            {items.map((item, index) => (
              <motion.article
                key={`mission-item-${item.id}-${index}`}
                {...slideAnimation}
                className="group relative h-75 w-75 shrink-0 overflow-hidden rounded-2xl border bg-[#0A1628] p-6"
              >
                <div className="flex items-center gap-2 text-[#60A5FA]">
                  <CardIcon icon={item.icon} />
                  <p className="font-(family-name:--font-satoshi) text-[11px] uppercase tracking-[3px] text-[#2563EB]">
                    {item.label}
                  </p>
                </div>
                <h3 className="mt-4 font-(family-name:--font-cabinet-grotesk) text-[28px] font-bold text-[#BFDBFE]">
                  {item.title}
                </h3>
                <p className="mt-4 font-(family-name:--font-satoshi) text-[15px] leading-[1.75] text-[#A8B8D8]">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
