import { PublicShell } from "@/components/public-shell";

export default function PrivacyPage() {
  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-4xl px-5 py-10 lg:px-10">
        <section className="glass-card p-8">
          <h1 className="font-(family-name:--font-space) text-4xl text-[#F0F4FF]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-[#A8B8D8]">
            Candidate data is only used for recruitment activities and internal
            hiring operations.
          </p>
        </section>
      </main>
    </PublicShell>
  );
}
