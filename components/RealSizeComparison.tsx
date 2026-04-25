"use client";

import { useEffect, useRef, useState } from "react";

import { CreditCardReference } from "@/components/CreditCardReference";
import { cx } from "@/lib/cx";
import {
  calculatePhysicalSize,
  calculateReferenceObjectCssSize,
  CREDIT_CARD_HEIGHT_MM,
  CREDIT_CARD_WIDTH_MM,
  detectUserDevice,
  formatDimensionLabel,
  UserDeviceProfile
} from "@/lib/physical-size";
import { Device } from "@/types/device";

interface RealSizeComparisonProps {
  devices: Device[];
}

function getHardwareLabel(hardwareClass: UserDeviceProfile["hardwareClass"]) {
  switch (hardwareClass) {
    case "phone":
      return "스마트폰";
    case "tablet":
      return "태블릿";
    case "laptop":
      return "노트북";
    case "desktop":
    default:
      return "데스크톱";
  }
}

export function RealSizeComparison({ devices }: RealSizeComparisonProps) {
  const [realSizeEnabled, setRealSizeEnabled] = useState(true);
  const [cardReferenceEnabled, setCardReferenceEnabled] = useState(true);
  const [userDevice, setUserDevice] = useState<UserDeviceProfile | null>(null);
  const [stageWidth, setStageWidth] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function updateDeviceProfile() {
      setUserDevice(detectUserDevice());
    }

    updateDeviceProfile();
    window.addEventListener("resize", updateDeviceProfile);

    return () => {
      window.removeEventListener("resize", updateDeviceProfile);
    };
  }, []);

  useEffect(() => {
    const element = stageRef.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        setStageWidth(entry.contentRect.width);
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const calculatedDisplays = devices.map((device) => ({
    device,
    physical: userDevice ? calculatePhysicalSize(device.display, userDevice) : null
  }));

  const previewBaseWidth = Math.max(...devices.map((device) => device.display.size * 28), 320);

  let sharedScale = 1;
  let isScaledDown = false;

  if (realSizeEnabled && userDevice && calculatedDisplays.every((entry) => entry.physical)) {
    const totalTrueWidth =
      calculatedDisplays.reduce(
        (sum, entry) => sum + (entry.physical?.trueWidthCssPixels ?? 0),
        0
      ) +
      Math.max(0, devices.length - 1) * 72;
    const maxTrueHeight = Math.max(
      ...calculatedDisplays.map((entry) => entry.physical?.trueHeightCssPixels ?? 0),
      1
    );
    const usableStageWidth = Math.max(stageWidth - 96, 320);
    const usableStageHeight = 620;

    sharedScale = Math.min(
      1,
      usableStageWidth / totalTrueWidth,
      usableStageHeight / maxTrueHeight,
      ...calculatedDisplays.map((entry) => entry.physical?.screenFitScale ?? 1)
    );
    isScaledDown = sharedScale < 0.999;
  }

  const creditCardSize =
    realSizeEnabled && userDevice && cardReferenceEnabled
      ? calculateReferenceObjectCssSize(
          CREDIT_CARD_WIDTH_MM,
          CREDIT_CARD_HEIGHT_MM,
          userDevice,
          sharedScale
        )
      : null;

  return (
    <section aria-labelledby="real-size-heading" className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal-700 dark:text-teal-300">
            실제 크기 비교
          </p>
          <h2
            id="real-size-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl"
          >
            실제 화면 비율에 가깝게 크기를 비교해 보세요
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600 dark:text-slate-300">
            화면 대각선과 해상도 비율을 바탕으로 패널의 실제 가로, 세로 길이를 계산하고 현재
            기기의 예상 PPI에 맞춰 가능한 한 실제 크기에 가깝게 표현합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <input
              type="checkbox"
              checked={realSizeEnabled}
              onChange={(event) => setRealSizeEnabled(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            실제 크기 모드
          </label>

          <label className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <input
              type="checkbox"
              checked={cardReferenceEnabled}
              onChange={(event) => setCardReferenceEnabled(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            카드 기준자 표시
          </label>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            {devices.map((device, index) => {
              const physical = calculatedDisplays[index]?.physical;

              return (
                <article
                  key={device.id}
                  className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/88"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                        {device.brand}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                        {device.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {device.tagline}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      비교 {index + 1}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50/90 p-4 dark:bg-slate-900/70">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                        대각선
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
                        {device.display.size.toFixed(1)}"
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/90 p-4 dark:bg-slate-900/70">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                        해상도
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
                        {device.display.resolution.replace("x", " x ")}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/90 p-4 dark:bg-slate-900/70">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                        실제 너비
                      </p>
                      <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                        {physical
                          ? formatDimensionLabel(physical.widthInches, physical.widthMillimeters)
                          : "-"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/90 p-4 dark:bg-slate-900/70">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                        실제 높이
                      </p>
                      <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                        {physical
                          ? formatDimensionLabel(physical.heightInches, physical.heightMillimeters)
                          : "-"}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="rounded-[36px] border border-white/80 bg-white/92 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/92 sm:p-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {realSizeEnabled
                    ? "현재 기기의 추정 PPI를 기준으로 실제 길이에 가깝게 렌더링합니다."
                    : "상대 비율만 빠르게 확인할 수 있는 미리보기 모드입니다."}
                </p>
                {realSizeEnabled && isScaledDown ? (
                  <p className="mt-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
                    현재 화면 안에 두 제품을 함께 보여주기 위해 전체 비교를{" "}
                    {Math.round(sharedScale * 100)}%로 축소했습니다.
                  </p>
                ) : null}
              </div>

              {userDevice ? (
                <div className="rounded-full bg-teal-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-800 dark:bg-teal-500/20 dark:text-teal-300">
                  {getHardwareLabel(userDevice.hardwareClass)} · DPR{" "}
                  {userDevice.devicePixelRatio.toFixed(2)} · 예상 {userDevice.estimatedPpi} PPI
                </div>
              ) : null}
            </div>

            <div ref={stageRef} className="mt-8">
              <div className="overflow-x-auto">
                <div className="min-w-[820px] rounded-[32px] bg-[linear-gradient(180deg,_rgba(240,249,255,0.95),_rgba(241,245,249,0.84))] p-6 dark:bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.94))] sm:p-8">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                      비교 스테이지
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {realSizeEnabled ? "물리 기준 렌더링" : "상대 비율 미리보기"}
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-dashed border-slate-300/80 bg-white/60 px-6 pb-6 pt-12 dark:border-slate-700 dark:bg-slate-950/40">
                    <div className="flex min-h-[580px] items-end justify-center gap-10">
                      {cardReferenceEnabled && creditCardSize ? (
                        <div className="flex items-end self-end pb-1">
                          <CreditCardReference
                            widthCssPixels={creditCardSize.widthCssPixels}
                            heightCssPixels={creditCardSize.heightCssPixels}
                            scalePercent={Math.round(sharedScale * 100)}
                            isActualScale={!isScaledDown}
                          />
                        </div>
                      ) : null}

                      {calculatedDisplays.map(({ device, physical }) => {
                        const width = physical
                          ? realSizeEnabled
                            ? physical.trueWidthCssPixels * sharedScale
                            : (physical.widthInches / 14) * previewBaseWidth
                          : previewBaseWidth;
                        const height = physical
                          ? realSizeEnabled
                            ? physical.trueHeightCssPixels * sharedScale
                            : (physical.heightInches / 14) * previewBaseWidth
                          : previewBaseWidth * 0.625;

                        return (
                          <article key={device.id} className="flex flex-col items-center gap-5">
                            <div
                              className="relative rounded-[34px] bg-slate-950 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.28)]"
                              style={{
                                width: width + 26,
                                height: height + 26
                              }}
                            >
                              <div
                                className={cx(
                                  "absolute inset-[11px] overflow-hidden rounded-[24px] border",
                                  "border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_rgba(15,23,42,1)_52%)]"
                                )}
                                style={{
                                  width,
                                  height
                                }}
                              >
                                <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.14),_transparent_30%,_transparent_70%,_rgba(255,255,255,0.05))]" />
                                <div className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/10" />
                                <div className="absolute bottom-4 left-4 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80">
                                  {device.display.size.toFixed(1)}"
                                </div>
                              </div>
                            </div>

                            <div className="w-full max-w-[360px] rounded-[24px] bg-white/92 p-4 text-sm shadow-sm dark:bg-slate-950/82">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="font-semibold text-slate-950 dark:text-white">
                                    {device.name}
                                  </p>
                                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                                    {device.display.resolution.replace("x", " x ")} ·{" "}
                                    {physical?.resolution.aspectRatioLabel ?? "-"}
                                  </p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                  {realSizeEnabled && !isScaledDown ? "1:1" : "축소 표시"}
                                </span>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/88">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
              내 기기 감지
            </p>
            {userDevice ? (
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/70">
                  화면 크기: {userDevice.screenWidthCssPixels} × {userDevice.screenHeightCssPixels} CSS px
                </div>
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/70">
                  뷰포트: {userDevice.viewportWidthCssPixels} × {userDevice.viewportHeightCssPixels} CSS px
                </div>
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/70">
                  추정 물리 크기:{" "}
                  {formatDimensionLabel(
                    userDevice.screenWidthInches,
                    userDevice.screenWidthMillimeters
                  )}{" "}
                  ×{" "}
                  {formatDimensionLabel(
                    userDevice.screenHeightInches,
                    userDevice.screenHeightMillimeters
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                브라우저 정보를 바탕으로 현재 기기의 물리 화면 크기를 계산하는 중입니다.
              </p>
            )}
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/88 p-6 text-sm leading-6 text-slate-600 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/88 dark:text-slate-300">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
              정확도 안내
            </p>
            <p className="mt-3">
              브라우저는 모니터의 실제 PPI를 직접 제공하지 않습니다. 현재 화면 크기, device
              pixel ratio, 터치 여부를 조합해 가장 현실적인 값을 추정합니다.
            </p>
            <p className="mt-3">
              운영체제 배율, 브라우저 확대 비율, 외부 모니터 환경에 따라 실제 체감 크기에는 오차가
              있을 수 있습니다. 가장 정확한 비교를 위해 브라우저 확대 비율 100%를 권장합니다.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
