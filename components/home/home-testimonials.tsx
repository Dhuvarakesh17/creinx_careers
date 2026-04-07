"use client";

import { useEffect, useState } from "react";

import { testimonials } from "@/data/jobs";

export function HomeTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ticker = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => window.clearInterval(ticker);
  }, []);

  return (
    <section className="glass-card mt-14 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-(family-name:--font-heading) text-3xl text-[#F0F4FF]">
          Team Stories at CREINX
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              setActiveIndex(
                (v) => (v - 1 + testimonials.length) % testimonials.length,
              )
            }
            className="rounded-full border border-[#1E3A5F] px-3 py-1 text-[#A8B8D8]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((v) => (v + 1) % testimonials.length)}
            className="rounded-full border border-[#1E3A5F] px-3 py-1 text-[#A8B8D8]"
          >
            →
          </button>
        </div>
      </div>
      <article className="glass-card mt-6 p-6">
        <p className="text-[#A8B8D8]">
          &quot;{testimonials[activeIndex].quote}&quot;
        </p>
        <p className="mt-4 font-semibold text-[#F0F4FF]">
          {testimonials[activeIndex].name}
        </p>
        <p className="text-sm text-[#6B7FA3]">
          {testimonials[activeIndex].title} ·{" "}
          {testimonials[activeIndex].department}
        </p>
      </article>
    </section>
  );
}
