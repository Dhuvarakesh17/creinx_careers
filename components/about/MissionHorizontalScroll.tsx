"use client";

import {
  motion,
  type MotionProps,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

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
    title: "Mission, Vision & Values",
    description:
      "Clarity. Function. Scalability. Partnership. These four principles guide every decision we make and every product we build.",
    icon: "values",
  },
  {
    id: 4,
    label: "WHY CREINX",
    title: "Execution First",
    description:
      "We focus on outcomes, not noise. Every sprint and deliverable is shaped for business impact and measurable progress.",
    icon: "why",
  },
  {
    id: 5,
    label: "WHY CREINX",
    title: "Transparent Partnership",
    description:
      "You get clear timelines, honest trade-offs, and full visibility across design, development, and deployment.",
    icon: "why",
  },
  {
    id: 6,
    label: "WHY CREINX",
    title: "Built To Scale",
    description:
      "From MVP to production growth, our architecture choices are made to support reliability, security, and long-term evolution.",
    icon: "why",
  },
  {
    id: 7,
    label: "WHY CREINX",
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
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [trackHeight, setTrackHeight] = useState("220vh");
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -maxTranslate]);
  const x = useSpring(rawX, {
    stiffness: 70,
    damping: 24,
    mass: 0.7,
  });

  useEffect(() => {
    if (!carouselRef.current || !viewportRef.current) {
      return;
    }

    const resetMaxTranslate = () => {
      const carousel = carouselRef.current;
      const viewport = viewportRef.current;
      if (!carousel || !viewport) {
        return;
      }

      const next = Math.max(0, carousel.scrollWidth - viewport.clientWidth);
      setMaxTranslate(next);

      // Vertical distance drives the horizontal movement. Give enough track
      // height so users can scroll through the full card rail.
      const viewportHeight = window.innerHeight;
      const nextTrackHeight = Math.max(
        viewportHeight * 1.8,
        viewportHeight + next,
      );
      setTrackHeight(`${Math.ceil(nextTrackHeight)}px`);
    };

    resetMaxTranslate();
    const handleResize = throttle(resetMaxTranslate, 16);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section ref={mainRef} className="relative mt-0">
      <div className="mx-auto w-full" style={{ height: trackHeight }}>
        <div
          ref={viewportRef}
          className="sticky top-20 flex h-80 w-full items-start overflow-hidden"
        >
          <motion.div
            ref={carouselRef}
            className="flex gap-3 lg:gap-4"
            style={{ x }}
          >
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
                <h3 className="mt-4 font-(family-name:--font-cabinet-grotesk) text-[28px] font-bold text-[#F0F4FF]">
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
