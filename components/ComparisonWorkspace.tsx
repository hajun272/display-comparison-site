"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

import { cx } from "@/lib/cx";
import { Device } from "@/types/device";

interface ComparisonWorkspaceProps {
  devices: Device[];
  children: ReactNode;
}

export function ComparisonWorkspace({
  devices,
  children
}: ComparisonWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);

  const isFullscreen = nativeFullscreen || fallbackFullscreen;

  useEffect(() => {
    function handleFullscreenChange() {
      setNativeFullscreen(document.fullscreenElement === containerRef.current);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFallbackFullscreen(false);
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  async function enterFullscreen() {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    if (typeof element.requestFullscreen === "function") {
      try {
        await element.requestFullscreen();
        return;
      } catch {
        setFallbackFullscreen(true);
        return;
      }
    }

    setFallbackFullscreen(true);
  }

  async function exitFullscreen() {
    if (document.fullscreenElement && typeof document.exitFullscreen === "function") {
      try {
        await document.exitFullscreen();
      } catch {
        setFallbackFullscreen(false);
      }
    }

    setFallbackFullscreen(false);
  }

  return (
    <section
      ref={containerRef}
      aria-labelledby="workspace-heading"
      className={cx(
        "rounded-[40px] border border-white/80 bg-white/88 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/88",
        isFullscreen
          ? "fixed inset-0 z-[120] overflow-y-auto rounded-none border-0 bg-slate-100/95 px-4 py-4 dark:bg-slate-950/96 sm:px-6 sm:py-6"
          : "p-6 sm:p-8"
      )}
    >
      <div className="mx-auto w-full max-w-[1440px] space-y-6">
        <div
          className={cx(
            "flex flex-col gap-4 rounded-[32px] border border-slate-200/80 bg-slate-50/85 p-5 dark:border-slate-800 dark:bg-slate-900/70",
            isFullscreen && "sticky top-0 z-30 bg-slate-50/95 backdrop-blur dark:bg-slate-900/92"
          )}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal-700 dark:text-teal-300">
                비교 워크스페이스
              </p>
              <h2
                id="workspace-heading"
                className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white"
              >
                화면 크기와 주요 스펙을 크게 비교하세요
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                실제 크기 비교와 스펙 표를 한 구역에 모아 집중해서 볼 수 있게 구성했습니다.
                전체화면에서는 주변 UI를 덜어내고 비교에만 몰입할 수 있습니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {devices.map((device, index) => (
                <div
                  key={device.id}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                >
                  <span className="font-semibold text-slate-950 dark:text-white">
                    비교 {index + 1}
                  </span>{" "}
                  {device.name}
                </div>
              ))}

              <button
                type="button"
                onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
              >
                {isFullscreen ? "전체화면 종료" : "전체화면 보기"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-white px-3 py-1.5 dark:bg-slate-950">
              실제 크기 비교 지원
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 dark:bg-slate-950">
              신용카드 기준자 표시
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 dark:bg-slate-950">
              차이 강조 스펙 표
            </span>
          </div>
        </div>

        <div className="space-y-8">{children}</div>
      </div>
    </section>
  );
}
