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
    default: "디스플레이 비교 | 실제 크기와 스펙 비교",
    template: "%s | 디스플레이 비교"
  },
  description:
    "디스플레이 크기, 해상도, 밝기, 주사율, 패널 방식을 실제 사용 감각에 가깝게 비교할 수 있는 화면 비교 도구입니다.",
  keywords: [
    "디스플레이 비교",
    "화면 비교",
    "노트북 디스플레이 비교",
    "PPI 비교",
    "밝기 비교",
    "주사율 비교"
  ],
  openGraph: {
    title: "디스플레이 비교",
    description:
      "실제 크기와 핵심 스펙을 함께 보여주는 디스플레이 비교 도구",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "디스플레이 비교",
    description: "실제 크기와 스펙을 한눈에 비교하는 화면 비교 도구"
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
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeScript />
        <div className="relative isolate">
          <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal-700 dark:text-teal-300">
                  디스플레이 비교
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  화면 크기와 주요 스펙을 직관적으로 정리한 비교 도구
                </p>
              </div>
              <ThemeToggle />
            </div>
          </header>

          <main>{children}</main>

          <footer className="border-t border-white/60 bg-white/60 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 dark:text-slate-400">
              <p>정적 데이터 기반으로 빠르게 동작하며, 검색 유입과 광고 확장을 함께 고려해 설계했습니다.</p>
              <p>현재는 GitHub Pages에 맞춘 정적 구조이며, 필요하면 이후 데이터베이스 연결로 확장할 수 있습니다.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
