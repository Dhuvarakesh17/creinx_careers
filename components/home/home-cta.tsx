import Link from "next/link";

export function HomeCta() {
  return (
    <section className="glass-card mt-14 p-8 text-center">
      <h2 className="font-(family-name:--font-heading) text-4xl text-[#F0F4FF]">
        Ready to build with Creinx?
      </h2>
      <p className="mt-2 text-[#A8B8D8]">
        Join Creinx and work on products with real impact.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/jobs"
          className="rounded-full bg-[#2563EB] px-5 py-2.5 font-semibold text-white"
        >
          See All Jobs
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-[#DDE3ED] bg-white px-5 py-2.5 font-semibold text-[#0F1C3F]"
        >
          Contact HR
        </Link>
      </div>
    </section>
  );
}
