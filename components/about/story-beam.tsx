"use client";

import { useRef } from "react";

import { AnimatedBeam, Circle, Icons } from "@/components/ui/animated-beam";

export function StoryBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const strategyRef = useRef<HTMLDivElement>(null);
  const peopleRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const craftRef = useRef<HTMLDivElement>(null);
  const growthRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mt-7 w-full max-w-none overflow-hidden rounded-2xl border border-[#1E3A5F] bg-[#0A1628]/70 p-5 sm:p-7"
    >
      <div className="grid gap-8">
        <div className="flex items-center justify-between">
          <Circle ref={visionRef} className="h-12 w-12 sm:h-14 sm:w-14">
            <Icons.vision />
          </Circle>
          <Circle ref={craftRef} className="h-12 w-12 sm:h-14 sm:w-14">
            <Icons.craft />
          </Circle>
        </div>

        <div className="flex items-center justify-between">
          <Circle ref={strategyRef} className="h-12 w-12 sm:h-14 sm:w-14">
            <Icons.strategy />
          </Circle>
          <Circle
            ref={centerRef}
            className="h-16 w-16 border-[#2563EB] bg-[#10213F] text-[#93C5FD] sm:h-18 sm:w-18"
          >
            <Icons.launch />
          </Circle>
          <Circle ref={growthRef} className="h-12 w-12 sm:h-14 sm:w-14">
            <Icons.growth />
          </Circle>
        </div>

        <div className="flex items-center justify-between">
          <Circle ref={peopleRef} className="h-12 w-12 sm:h-14 sm:w-14">
            <Icons.people />
          </Circle>
          <Circle ref={trustRef} className="h-12 w-12 sm:h-14 sm:w-14">
            <Icons.trust />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={visionRef}
        toRef={centerRef}
        curvature={-56}
        dotted
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={strategyRef}
        toRef={centerRef}
        dotted
        gradientStartColor="#34D399"
        gradientStopColor="#60A5FA"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={peopleRef}
        toRef={centerRef}
        curvature={56}
        dotted
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={craftRef}
        toRef={centerRef}
        curvature={-56}
        reverse
        dotted
        gradientStartColor="#A78BFA"
        gradientStopColor="#60A5FA"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={growthRef}
        toRef={centerRef}
        reverse
        dotted
        gradientStartColor="#22D3EE"
        gradientStopColor="#2563EB"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={trustRef}
        toRef={centerRef}
        curvature={56}
        reverse
        dotted
        gradientStartColor="#F59E0B"
        gradientStopColor="#2563EB"
      />

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] uppercase tracking-[1.5px] text-[#6B7FA3]">
        <span>Vision</span>
        <span>•</span>
        <span>Strategy</span>
        <span>•</span>
        <span>People</span>
        <span>•</span>
        <span>Craft</span>
        <span>•</span>
        <span>Growth</span>
        <span>•</span>
        <span>Trust</span>
      </div>
    </div>
  );
}
