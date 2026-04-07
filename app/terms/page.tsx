import { PublicShell } from "@/components/public-shell";

export default function TermsPage() {
  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-4xl px-5 py-10 lg:px-10">
        <section className="glass-card p-8">
          <h1 className="font-(family-name:--font-space) text-4xl text-[#F0F4FF]">
            Terms
          </h1>
          <p className="mt-4 text-sm text-[#A8B8D8]">
            By using this careers portal, you agree to submit accurate
            information and comply with recruitment terms.
          </p>
        </section>
      </main>
    </PublicShell>
  );
}
