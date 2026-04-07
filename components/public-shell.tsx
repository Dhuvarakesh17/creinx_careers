import type { ReactNode } from "react";

import { PublicLayoutShell } from "@/components/layout/public-layout-shell";

export function PublicShell({ children }: { children: ReactNode }) {
  return <PublicLayoutShell>{children}</PublicLayoutShell>;
}
