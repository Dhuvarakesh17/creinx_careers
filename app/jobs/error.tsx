"use client";

interface JobsErrorProps {
  error: Error;
  reset: () => void;
}

export default function JobsError({ error, reset }: JobsErrorProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16 text-center lg:px-10">
      <h2 className="font-(family-name:--font-heading) text-3xl text-[#0F1C3F]">
        Could not load jobs right now
      </h2>
      <p className="mt-3 text-sm text-[#64748B]">
        {error.message || "Please try again in a moment."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white"
      >
        Retry
      </button>
    </div>
  );
}
