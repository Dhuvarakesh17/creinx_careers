"use client";

import { useEffect, useMemo, useState } from "react";

export interface JobFiltersState {
  query: string;
  department: "all" | "technical" | "digital-marketing";
  experience: "all" | "fresher" | "junior" | "mid" | "senior";
  workMode: "all" | "onsite" | "hybrid" | "remote";
  sort: "latest" | "oldest" | "salary-high" | "salary-low";
}

const DEFAULT_STATE: JobFiltersState = {
  query: "",
  department: "all",
  experience: "all",
  workMode: "all",
  sort: "latest",
};

export function useJobFilters(delayMs = 300) {
  const [filters, setFilters] = useState<JobFiltersState>(DEFAULT_STATE);
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(filters.query.trim());
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [delayMs, filters.query]);

  const effectiveFilters = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [debouncedQuery, filters],
  );

  return {
    filters,
    effectiveFilters,
    setFilters,
    resetFilters: () => setFilters(DEFAULT_STATE),
  };
}
