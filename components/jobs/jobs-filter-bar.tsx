"use client";

import { cn } from "@/lib/utils";

const departmentFilters = ["All", "Technical", "Digital Marketing"] as const;
const workModeFilters = ["All", "Remote", "Hybrid", "Onsite"] as const;
const jobTypeFilters = [
  "All",
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
] as const;

interface JobsFilterBarProps {
  department: (typeof departmentFilters)[number];
  workMode: (typeof workModeFilters)[number];
  jobType: (typeof jobTypeFilters)[number];
  experience: string;
  sortBy: string;
  onDepartmentChange: (value: (typeof departmentFilters)[number]) => void;
  onWorkModeChange: (value: (typeof workModeFilters)[number]) => void;
  onJobTypeChange: (value: (typeof jobTypeFilters)[number]) => void;
  onExperienceChange: (value: string) => void;
  onSortByChange: (value: string) => void;
}

export function JobsFilterBar({
  department,
  workMode,
  jobType,
  experience,
  sortBy,
  onDepartmentChange,
  onWorkModeChange,
  onJobTypeChange,
  onExperienceChange,
  onSortByChange,
}: JobsFilterBarProps) {
  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_220px_220px]">
      <div className="flex flex-wrap gap-2">
        {departmentFilters.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onDepartmentChange(option)}
            className={cn(
              "pill-filter rounded-full px-3 py-1.5 text-xs",
              department === option ? "pill-filter-active" : "",
            )}
            suppressHydrationWarning
          >
            {option}
          </button>
        ))}
        {workModeFilters.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onWorkModeChange(option)}
            className={cn(
              "pill-filter rounded-full px-3 py-1.5 text-xs",
              workMode === option ? "pill-filter-active" : "",
            )}
            suppressHydrationWarning
          >
            {option}
          </button>
        ))}
        {jobTypeFilters.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onJobTypeChange(option)}
            className={cn(
              "pill-filter rounded-full px-3 py-1.5 text-xs",
              jobType === option ? "pill-filter-active" : "",
            )}
            suppressHydrationWarning
          >
            {option}
          </button>
        ))}
      </div>
      <select
        value={experience}
        onChange={(event) => onExperienceChange(event.target.value)}
        className="field-solid px-3 py-2 text-sm"
        suppressHydrationWarning
      >
        <option>All Levels</option>
        <option>Fresher</option>
        <option>1-3 Years</option>
        <option>3-5 Years</option>
        <option>5+ Years</option>
      </select>
      <select
        value={sortBy}
        onChange={(event) => onSortByChange(event.target.value)}
        className="field-solid px-3 py-2 text-sm"
        suppressHydrationWarning
      >
        <option>Newest First</option>
        <option>Oldest First</option>
        <option>Salary High-Low</option>
        <option>Salary Low-High</option>
      </select>
    </div>
  );
}
