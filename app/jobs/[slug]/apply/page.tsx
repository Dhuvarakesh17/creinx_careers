"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { PublicShell } from "@/components/public-shell";
import Stepper, { Step } from "@/components/stepper";
import { JobBookmarkButton } from "@/components/jobs/job-bookmark-button";
import {
  loadPublicJobBySlug,
  staticPublicJobs,
  type PublicJob,
} from "@/lib/public-jobs";

type FormState = {
  name: string;
  email: string;
  phone: string;
  city: string;
  linkedin: string;
  portfolio: string;
  currentRole: string;
  totalExperience: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  skills: string;
  heardFrom: string;
  referralName: string;
  coverLetter: string;
  consent: boolean;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  city: "",
  linkedin: "",
  portfolio: "",
  currentRole: "",
  totalExperience: "Fresher",
  currentCtc: "",
  expectedCtc: "",
  noticePeriod: "Immediate",
  skills: "",
  heardFrom: "Company Website",
  referralName: "",
  coverLetter: "",
  consent: false,
};

export default function JobApplyPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const storageKey = slug ? `apply-v2-${slug}` : null;
  const [job, setJob] = useState<PublicJob | null | undefined>(undefined);
  const [form, setForm] = useState<FormState>(() => {
    if (typeof window === "undefined") {
      return initialState;
    }
    if (!storageKey) {
      return initialState;
    }
    let stored: string | null = null;
    try {
      stored = window.sessionStorage.getItem(storageKey);
    } catch {
      return initialState;
    }

    if (!stored) {
      return initialState;
    }

    try {
      return JSON.parse(stored) as FormState;
    } catch {
      try {
        window.sessionStorage.removeItem(storageKey);
      } catch {
        // Ignore storage cleanup failures in restricted browser contexts.
      }
      return initialState;
    }
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [workSample, setWorkSample] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [referenceId, setReferenceId] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  useEffect(() => {
    let active = true;

    async function loadJob() {
      if (!slug) {
        if (active) {
          setJob(null);
        }
        return;
      }

      const resolved =
        (await loadPublicJobBySlug(slug)) ??
        staticPublicJobs.find((item) => item.slug === slug) ??
        null;

      if (active) {
        setJob(resolved);
      }
    }

    loadJob();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    const timer = window.setTimeout(() => {
      router.push("/");
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [router, status]);

  useEffect(() => {
    if (!storageKey) {
      return;
    }

    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(form));
    } catch {
      // Ignore storage write failures (e.g., private mode / restricted storage).
    }
  }, [form, storageKey]);

  if (job === undefined) {
    return (
      <PublicShell>
        <main className="mx-auto w-full max-w-3xl px-5 py-10 lg:px-10">
          <p className="text-[#F0F4FF]">Loading role details...</p>
        </main>
      </PublicShell>
    );
  }

  if (!job) {
    return (
      <PublicShell>
        <main className="mx-auto w-full max-w-3xl px-5 py-10 lg:px-10">
          <p className="text-[#F0F4FF]">Invalid role.</p>
          <Link href="/jobs" className="text-[#2563EB]">
            Back to Jobs
          </Link>
        </main>
      </PublicShell>
    );
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isGmailAddress = form.email.toLowerCase().includes("@gmail.com");

  function isStepComplete(step: number) {
    if (step === 1) {
      return Boolean(
        form.name.trim() &&
        form.email.trim() &&
        form.phone.trim() &&
        form.city.trim() &&
        isGmailAddress,
      );
    }

    if (step === 2) {
      const isFresher = form.totalExperience === "Fresher";
      return Boolean(
        form.expectedCtc.trim() &&
        form.skills.trim() &&
        (isFresher || form.currentRole.trim()),
      );
    }

    if (step === 3) {
      return Boolean(resumeFile);
    }

    if (step === 4) {
      return Boolean(form.consent);
    }

    return true;
  }

  function getStepError(step: number) {
    if (step === 1) {
      return "Please enter a Gmail address and complete the required personal details before moving on.";
    }

    if (step === 2) {
      return "Please complete your required experience details, expected CTC, and skills before moving on.";
    }

    if (step === 3) {
      return "Please upload your resume before continuing.";
    }

    if (step === 4) {
      return "Please confirm the accuracy checkbox before submitting.";
    }

    return "Please complete the required fields before continuing.";
  }

  async function onSubmit() {
    if (!job) {
      setError("Invalid role.");
      return;
    }

    if (!form.consent) {
      setError("Please confirm consent before submitting.");
      return;
    }

    if (!resumeFile) {
      setError("Resume is required.");
      return;
    }

    setStatus("loading");
    setError("");

    const payload = new FormData();
    payload.set("roleId", job.id);
    payload.set("roleSlug", job.slug);
    payload.set("name", form.name);
    payload.set("email", form.email);
    payload.set("phone", form.phone);
    payload.set("experienceYears", form.totalExperience);
    payload.set(
      "portfolioUrl",
      form.portfolio || form.linkedin || "https://example.com",
    );
    payload.set("coverLetter", form.coverLetter || "No cover letter provided.");
    payload.set("website", "");
    payload.set("city", form.city);
    payload.set("linkedin", form.linkedin);
    payload.set("currentRole", form.currentRole);
    payload.set("currentCtc", form.currentCtc);
    payload.set("expectedCtc", form.expectedCtc);
    payload.set("noticePeriod", form.noticePeriod);
    payload.set("skills", form.skills);
    payload.set("heardFrom", form.heardFrom);
    payload.set("referralName", form.referralName);
    payload.set("resume", resumeFile);
    if (workSample) {
      payload.set("workSample", workSample);
    }

    const response = await fetch("/api/applications", {
      method: "POST",
      body: payload,
    });

    if (!response.ok) {
      setStatus("error");
      setError("Unable to submit application. Please retry.");
      return;
    }

    setReferenceId(`WS-${Date.now().toString().slice(-6)}`);
    setStatus("success");
    if (storageKey) {
      try {
        window.sessionStorage.removeItem(storageKey);
      } catch {
        // Ignore storage cleanup failures in restricted browser contexts.
      }
    }
  }

  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-4xl px-5 py-10 lg:px-10">
        <section className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm uppercase tracking-[0.12em] text-[#6B7FA3]">
                Bookmark this role
              </h2>
              <p className="text-xs text-[#A8B8D8]">
                Save it so you can come back later.
              </p>
            </div>
            <JobBookmarkButton slug={job.slug} title={job.title} />
          </div>
          <h1 className="font-(family-name:--font-space) text-3xl font-semibold text-[#F0F4FF]">
            Apply for: {job.title}
          </h1>
          <p className="mt-1 text-sm text-[#6B7FA3]">CREINX</p>
        </section>

        <section className="glass-card mt-6 p-6">
          <Stepper
            initialStep={1}
            onStepChange={() => setError("")}
            onFinalStepCompleted={onSubmit}
            validateStep={isStepComplete}
            onValidationFail={(step) => setError(getStepError(step))}
            backButtonText="Previous"
            nextButtonText="Next"
            finalButtonText={
              status === "loading" ? "Submitting..." : "Submit Application"
            }
            disableStepIndicators={status === "loading"}
            backButtonProps={{ disabled: status === "loading" }}
            nextButtonProps={{ disabled: status === "loading" }}
            className="gap-6"
            contentClassName="rounded-2xl border border-[#1E3A5F] bg-[#0F1729] p-5"
          >
            <Step>
              <div className="grid gap-4">
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Full name *"
                  className="field-solid px-3 py-2"
                />
                <input
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  type="email"
                  placeholder="Email address *"
                  className="field-solid px-3 py-2"
                />
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="Phone number *"
                  className="field-solid px-3 py-2"
                />
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="City / Location *"
                  className="field-solid px-3 py-2"
                />
                <input
                  value={form.linkedin}
                  onChange={(e) => update("linkedin", e.target.value)}
                  placeholder="LinkedIn URL"
                  className="field-solid px-3 py-2"
                />
                <input
                  value={form.portfolio}
                  onChange={(e) => update("portfolio", e.target.value)}
                  placeholder="Portfolio / GitHub URL"
                  className="field-solid px-3 py-2"
                />
              </div>
            </Step>

            <Step>
              <div className="grid gap-4">
                <select
                  value={form.totalExperience}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      totalExperience: value,
                      currentRole: value === "Fresher" ? "" : prev.currentRole,
                      currentCtc: value === "Fresher" ? "" : prev.currentCtc,
                    }));
                  }}
                  className="field-solid px-3 py-2"
                >
                  <option>Fresher</option>
                  <option>Less than 1 year</option>
                  <option>1-2 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
                {form.totalExperience !== "Fresher" ? (
                  <input
                    value={form.currentRole}
                    onChange={(e) => update("currentRole", e.target.value)}
                    placeholder="Current / last role *"
                    className="field-solid px-3 py-2"
                  />
                ) : null}
                {form.totalExperience !== "Fresher" ? (
                  <input
                    value={form.currentCtc}
                    onChange={(e) => update("currentCtc", e.target.value)}
                    placeholder="Current CTC"
                    className="field-solid px-3 py-2"
                  />
                ) : null}
                <input
                  value={form.expectedCtc}
                  onChange={(e) => update("expectedCtc", e.target.value)}
                  placeholder="Expected CTC *"
                  className="field-solid px-3 py-2"
                />
                <select
                  value={form.noticePeriod}
                  onChange={(e) => update("noticePeriod", e.target.value)}
                  className="field-solid px-3 py-2"
                >
                  <option>Immediate</option>
                  <option>15 days</option>
                  <option>30 days</option>
                  <option>60 days</option>
                  <option>90 days</option>
                </select>
                <input
                  value={form.skills}
                  onChange={(e) => update("skills", e.target.value)}
                  placeholder="Skills (comma separated) *"
                  className="field-solid px-3 py-2"
                />
                <select
                  value={form.heardFrom}
                  onChange={(e) => update("heardFrom", e.target.value)}
                  className="field-solid px-3 py-2"
                >
                  <option>LinkedIn</option>
                  <option>Company Website</option>
                  <option>Referral</option>
                  <option>Job Board</option>
                  <option>Other</option>
                </select>
                {form.heardFrom === "Referral" ? (
                  <input
                    value={form.referralName}
                    onChange={(e) => update("referralName", e.target.value)}
                    placeholder="Referral name"
                    className="field-solid px-3 py-2"
                  />
                ) : null}
              </div>
            </Step>

            <Step>
              <div className="grid gap-4">
                <label className="text-sm text-[#A8B8D8]">
                  Resume upload (PDF, DOC, DOCX up to 5MB) *
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                    className="field-solid mt-2 block w-full px-3 py-2"
                  />
                </label>
                <label className="text-sm text-[#A8B8D8]">
                  Cover letter (100-1000 chars)
                  <textarea
                    value={form.coverLetter}
                    onChange={(e) => update("coverLetter", e.target.value)}
                    minLength={100}
                    maxLength={1000}
                    rows={5}
                    className="field-solid mt-2 block w-full px-3 py-2"
                  />
                </label>
                <label className="text-sm text-[#A8B8D8]">
                  Work sample (optional, up to 10MB)
                  <input
                    type="file"
                    onChange={(e) => setWorkSample(e.target.files?.[0] ?? null)}
                    className="field-solid mt-2 block w-full px-3 py-2"
                  />
                </label>
              </div>
            </Step>

            <Step>
              <div className="space-y-4 text-sm text-[#A8B8D8]">
                <p>
                  <strong>Name:</strong> {form.name}
                </p>
                <p>
                  <strong>Email:</strong> {form.email}
                </p>
                <p>
                  <strong>Phone:</strong> {form.phone}
                </p>
                {form.totalExperience !== "Fresher" ? (
                  <p>
                    <strong>Current Role:</strong> {form.currentRole}
                  </p>
                ) : null}
                <p>
                  <strong>Experience:</strong> {form.totalExperience}
                </p>
                <p>
                  <strong>Expected CTC:</strong> {form.expectedCtc}
                </p>
                <p>
                  <strong>Skills:</strong> {form.skills}
                </p>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                  />
                  I confirm that the information provided is accurate and
                  complete.
                </label>
                <p className="text-xs text-[#6B7FA3]">
                  Your data will only be used for recruitment purposes.
                </p>
              </div>
            </Step>
          </Stepper>

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          {status === "success" ? (
            <div className="mt-5 rounded-xl border border-[#1E3A5F] bg-[#0A1628] p-4 text-[#A8F0C6]">
              <p className="font-semibold">Application submitted!</p>
              <p className="text-sm text-[#A8B8D8]">Reference: {referenceId}</p>
              <p className="mt-1 text-xs text-[#6B7FA3]">
                Redirecting to home page...
              </p>
            </div>
          ) : null}
        </section>
      </main>
    </PublicShell>
  );
}
