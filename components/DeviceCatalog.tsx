import { cx } from "@/lib/cx";
import { Device } from "@/types/device";

interface DeviceCatalogProps {
  devices: Device[];
  selectedIds: string[];
  onSelect: (slotIndex: number, deviceId: string) => void;
}

export function DeviceCatalog({
  devices,
  selectedIds,
  onSelect
}: DeviceCatalogProps) {
  return (
    <section aria-labelledby="catalog-heading" className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/75">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
            Device library
          </p>
          <h2
            id="catalog-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
          >
            Swap devices into the comparison instantly
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          The grid is powered by local JSON today and can move to MongoDB or Firebase without
          changing the presentation layer.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {devices.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-sm leading-6 text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400 md:col-span-2">
            No devices matched the current search and filter settings. Reset the controls to view
            the full catalog again.
          </div>
        ) : null}

        {devices.map((device) => {
          const selectedSlot = selectedIds.findIndex((selectedId) => selectedId === device.id);

          return (
            <article
              key={device.id}
              className={cx(
                "rounded-[28px] border p-5 transition duration-300",
                "border-slate-200 bg-slate-50/80 hover:-translate-y-1 hover:border-teal-200 hover:bg-white",
                "dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-teal-500/40 dark:hover:bg-slate-900",
                selectedSlot >= 0 && "border-teal-300 bg-teal-50/80 dark:border-teal-500/40 dark:bg-teal-500/10"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                    {device.brand} {device.category}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
                    {device.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {device.tagline}
                  </p>
                </div>
                {selectedSlot >= 0 ? (
                  <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-800 dark:bg-teal-500/20 dark:text-teal-300">
                    Slot {selectedSlot + 1}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl bg-white/90 p-3 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    PPI
                  </p>
                  <p className="mt-2 font-semibold">{device.display.ppi}</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-3 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Brightness
                  </p>
                  <p className="mt-2 font-semibold">{device.display.brightness} nits</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-3 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Refresh
                  </p>
                  <p className="mt-2 font-semibold">{device.display.refreshRate} Hz</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-3 dark:bg-slate-950/70">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    Panel
                  </p>
                  <p className="mt-2 font-semibold">{device.display.panel}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onSelect(0, device.id)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
                >
                  Compare in slot 1
                </button>
                <button
                  type="button"
                  onClick={() => onSelect(1, device.id)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
                >
                  Compare in slot 2
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
