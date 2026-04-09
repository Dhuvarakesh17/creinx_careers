"use client";

import { useState } from "react";

type ShareJobButtonProps = {
  slug: string;
  title: string;
  className?: string;
};

export function ShareJobButton({
  slug,
  title,
  className,
}: ShareJobButtonProps) {
  const [statusText, setStatusText] = useState("Share");

  async function handleShare() {
    const url = `${window.location.origin}/jobs/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Creinx`,
          text: `Check out this role: ${title}`,
          url,
        });
        return;
      } catch {
        // Ignore user-cancelled share sheet and continue to copy fallback.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatusText("Link Copied");
      window.setTimeout(() => setStatusText("Share"), 1800);
    } catch {
      setStatusText("Copy Failed");
      window.setTimeout(() => setStatusText("Share"), 1800);
    }
  }

  return (
    <button type="button" onClick={handleShare} className={className}>
      {statusText}
    </button>
  );
}
