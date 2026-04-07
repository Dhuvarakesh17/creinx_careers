interface JobsEmptyStateProps {
  onClear: () => void;
}

export function JobsEmptyState({ onClear }: JobsEmptyStateProps) {
  return (
    <section className="glass-card mt-8 p-10 text-center">
      <p className="text-xl text-[#F0F4FF]">No roles match your filters</p>
      <p className="mt-2 text-sm text-[#A8B8D8]">
        Try adjusting your search or clearing filters.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-black"
      >
        Clear all filters
      </button>
    </section>
  );
}
