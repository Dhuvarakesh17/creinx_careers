"use client";

import { PropsWithChildren } from "react";
import { useLenis } from "@/hooks/use-lenis";

export default function LenisProvider({ children }: PropsWithChildren) {
  // Lenis is initialized but can be disabled by returning early
  useLenis();

  return <>{children}</>;
}
