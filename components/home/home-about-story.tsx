import Link from "next/link";

export function HomeAboutStory() {
  return (
    <section className="reveal-on-scroll mt-14">
      <div className="glass-card p-8">
        <h2 className="font-(family-name:--font-space) text-2xl text-[#F0F4FF]">
          About the Company
        </h2>
        <p className="mt-3 text-[#A8B8D8]">
          CREINX was born from a simple belief — great ideas deserve great
          execution. We are a premium website development company engineering
          highly scalable mobile apps, intelligent AI automations, and high
          converting websites built for business growth. We blend elite design
          aesthetics with cutting-edge technology.
        </p>
        <p className="mt-3 text-[#A8B8D8]">
          Small focused squads of engineers and designers united by a single
          ethos — build digital assets that drive tangible results. We
          specialize in delivering affordable premium solutions that
          consistently generate value.
        </p>
        <Link
          href="/about"
          className="mt-4 inline-block text-[#93C5FD] underline underline-offset-4"
        >
          Read our full story
        </Link>
      </div>
    </section>
  );
}
