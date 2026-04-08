"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import type { PropsWithChildren } from "react";

const routeOrder = [
  "/",
  "/about",
  "/jobs",
  "/contact",
  "/privacy",
  "/terms",
  "/my-applications",
  "/admin/login",
  "/admin/dashboard",
] as const;

function getRouteIndex(pathname: string) {
  const exact = routeOrder.indexOf(pathname as (typeof routeOrder)[number]);
  if (exact >= 0) return exact;

  const firstSegment = `/${pathname.split("/").filter(Boolean)[0] ?? ""}`;
  const segmentIndex = routeOrder.indexOf(
    firstSegment as (typeof routeOrder)[number],
  );

  return segmentIndex >= 0 ? segmentIndex : 0;
}

export function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const previousIndexRef = useRef(getRouteIndex(pathname));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  const direction = useMemo(() => {
    const nextIndex = getRouteIndex(pathname);
    const isForward = nextIndex >= previousIndexRef.current;
    previousIndexRef.current = nextIndex;
    return isForward ? 1 : -1;
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        custom={direction}
        initial={{ opacity: 0, y: direction > 0 ? 14 : -14, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: direction > 0 ? -18 : 18, scale: 0.995 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
