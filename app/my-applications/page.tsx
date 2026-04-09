"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { jobOpenings } from "@/data/jobs";

interface Application {
  id: string;
  role_id: string;
  role_title: string;
  candidate_email: string;
  candidate_name: string;
  status: string;
  created_at: string;
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function searchApplications(searchEmail: string) {
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: queryError } = await supabase
        .from("job_applications")
        .select("*")
        .eq("candidate_email", searchEmail)
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setApplications(data || []);
    } catch (err) {
      setError("Unable to fetch applications. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("email", normalizedEmail);
    router.replace(`${pathname}?${nextParams.toString()}`);
  }

  useEffect(() => {
    const emailFromQuery = searchParams.get("email")?.trim().toLowerCase();

    if (!emailFromQuery) {
      return;
    }

    setEmail(emailFromQuery);
    void searchApplications(emailFromQuery);
  }, [searchParams]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/20 text-blue-300";
      case "reviewed":
        return "bg-yellow-500/20 text-yellow-300";
      case "shortlisted":
        return "bg-green-500/20 text-green-300";
      case "rejected":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const getJobSlug = (roleId: string) => {
    const job = jobOpenings.find((j) => j.id === roleId);
    return job?.slug || roleId;
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0F1C3F] to-[#0A111F]">
      <div className="mx-auto max-w-4xl px-5 py-20 lg:px-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-(family-name:--font-space) mb-3 text-4xl font-bold text-white">
            My Applications
          </h1>
          <p className="text-lg text-white/70">
            Search for your applications using your email address
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail
                  className="absolute left-4 top-3.5 text-white/50"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-lg border border-white/20 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4">
            <AlertCircle className="mt-1 shrink-0 text-red-400" size={20} />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Results */}
        {searched && (
          <>
            {applications.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-12 text-center">
                <p className="text-white/70">
                  {email
                    ? `No applications found for ${email}`
                    : "No applications found"}
                </p>
                <p className="mt-2 text-sm text-white/50">
                  Try searching with a different email or{" "}
                  <Link
                    href="/jobs"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    apply for a role
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-white/70">
                  Found {applications.length} application
                  {applications.length !== 1 ? "s" : ""}
                </p>
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {app.role_title}
                      </h3>
                      <p className="mt-1 text-sm text-white/60">
                        Applied on{" "}
                        {new Date(app.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(
                          app.status,
                        )}`}
                      >
                        {app.status}
                      </span>
                      <Link
                        href={`/jobs/${getJobSlug(app.role_id)}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Role
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/jobs"
            className="text-blue-400 transition hover:text-blue-300"
          >
            ← Back to All Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}
