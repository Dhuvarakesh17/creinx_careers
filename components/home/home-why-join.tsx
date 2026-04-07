import { whyJoinUs } from "@/data/jobs";

export function HomeWhyJoin() {
  return (
    <section id="benefits" className="mt-14">
      <h2 className="font-(family-name:--font-heading) text-3xl text-[#0F1C3F]">
        Why Join Us
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {whyJoinUs.map((item) => (
          <article
            key={item.title}
            className="glass-card flip-benefit p-5 transform-3d"
          >
            <h3 className="font-semibold text-[#F0F4FF]">{item.title}</h3>
            <p className="mt-2 text-sm text-[#A8B8D8]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
