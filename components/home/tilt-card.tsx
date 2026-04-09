"use client";

import type { HTMLAttributes, PropsWithChildren } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

interface TiltCardProps
  extends PropsWithChildren, Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  className?: string;
  maxTilt?: number;
  enableShine?: boolean;
}

export function TiltCard({
  children,
  className,
  maxTilt = 10,
  enableShine = false,
  ...props
}: TiltCardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shineRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const shineRefState = useRef({ x: 50, y: 50, opacity: 0 });

  const animate = () => {
    const card = cardRef.current;
    if (!card) {
      return;
    }
    const shine = shineRef.current;

    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.2;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.2;

    card.style.transform = `rotateX(${currentRef.current.x}deg) rotateY(${currentRef.current.y}deg) translateY(-4px)`;

    if (shine) {
      shine.style.opacity = `${shineRefState.current.opacity}`;
      shine.style.background = `radial-gradient(circle at ${shineRefState.current.x}% ${shineRefState.current.y}%, rgba(255,255,255,0.32), rgba(255,255,255,0) 52%)`;
    }

    const delta =
      Math.abs(targetRef.current.x - currentRef.current.x) +
      Math.abs(targetRef.current.y - currentRef.current.y);

    if (delta > 0.05) {
      frameRef.current = window.requestAnimationFrame(animate);
    } else {
      frameRef.current = null;
    }
  };

  const queueAnimate = () => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(animate);
  };

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const rect = root.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    targetRef.current.y = (x - 0.5) * (maxTilt * 2);
    targetRef.current.x = (0.5 - y) * (maxTilt * 2);
    shineRefState.current.x = x * 100;
    shineRefState.current.y = y * 100;
    shineRefState.current.opacity = enableShine ? 1 : 0;
    queueAnimate();
  };

  const onLeave = () => {
    targetRef.current.x = 0;
    targetRef.current.y = 0;
    shineRefState.current.opacity = 0;
    queueAnimate();
  };

  return (
    <div
      ref={rootRef}
      className="tilt-root h-full"
      style={{ perspective: "1000px" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={cardRef}
        className={cn("tilt-card relative h-full overflow-hidden", className)}
        {...props}
      >
        {enableShine ? (
          <div
            ref={shineRef}
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-200"
            style={{ opacity: 0 }}
          />
        ) : null}
        {children}
      </div>
    </div>
  );
}
