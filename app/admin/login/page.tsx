"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setError("Invalid credentials.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-5 py-10">
      <section className="glass-card w-full rounded-2xl p-6">
        <h1 className="font-(family-name:--font-space) text-3xl text-[#F0F4FF]">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-[#A8B8D8]">
          Secure access for HR and hiring managers.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="field-solid px-3 py-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="field-solid px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error ? <p className="text-sm text-[#D97706]">{error}</p> : null}
        </form>
      </section>
    </main>
  );
}
