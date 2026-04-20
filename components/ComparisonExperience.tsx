"use client";

import { useState } from "react";

import { AdSlot } from "@/components/AdSlot";
import { ComparisonTable } from "@/components/ComparisonTable";
import { DeviceCatalog } from "@/components/DeviceCatalog";
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
    .map((selectedId) =>
      initialDevices.find((device) => device.id === selectedId) ?? null
    )
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
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-8">
        <AdSlot label="Top leaderboard placement" variant="banner" />

        <section
          aria-labelledby="controls-heading"
          className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/75"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
                Compare smarter
              </p>
              <h2
                id="controls-heading"
                className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
              >
                Device selection, filtering, and sorting
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Use search or the dropdown slots to compare real display metrics side-by-side. The
              experience is fully client-driven and powered by static JSON for GitHub Pages.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {[0, 1].map((slotIndex) => (
              <label
                key={slotIndex}
                className="rounded-[26px] border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/80"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                  Compare slot {slotIndex + 1}
                </span>
                <select
                  value={selectedIds[slotIndex] ?? ""}
                  onChange={(event) => updateSelection(slotIndex, event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-teal-500"
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
            <label className="rounded-[26px] border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                Search devices
              </span>
              <input
                type="search"
                placeholder="Search by name, brand, or panel"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-teal-500"
              />
            </label>

            <label className="rounded-[26px] border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                Filter by panel
              </span>
              <select
                value={panelFilter}
                onChange={(event) => setPanelFilter(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-teal-500"
              >
                {panelOptions.map((panel) => (
                  <option key={panel} value={panel}>
                    {panel === "all" ? "All panels" : panel}
                  </option>
                ))}
              </select>
            </label>

            <label className="rounded-[26px] border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                Sort catalog
              </span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-teal-500"
              >
                <option value="name">Alphabetical</option>
                <option value="ppi">Highest PPI</option>
                <option value="brightness">Highest brightness</option>
                <option value="refreshRate">Highest refresh rate</option>
              </select>
            </label>
          </div>
        </section>

        <section aria-labelledby="comparison-heading" className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
                Side-by-side table
              </p>
              <h2
                id="comparison-heading"
                className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white"
              >
                Compare the displays at a glance
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Differences are highlighted automatically, and standout metrics are marked so users
              can identify the strongest panel quickly.
            </p>
          </div>

          <ComparisonTable devices={comparedDevices} />
        </section>

        <DeviceCatalog
          devices={catalogDevices}
          selectedIds={selectedIds}
          onSelect={updateSelection}
        />
      </div>

      <aside className="space-y-6">
        <div className="sticky top-24 space-y-6">
          <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
              Best value highlight
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
              {bestDisplayPick?.name ?? "No device selected"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              This score rewards sharper panels, stronger brightness, smoother refresh rates, and
              richer display technologies.
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

          <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
              Monetization ready
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <li className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/70">
                Semantic layout with sections, headings, and crawlable metadata.
              </li>
              <li className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/70">
                Ad slots above the fold and in the sticky sidebar without CLS issues.
              </li>
              <li className="rounded-2xl bg-slate-50/80 px-4 py-3 dark:bg-slate-900/70">
                Local JSON data layer that can scale into an external database later.
              </li>
            </ul>
          </div>

          <AdSlot label="Sidebar media unit" variant="sidebar" />

          <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 text-sm leading-6 text-slate-600 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
              Static data model
            </p>
            <p className="mt-3">
              Device specs are bundled from a local JSON dataset at build time, so the site works
              on GitHub Pages without any backend or API routes.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
