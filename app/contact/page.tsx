"use client";

import { useState } from "react";

import { PublicShell } from "@/components/public-shell";

export default function ContactPage() {
  const [status, setStatus] = useState("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/contact", {
      method: "POST",
      body: form,
    });

    setStatus(response.ok ? "success" : "error");
  }

  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-10">
        <section className="glass-card rounded-3xl p-8">
          <h1 className="font-(family-name:--font-space) text-4xl text-[#F0F4FF]">
            Get in Touch with Creinx.
          </h1>
          <p className="mt-2 text-[#F0F4FF]">
            Have questions about a role or the hiring process? We would love to
            hear from you.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={onSubmit}
            className="glass-card rounded-2xl p-6 lg:order-2"
          >
            <div className="grid gap-4">
              <input
                name="name"
                placeholder="Full name"
                required
                className="field-solid px-3 py-2 text-sm"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="field-solid px-3 py-2 text-sm"
              />
              <select name="subject" className="field-solid px-3 py-2 text-sm">
                <option>Question about a role</option>
                <option>Application status</option>
                <option>General inquiry</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
              <input
                name="role"
                placeholder="Role interested in (optional)"
                className="field-solid px-3 py-2 text-sm"
              />
              <textarea
                name="message"
                placeholder="Message"
                minLength={20}
                maxLength={500}
                rows={5}
                required
                className="field-solid px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
              {status === "success" ? (
                <p className="text-sm text-[#059669]">
                  Message sent successfully.
                </p>
              ) : null}
              {status === "error" ? (
                <p className="text-sm text-[#D97706]">
                  Unable to send message.
                </p>
              ) : null}
            </div>
          </form>

          <aside className="glass-card rounded-2xl p-6 lg:order-1">
            <h2 className="text-xl text-[#F0F4FF]">Contact Information</h2>
            <div className="mt-4 space-y-2 text-sm text-[#A8B8D8]">
              <p>HR Email: careers@creinx.com</p>
              <p>HR Phone: +91 98765 43210</p>
              <p>
                Office: 32/141, 2 Street M.G.R Nagar, Cycle Shop, Puzhal,
                Chennai-600066
              </p>
              <p>Hours: Monday to Friday 9am to 6pm IST</p>
              <p>Response: We typically respond within 1 to 2 business days.</p>
            </div>
            <div
              className="relative mt-5 overflow-hidden rounded-xl border border-[#1E3A5F]"
              data-lenis-prevent
            >
              <iframe
                title="Creinx Office Location"
                src="https://maps.google.com/maps?hl=en&q=32%2F141%2C%202nd%20Street%20M.G.R%20Nagar%2C%20Puzhal%2C%20Chennai%20600066%2C%20India&z=17&output=embed"
                className="h-52 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-full rounded-full border-2 border-white bg-[#DC2626] shadow-[0_0_0_3px_rgba(220,38,38,0.25)]" />
            </div>
          </aside>
        </section>
      </main>
    </PublicShell>
  );
}
