"use client";

interface JobsSearchBarProps {
  query: string;
  location: string;
  onQueryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

export function JobsSearchBar({
  query,
  location,
  onQueryChange,
  onLocationChange,
}: JobsSearchBarProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search by job title, skill, or keyword..."
        className="field-solid px-4 py-3 text-sm"
        suppressHydrationWarning
      />
      <select
        value={location}
        onChange={(event) => onLocationChange(event.target.value)}
        className="field-solid px-3 py-3 text-sm"
        suppressHydrationWarning
      >
        <option>All</option>
        <option>Chennai</option>
        <option>Remote</option>
        <option>Hybrid</option>
      </select>
      <button
        type="button"
        className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-black"
        suppressHydrationWarning
      >
        Search
      </button>
    </div>
  );
}
