import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ThemeScript } from "@/components/ThemeScript";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getSiteUrl } from "@/lib/site";

import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Display Pro | Compare Device Displays Side-by-Side",
    template: "%s | Display Pro"
  },
  description:
    "Compare display specs side-by-side with a clean, fast, SEO-friendly web app built for device research and future monetization.",
  keywords: [
    "display comparison",
    "device specs",
    "screen comparison",
    "MacBook Pro comparison",
    "PPI comparison",
    "display review tool"
  ],
  openGraph: {
    title: "Display Pro",
    description:
      "A production-ready comparison tool for screen size, brightness, panel type, HDR support, and more.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Display Pro",
    description:
      "Compare device display specs side-by-side with a polished, monetization-ready experience."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeScript />
        <div className="relative isolate">
          <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal-700 dark:text-teal-300">
                  Display Pro
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Display intelligence for buyers, reviewers, and publishers
                </p>
              </div>
              <ThemeToggle />
            </div>
          </header>

          <main>{children}</main>

          <footer className="border-t border-white/60 bg-white/60 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 dark:text-slate-400">
              <p>Display Pro is structured for GitHub Pages deployment, SEO growth, and ad monetization.</p>
              <p>Everything is bundled into a static export, with room to scale the data source later.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
