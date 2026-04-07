export default function JobsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-10">
      <div className="h-28 animate-pulse rounded-3xl border border-[#DDE3ED] bg-[#EEF2F7]" />
      <div className="mt-6 h-24 animate-pulse rounded-2xl border border-[#DDE3ED] bg-[#EEF2F7]" />
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-2xl border border-[#DDE3ED] bg-[#EEF2F7]"
          />
        ))}
      </div>
    </div>
  );
}
