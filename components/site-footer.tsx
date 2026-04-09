import Image from "next/image";
import Link from "next/link";
import {
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  FacebookIcon,
} from "./social-icons";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#1E2D57] bg-[#0F1C3F]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 lg:grid-cols-4 lg:px-10">
        <section>
          <Link
            href="/"
            aria-label="Creinx Home"
            className="inline-flex h-12 w-44 items-center overflow-hidden md:h-14 md:w-52"
          >
            <Image
              src="/logo.png"
              alt="Creinx"
              width={280}
              height={90}
              unoptimized
              className="h-full w-full scale-[2.4] object-contain"
            />
          </Link>
          <p className="mt-3 text-sm text-white/70">
            CREINX is a premium software company engineering scalable web apps,
            mobile apps, and AI automations built for business growth.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Link
              href="https://www.linkedin.com/company/creinx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon />
            </Link>
            <Link
              href="https://x.com/creinx83536"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="X"
            >
              <TwitterIcon />
            </Link>
            <Link
              href="https://www.instagram.com/creinx.it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </Link>
            <Link
              href="https://www.youtube.com/@creinx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <YoutubeIcon />
            </Link>
            <Link
              href="https://www.facebook.com/people/Creinx/61586172854538/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </Link>
          </div>
        </section>

        <section>
          <h4 className="font-semibold text-white">Quick Links</h4>
          <div className="mt-3 grid gap-2 text-sm text-white/70">
            <Link href="/">Home</Link>
            <Link href="/jobs">Jobs</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </section>

        <section>
          <h4 className="font-semibold text-white">Contact</h4>
          <div className="mt-3 grid gap-2 text-sm text-white/70">
            <p>contacts@creinx.com</p>
            <p>+91 90808 20875</p>
            <p>
              32/141, 2 Street M.G.R Nagar, Cycle Shop, Puzhal, Chennai-600066
            </p>
          </div>
        </section>

        <section>
          <h4 className="font-semibold text-white">Our Location</h4>
          <p className="mt-3 text-sm text-white/70">
            Visit us at our Puzhal, Chennai office.
          </p>
          <div
            className="relative mt-4 overflow-hidden rounded-2xl border border-white/20"
            data-lenis-prevent
          >
            <iframe
              title="Creinx Chennai Office Location"
              src="https://maps.google.com/maps?hl=en&q=32%2F141%2C%202nd%20Street%20M.G.R%20Nagar%2C%20Puzhal%2C%20Chennai%20600066%2C%20India&z=17&output=embed"
              className="h-44 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-full rounded-full border-2 border-white bg-[#DC2626] shadow-[0_0_0_3px_rgba(220,38,38,0.25)]" />
          </div>
        </section>
      </div>
      <p className="border-t border-white/15 px-5 py-4 text-center text-xs text-white/60 lg:px-10">
        © 2026 Creinx. All rights reserved.
      </p>
    </footer>
  );
}
