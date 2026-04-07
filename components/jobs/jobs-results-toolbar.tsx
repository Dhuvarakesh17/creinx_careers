"use client";

import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

interface JobsResultsToolbarProps {
  count: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function JobsResultsToolbar({
  count,
  viewMode,
  onViewModeChange,
}: JobsResultsToolbarProps) {
  return (
    <section className="mt-6 flex items-center justify-between">
      <p className="text-sm text-[#6B7FA3]">{count} roles found</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onViewModeChange("grid")}
          className={cn(
            "pill-filter rounded-full px-3 py-1 text-xs",
            viewMode === "grid" ? "pill-filter-active" : "",
          )}
          suppressHydrationWarning
        >
          Grid
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("list")}
          className={cn(
            "pill-filter rounded-full px-3 py-1 text-xs",
            viewMode === "list" ? "pill-filter-active" : "",
          )}
          suppressHydrationWarning
        >
          List
        </button>
      </div>
    </section>
  );
}
