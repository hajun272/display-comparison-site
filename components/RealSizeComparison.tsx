"use client";

import { useEffect, useState } from "react";

import { cx } from "@/lib/cx";
import {
  calculatePhysicalSize,
  detectUserDevice,
  formatDimensionLabel,
  getDisplayPhysicalSize,
  UserDeviceProfile
} from "@/lib/physical-size";
import { Device } from "@/types/device";

interface RealSizeComparisonProps {
  devices: Device[];
}

function formatScreenClassName(hardwareClass: UserDeviceProfile["hardwareClass"]) {
  switch (hardwareClass) {
    case "phone":
      return "Phone";
    case "tablet":
      return "Tablet";
    case "laptop":
      return "Laptop";
    case "desktop":
    default:
      return "Desktop";
  }
}

export function RealSizeComparison({ devices }: RealSizeComparisonProps) {
  const [enabled, setEnabled] = useState(true);
  const [userDevice, setUserDevice] = useState<UserDeviceProfile | null>(null);

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

  const physicalDisplays = devices.map((device) => {
    const physical = getDisplayPhysicalSize(device.display);
    const calculated = userDevice ? calculatePhysicalSize(device.display, userDevice) : null;

    return {
      device,
      physical,
      calculated
    };
  });

  const maxPreviewWidth = Math.max(...physicalDisplays.map((entry) => entry.physical.widthInches), 1);

  return (
    <section aria-labelledby="real-size-heading" className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
            Real-world size
          </p>
          <h2
            id="real-size-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white"
          >
            실제 물리 크기로 디스플레이를 비교하세요
          </h2>
        </div>
        <label className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          실제 크기 비교 사용
        </label>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {enabled
                  ? "사용 중인 화면의 예상 PPI와 devicePixelRatio를 이용해 CSS 픽셀을 실제 물리 길이에 가깝게 맞춥니다."
                  : "토글을 끄면 실제 길이 대신 상대적인 크기 차이만 더 간단히 미리봅니다."}
              </p>
            </div>
            {userDevice ? (
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-800 dark:bg-teal-500/20 dark:text-teal-300">
                {formatScreenClassName(userDevice.hardwareClass)}
              </span>
            ) : null}
          </div>

          <div className="mt-6 overflow-x-auto">
            <div className="min-w-max rounded-[28px] bg-slate-100/80 p-6 dark:bg-slate-900/70">
              <div className="flex min-h-[520px] items-end gap-8 border-b border-dashed border-slate-300 pb-4 dark:border-slate-700">
                {physicalDisplays.map(({ device, physical, calculated }) => {
                  const previewScale = 340 / maxPreviewWidth;
                  const renderedWidth = enabled && calculated
                    ? calculated.renderedWidthCssPixels
                    : physical.widthInches * previewScale;
                  const renderedHeight = enabled && calculated
                    ? calculated.renderedHeightCssPixels
                    : physical.heightInches * previewScale;
                  const bezelPadding = enabled ? 14 : 12;

                  return (
                    <article key={device.id} className="flex flex-col items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                          {device.brand}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                          {device.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          {device.display.size.toFixed(1)}" · {physical.resolution.aspectRatioLabel} ·{" "}
                          {device.display.resolution.replace("x", " x ")}
                        </p>
                      </div>

                      <div
                        className="relative rounded-[28px] bg-slate-950 p-3 shadow-2xl transition duration-300"
                        style={{
                          width: renderedWidth + bezelPadding * 2,
                          height: renderedHeight + bezelPadding * 2
                        }}
                      >
                        <div
                          className={cx(
                            "absolute inset-[10px] rounded-[18px] border transition duration-300",
                            enabled
                              ? "border-teal-400/70 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.16),_rgba(15,23,42,0.98)_50%)]"
                              : "border-slate-700 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.16),_rgba(15,23,42,0.98)_52%)]"
                          )}
                          style={{
                            width: renderedWidth,
                            height: renderedHeight
                          }}
                        >
                          <div className="absolute inset-0 rounded-[18px] bg-[linear-gradient(135deg,_rgba(255,255,255,0.12),_transparent_35%,_transparent_70%,_rgba(255,255,255,0.06))]" />
                        </div>
                      </div>

                      <div className="w-full max-w-[360px] space-y-2 rounded-[24px] bg-white/90 p-4 text-sm shadow-sm dark:bg-slate-950/80">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500 dark:text-slate-400">실측 패널 크기</span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {formatDimensionLabel(
                              physical.widthInches,
                              physical.widthMillimeters
                            )}{" "}
                            ×{" "}
                            {formatDimensionLabel(
                              physical.heightInches,
                              physical.heightMillimeters
                            )}
                          </span>
                        </div>

                        {enabled && calculated ? (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500 dark:text-slate-400">렌더링 상태</span>
                            <span
                              className={cx(
                                "font-semibold",
                                calculated.isScaledDown
                                  ? "text-amber-700 dark:text-amber-300"
                                  : "text-teal-700 dark:text-teal-300"
                              )}
                            >
                              {calculated.isScaledDown
                                ? `${calculated.scaleNotice} (${Math.round(
                                    calculated.fitScale * 100
                                  )}%)`
                                : "1:1 physical scale"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500 dark:text-slate-400">렌더링 상태</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              Relative preview
                            </span>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
              User device detection
            </p>
            {userDevice ? (
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/70">
                  Screen: {userDevice.screenWidthCssPixels} × {userDevice.screenHeightCssPixels} CSS px
                </div>
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/70">
                  Viewport: {userDevice.viewportWidthCssPixels} ×{" "}
                  {userDevice.viewportHeightCssPixels} CSS px
                </div>
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/70">
                  Device pixel ratio: {userDevice.devicePixelRatio.toFixed(2)}
                </div>
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/70">
                  Estimated PPI: {userDevice.estimatedPpi}
                </div>
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/70">
                  Estimated physical screen:{" "}
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
                브라우저 정보를 읽어 실제 비교값을 계산하는 중입니다.
              </p>
            )}
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 text-sm leading-6 text-slate-600 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
              Accuracy notice
            </p>
            <p className="mt-3">
              브라우저는 실제 모니터의 물리 PPI를 직접 제공하지 않기 때문에, 현재 기기의 화면 크기,
              device pixel ratio, 터치 여부를 조합해 PPI를 추정합니다.
            </p>
            <p className="mt-3">
              운영체제 배율, 브라우저 줌, 제조사 패널 차이 때문에 결과는 완벽히 동일하지 않을 수
              있으며, 가장 정확한 비교를 위해 브라우저 배율 100% 상태를 권장합니다.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
