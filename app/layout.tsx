import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { PageTransition } from "@/components/layout/page-transition";
import TargetCursor from "@/components/target-cursor";
import LenisProvider from "@/components/layout/lenis-provider";
import { SupportChatWidget } from "@/components/support-chat-widget";
import "./globals.css";

const cabinetGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cabinet-grotesk",
  display: "swap",
});

const satoshi = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creinx Careers",
  description:
    "Join Creinx — a premium software company engineering scalable web applications, mobile apps, and AI automations. We are hiring elite engineers and digital marketers in Chennai and remote.",
  openGraph: {
    title: "Creinx Careers — Build With Us",
    description:
      "Join Creinx — a premium software company engineering scalable web applications, mobile apps, and AI automations. We are hiring elite engineers and digital marketers in Chennai and remote.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const squares = [
    { top: "10%", left: "5%", size: "4px" },
    { top: "25%", left: "92%", size: "6px" },
    { top: "40%", left: "3%", size: "5px" },
    { top: "60%", left: "95%", size: "8px" },
    { top: "80%", left: "8%", size: "6px" },
    { top: "15%", left: "50%", size: "5px" },
    { top: "70%", left: "45%", size: "7px" },
    { top: "90%", left: "70%", size: "4px" },
    { top: "5%", left: "75%", size: "6px" },
    { top: "35%", left: "25%", size: "8px" },
    { top: "55%", left: "65%", size: "5px" },
    { top: "75%", left: "20%", size: "7px" },
    { top: "20%", left: "80%", size: "4px" },
    { top: "45%", left: "85%", size: "6px" },
    { top: "85%", left: "40%", size: "8px" },
  ] as const;

  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${cabinetGrotesk.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[#0F1C3F]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute inset-0">
            {squares.map((square, index) => (
              <div
                key={index}
                className="absolute bg-[rgba(59,130,246,0.35)] rounded-[1px]"
                style={{
                  top: square.top,
                  left: square.left,
                  width: square.size,
                  height: square.size,
                }}
              />
            ))}
          </div>
        </div>
        <div className="relative z-1 flex min-h-full flex-col">
          <LenisProvider>
            <TargetCursor
              spinDuration={2}
              hideDefaultCursor
              parallaxOn
              hoverDuration={0.2}
            />
            <PageTransition>{children}</PageTransition>
            <SupportChatWidget />
          </LenisProvider>
        </div>
      </body>
    </html>
  );
}
