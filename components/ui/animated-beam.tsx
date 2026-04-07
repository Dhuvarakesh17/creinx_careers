"use client";

import { forwardRef, type RefObject, useEffect, useId, useState } from "react";
import {
  Compass,
  Lightbulb,
  PenSquare,
  Rocket,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

type AnimatedBeamProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  fromRef: RefObject<HTMLDivElement | null>;
  toRef: RefObject<HTMLDivElement | null>;
  curvature?: number;
  endYOffset?: number;
  reverse?: boolean;
  dotted?: boolean;
  gradientStartColor?: string;
  gradientStopColor?: string;
  className?: string;
};

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  endYOffset = 0,
  reverse = false,
  dotted = false,
  gradientStartColor = "#67AEFF",
  gradientStopColor = "#2563EB",
  className,
}: AnimatedBeamProps) {
  const [fromPoint, setFromPoint] = useState<Point | null>(null);
  const [toPoint, setToPoint] = useState<Point | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const rawId = useId();
  const gradientId = `beam-${rawId.replace(/:/g, "")}`;

  useEffect(() => {
    const update = () => {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;

      if (!container || !from || !to) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();

      setSize({ width: containerRect.width, height: containerRect.height });
      setFromPoint({
        x: fromRect.left - containerRect.left + fromRect.width / 2,
        y: fromRect.top - containerRect.top + fromRect.height / 2,
      });
      setToPoint({
        x: toRect.left - containerRect.left + toRect.width / 2,
        y: toRect.top - containerRect.top + toRect.height / 2 + endYOffset,
      });
    };

    update();

    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    if (fromRef.current) observer.observe(fromRef.current);
    if (toRef.current) observer.observe(toRef.current);

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [containerRef, fromRef, toRef, endYOffset]);

  if (!fromPoint || !toPoint || size.width === 0 || size.height === 0) {
    return null;
  }

  const controlX = (fromPoint.x + toPoint.x) / 2;
  const controlY = (fromPoint.y + toPoint.y) / 2 - curvature;
  const path = `M ${fromPoint.x} ${fromPoint.y} Q ${controlX} ${controlY} ${toPoint.x} ${toPoint.y}`;

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0", className)}
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1={fromPoint.x}
          y1={fromPoint.y}
          x2={toPoint.x}
          y2={toPoint.y}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={gradientStartColor} />
          <stop offset="100%" stopColor={gradientStopColor} />
        </linearGradient>
      </defs>

      <path
        d={path}
        stroke="rgba(148,163,184,0.28)"
        strokeWidth="1.5"
        strokeDasharray={dotted ? "4 6" : undefined}
      />

      <path
        d={path}
        stroke={`url(#${gradientId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={dotted ? "8 9" : "18 12"}
        className={cn("beam-flow", reverse ? "beam-reverse" : "")}
      />

      <style>{`
        .beam-flow {
          animation: beam-flow 2.8s linear infinite;
        }
        .beam-reverse {
          animation-direction: reverse;
        }
        @keyframes beam-flow {
          to {
            stroke-dashoffset: -64;
          }
        }
      `}</style>
    </svg>
  );
}

type CircleProps = React.HTMLAttributes<HTMLDivElement>;

export const Circle = forwardRef<HTMLDivElement, CircleProps>(function Circle(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-20 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1E3A5F] bg-[#0A1628]/95 text-[#DBEAFE] shadow-[0_8px_24px_rgba(2,6,23,0.35)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const Icons = {
  vision: () => <Compass className="h-6 w-6" />,
  insight: () => <Lightbulb className="h-6 w-6" />,
  strategy: () => <Target className="h-6 w-6" />,
  people: () => <Users className="h-6 w-6" />,
  craft: () => <PenSquare className="h-6 w-6" />,
  growth: () => <TrendingUp className="h-6 w-6" />,
  trust: () => <ShieldCheck className="h-6 w-6" />,
  launch: () => <Rocket className="h-6 w-6" />,
};
