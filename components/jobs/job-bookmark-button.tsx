"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type BookmarkButtonProps = {
  slug: string;
  title: string;
  className?: string;
  variant?: "icon" | "button";
};

const STORAGE_KEY = "saved-jobs";

function readBookmarks() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

function writeBookmarks(bookmarks: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  window.dispatchEvent(new Event("saved-jobs-updated"));
}

export function JobBookmarkButton({
  slug,
  title,
  className,
  variant = "button",
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(readBookmarks().includes(slug));
  }, [slug]);

  function toggleBookmark() {
    const current = readBookmarks();
    const next = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug];

    writeBookmarks(next);
    setBookmarked(next.includes(slug));
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggleBookmark}
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-[#1E3A5F] bg-[#0A1628] text-[#F0F4FF] transition hover:border-[#2563EB] hover:text-[#93C5FD]",
          bookmarked ? "border-[#2563EB] text-[#93C5FD]" : "",
          className,
        )}
        aria-label={
          bookmarked ? `Remove bookmark for ${title}` : `Save ${title}`
        }
      >
        {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition",
        bookmarked
          ? "border-[#2563EB] bg-[rgba(37,99,235,0.12)] text-[#93C5FD]"
          : "border-[#1E3A5F] text-[#F0F4FF] hover:border-[#2563EB] hover:bg-[rgba(37,99,235,0.1)]",
        className,
      )}
      aria-label={bookmarked ? `Remove bookmark for ${title}` : `Save ${title}`}
    >
      {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      {bookmarked ? "Saved" : "Save Role"}
    </button>
  );
}
