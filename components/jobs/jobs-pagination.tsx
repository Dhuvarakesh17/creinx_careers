"use client";

import { cn } from "@/lib/utils";

interface JobsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function JobsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: JobsPaginationProps) {
  return (
    <section className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="rounded-full border border-[#DDE3ED] px-3 py-1 text-sm text-[#0F1C3F] disabled:opacity-40"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPageChange(n)}
          className={cn(
            "rounded-full px-3 py-1 text-sm",
            currentPage === n
              ? "bg-[#DBEAFE] text-[#1D4ED8]"
              : "border border-[#DDE3ED] text-[#64748B]",
          )}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="rounded-full border border-[#DDE3ED] px-3 py-1 text-sm text-[#0F1C3F] disabled:opacity-40"
      >
        Next
      </button>
    </section>
  );
}
