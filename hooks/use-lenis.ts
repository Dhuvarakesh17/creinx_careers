"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pathname = usePathname();
  const shouldEnableLenis = pathname === "/";

  useEffect(() => {
    if (typeof window === "undefined" || !shouldEnableLenis) {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }

      return;
    }

    try {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        autoRaf: false,
      });

      lenisRef.current = lenis;
      const onLenisScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onLenisScroll);

      const onFrame = (time: number) => {
        if (lenisRef.current) {
          lenisRef.current.raf(time);
        }
        animationFrameRef.current = window.requestAnimationFrame(onFrame);
      };

      animationFrameRef.current = window.requestAnimationFrame(onFrame);

      return () => {
        if (animationFrameRef.current) {
          window.cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        if (lenisRef.current) {
          lenisRef.current.off("scroll", onLenisScroll);
          lenisRef.current.destroy();
          lenisRef.current = null;
        }
      };
    } catch (error) {
      console.error("Lenis initialization error:", error);
      return () => {};
    }
  }, [shouldEnableLenis]);

  useEffect(() => {
    if (shouldEnableLenis && lenisRef.current) {
      ScrollTrigger.refresh();
    }
  }, [pathname, shouldEnableLenis]);

  return lenisRef;
}
