"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Contact,
  FolderSearch,
  Home,
  Menu,
  Search,
  X,
} from "lucide-react";

import { jobOpenings } from "@/data/jobs";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function normalize(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function scoreJobMatch(
    query: string,
    title: string,
    slug: string,
    skills: string[],
  ) {
    const q = normalize(query);
    const t = normalize(title);
    const s = normalize(slug);
    const skillText = normalize(skills.join(" "));

    let score = 0;
    if (t.includes(q) || s.includes(q)) {
      score += 5;
    }

    const parts = q.split(" ").filter(Boolean);
    for (const part of parts) {
      if (t.includes(part)) {
        score += 2;
      }
      if (s.includes(part)) {
        score += 2;
      }
      if (skillText.includes(part)) {
        score += 1;
      }
    }

    return score;
  }

  function resolveSearchRoute(rawQuery: string) {
    const query = normalize(rawQuery);
    if (!query) {
      return "/jobs";
    }

    if (/(home|main page|landing)/.test(query)) {
      return "/";
    }

    if (/(about|company|mission|vision|values|creinx)/.test(query)) {
      return "/about";
    }

    if (/(contact|hr|human resource|email|phone|support|help)/.test(query)) {
      return "/contact";
    }

    const bestMatch = jobOpenings
      .map((job) => ({
        slug: job.slug,
        score: scoreJobMatch(query, job.title, job.slug, job.skills),
      }))
      .sort((a, b) => b.score - a.score)[0];

    if (bestMatch && bestMatch.score >= 6) {
      return `/jobs/${bestMatch.slug}/apply`;
    }

    if (
      /(job|jobs|career|hiring|developer|engineer|designer|marketing|seo|social)/.test(
        query,
      ) ||
      (bestMatch && bestMatch.score >= 2)
    ) {
      return "/jobs";
    }

    return "/jobs";
  }

  function submitGlobalSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const route = resolveSearchRoute(searchQuery);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    router.push(route);
  }

  function getSearchRouteMeta(query: string) {
    const route = resolveSearchRoute(query);

    if (route === "/") {
      return { icon: Home, label: "Home" };
    }

    if (route === "/about") {
      return { icon: Building2, label: "About" };
    }

    if (route === "/contact") {
      return { icon: Contact, label: "Contact / HR" };
    }

    if (route === "/jobs") {
      return { icon: BriefcaseBusiness, label: "Jobs" };
    }

    if (route.includes("/apply")) {
      return { icon: FolderSearch, label: "Specific role" };
    }

    return { icon: Search, label: "Search" };
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        isTransparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-[rgba(168,184,216,0.18)] bg-[rgba(15,28,63,0.95)] backdrop-blur-md",
      )}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center"
          aria-label="Creinx Home"
        >
          <Image
            src="/logo.png"
            alt="Creinx"
            width={220}
            height={56}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  active
                    ? "bg-[rgba(37,99,235,0.18)] text-[#93C5FD]"
                    : "text-[#A8B8D8] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#F0F4FF]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/jobs"
            aria-label="Open roles"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2563EB] px-4 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
          >
            <BriefcaseBusiness size={18} />
            <span>Jobs</span>
          </Link>
          <Link
            href="/my-applications"
            aria-label="My applications"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[rgba(168,184,216,0.35)] bg-[rgba(255,255,255,0.05)] px-4 text-sm font-medium text-[#F0F4FF] transition hover:border-[#2563EB] hover:bg-[#2563EB]"
          >
            <ClipboardList size={18} />
            <span>My Applications</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            aria-label="Open global search"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[rgba(168,184,216,0.35)] bg-[rgba(255,255,255,0.05)] px-4 text-sm font-medium text-[#F0F4FF] transition hover:border-[#2563EB] hover:bg-[#2563EB]"
            suppressHydrationWarning
          >
            <Search size={18} />
            <span>Search</span>
          </button>
        </div>

        <button
          type="button"
          className="inline-flex rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.04)] p-2 text-[#A8B8D8] md:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-[rgba(168,184,216,0.18)] bg-[rgba(15,28,63,0.98)] px-5 pb-5 pt-3 md:hidden">
          <div className="grid gap-2">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm transition",
                    active
                      ? "bg-[rgba(37,99,235,0.18)] text-[#93C5FD]"
                      : "text-[#A8B8D8] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#F0F4FF]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-1 grid gap-2">
              <Link
                href="/jobs"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Open roles"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#2563EB] px-4 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
              >
                <BriefcaseBusiness size={18} />
                <span>Jobs</span>
              </Link>
              <Link
                href="/my-applications"
                onClick={() => setIsMenuOpen(false)}
                aria-label="My applications"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[rgba(168,184,216,0.35)] bg-[rgba(255,255,255,0.05)] px-4 text-sm font-medium text-[#F0F4FF] transition hover:border-[#2563EB] hover:bg-[#2563EB]"
              >
                <ClipboardList size={18} />
                <span>My Applications</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                aria-label="Open global search"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[rgba(168,184,216,0.35)] bg-[rgba(255,255,255,0.05)] px-4 text-sm font-medium text-[#F0F4FF] transition hover:border-[#2563EB] hover:bg-[#2563EB]"
                suppressHydrationWarning
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isSearchOpen ? (
        <div className="border-t border-[rgba(168,184,216,0.18)] bg-[rgba(15,28,63,0.98)] px-5 pb-4 pt-3">
          <form
            onSubmit={submitGlobalSearch}
            className="mx-auto flex w-full max-w-7xl flex-col gap-3 lg:px-5"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-11 flex-1 items-center rounded-full border border-[rgba(168,184,216,0.35)] bg-[rgba(255,255,255,0.05)] px-4">
                <Search size={16} className="text-[#A8B8D8]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search jobs, company, contact, roles..."
                  className="ml-2 w-full bg-transparent text-sm text-[#F0F4FF] outline-none placeholder:text-[#A8B8D8]"
                  autoFocus
                  suppressHydrationWarning
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
                suppressHydrationWarning
              >
                Go
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { query: "frontend developer", label: "Jobs" },
                { query: "hr contact", label: "Contact" },
                { query: "about company", label: "About" },
                { query: "home", label: "Home" },
              ].map((item) => {
                const meta = getSearchRouteMeta(item.query);
                const Icon = meta.icon;

                return (
                  <button
                    key={item.query}
                    type="button"
                    onClick={() => {
                      setSearchQuery(item.query);
                      router.push(resolveSearchRoute(item.query));
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(168,184,216,0.28)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-xs text-[#D7E3F5] transition hover:border-[#2563EB] hover:bg-[rgba(37,99,235,0.12)]"
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </form>
        </div>
      ) : null}
    </header>
  );
}
