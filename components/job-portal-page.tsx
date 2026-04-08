"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { jobOpenings } from "@/data/jobs";
import { HomeAboutStory } from "@/components/home/home-about-story";
import { HomeCta } from "@/components/home/home-cta";
import { HomeCategories } from "@/components/home/home-categories";
import { HomeFeaturedJobs } from "@/components/home/home-featured-jobs";
import { HomeHero } from "@/components/home/home-hero";
import { HomeScrollLine } from "@/components/home/home-scroll-line";
import { PublicShell } from "@/components/public-shell";

gsap.registerPlugin(ScrollTrigger);

export default function JobPortalPage() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const openRoles = jobOpenings.length;

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero-badge, .hero-headline, .hero-subtitle, .hero-pill, .hero-buttons, .hero-scroll",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        ".reveal-on-scroll",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        },
      );

      const line = document.querySelector<SVGPathElement>(
        ".home-scroll-line-path",
      );
      if (line) {
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;

        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      }
    }, sectionRef.current);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <PublicShell>
      <HomeScrollLine />
      <div ref={sectionRef} className="relative bg-[#0F1C3F]">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-10">
          <HomeHero openRoles={openRoles} />

          <HomeCategories />

          <HomeFeaturedJobs />

          <HomeAboutStory />

          <HomeCta />
        </div>
      </div>
    </PublicShell>
  );
}
