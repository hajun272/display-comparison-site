"use client";

import { useState } from "react";

import { AdSlot } from "@/components/AdSlot";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ComparisonWorkspace } from "@/components/ComparisonWorkspace";
import { DeviceCatalog } from "@/components/DeviceCatalog";
import { RealSizeComparison } from "@/components/RealSizeComparison";
import { filterDevices } from "@/lib/device-catalog";
import { getBestDisplayPickId, getBestDisplayReasons } from "@/lib/device-utils";
import { Device, SortOption } from "@/types/device";

interface ComparisonExperienceProps {
  initialDevices: Device[];
}

export function ComparisonExperience({ initialDevices }: ComparisonExperienceProps) {
  const defaultIds = initialDevices.slice(0, 2).map((device) => device.id);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultIds);
  const [search, setSearch] = useState("");
  const [panelFilter, setPanelFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const catalogDevices = filterDevices(initialDevices, {
    search,
    panel: panelFilter,
    sortBy
  });

  const selectedDevices = selectedIds
    .map((selectedId) => initialDevices.find((device) => device.id === selectedId) ?? null)
    .filter((device): device is Device => Boolean(device));

  const fallbackDevices = initialDevices.filter(
    (device) => !selectedDevices.some((selected) => selected.id === device.id)
  );
  const comparedDevices = [...selectedDevices, ...fallbackDevices].slice(0, 2);
  const bestDisplayPick = comparedDevices.find(
    (device) => device.id === getBestDisplayPickId(comparedDevices)
  );
  const panelOptions = ["all", ...new Set(initialDevices.map((device) => device.display.panel))];

  function updateSelection(slotIndex: number, deviceId: string) {
    setSelectedIds((current) => {
      const next = [...current];
      const otherSlotIndex = slotIndex === 0 ? 1 : 0;

      if (next[otherSlotIndex] === deviceId) {
        next[otherSlotIndex] = next[slotIndex];
      }

      next[slotIndex] = deviceId;
      return next;
    });
  }

  return (
    <div className="space-y-10">
      <section
        aria-labelledby="controls-heading"
        className="rounded-[36px] border border-white/80 bg-white/80 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:p-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal-700 dark:text-teal-300">
              비교 설정
            </p>
            <h2
              id="controls-heading"
              className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white"
            >
              비교할 화면을 고르고 바로 확인하세요
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              두 제품을 고르면 실제 크기 비교와 스펙 차이를 한 번에 볼 수 있습니다. 검색, 패널
              필터, 정렬을 이용해 원하는 모델을 빠르게 찾아보세요.
            </p>
          </div>
          <AdSlot label="상단 배너 광고 영역" variant="banner" />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {[0, 1].map((slotIndex) => (
            <label
              key={slotIndex}
              className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-900/80"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                비교 슬롯 {slotIndex + 1}
              </span>
              <select
                value={selectedIds[slotIndex] ?? ""}
                onChange={(event) => updateSelection(slotIndex, event.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-medium text-slate-900 outline-none transition focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-teal-500"
              >
                {initialDevices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <label className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-900/80">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              기기 검색
            </span>
            <input
              type="search"
              placeholder="기기명, 브랜드, 패널 방식으로 검색"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-teal-500"
            />
          </label>

          <label className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-900/80">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              패널 필터
            </span>
            <select
              value={panelFilter}
              onChange={(event) => setPanelFilter(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-teal-500"
            >
              {panelOptions.map((panel) => (
                <option key={panel} value={panel}>
                  {panel === "all" ? "모든 패널" : panel}
                </option>
              ))}
            </select>
          </label>

          <label className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-900/80">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              정렬 기준
            </span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-teal-500"
            >
              <option value="name">이름순</option>
              <option value="ppi">PPI 높은 순</option>
              <option value="brightness">밝기 높은 순</option>
              <option value="refreshRate">주사율 높은 순</option>
            </select>
          </label>
        </div>
      </section>

      <ComparisonWorkspace devices={comparedDevices}>
        <RealSizeComparison devices={comparedDevices} />
        <section aria-labelledby="comparison-heading" className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
                스펙 비교
              </p>
              <h2
                id="comparison-heading"
                className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white"
              >
                핵심 차이를 한눈에 읽는 비교표
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              차이가 있는 항목은 강조 색으로, 각 항목의 우세 값은 배지로 표시했습니다. 숫자를
              하나씩 읽지 않아도 어느 쪽이 강한지 바로 파악할 수 있습니다.
            </p>
          </div>

          <ComparisonTable devices={comparedDevices} />
        </section>
      </ComparisonWorkspace>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
            추천 화면
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
            {bestDisplayPick?.name ?? "선택된 기기 없음"}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            픽셀 밀도, 밝기, 주사율, 패널 특성을 가중치로 반영한 간단한 추천 결과입니다.
            실제 구매 판단 전에는 가격과 용도도 함께 고려해 보세요.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {bestDisplayPick
              ? getBestDisplayReasons(bestDisplayPick).map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {reason}
                  </span>
                ))
              : null}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
            데이터 구조
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            현재는 정적 JSON 데이터로 빠르게 로드되며, 비교 UI는 데이터 소스와 분리되어 있어
            이후 MongoDB나 Firebase로 확장하기 쉽게 설계했습니다.
          </p>
          <div className="mt-5 rounded-2xl bg-slate-50/80 px-4 py-4 text-sm leading-6 text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
            검색, 필터, 정렬 로직은 독립 유틸로 분리되어 있어 새로운 모델을 추가하거나 데이터
            저장소를 교체해도 UI를 크게 바꾸지 않아도 됩니다.
          </div>
        </div>

        <AdSlot label="사이드 광고 영역" variant="sidebar" />
      </section>

      <DeviceCatalog
        devices={catalogDevices}
        selectedIds={selectedIds}
        onSelect={updateSelection}
      />
    </div>
  );
}
