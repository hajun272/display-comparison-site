import { cx } from "@/lib/cx";
import {
  comparisonRows,
  formatMetricValue,
  getBestDisplayPickId,
  getMetricLeaderIds,
  metricHasDifference
} from "@/lib/device-utils";
import { Device } from "@/types/device";

interface ComparisonTableProps {
  devices: Device[];
}

export function ComparisonTable({ devices }: ComparisonTableProps) {
  const bestDisplayPickId = getBestDisplayPickId(devices);

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 top-[73px] z-30 min-w-[220px] border-b border-slate-200 bg-white/95 px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-400">
                Metric
              </th>
              {devices.map((device) => (
                <th
                  key={device.id}
                  className="sticky top-[73px] z-20 min-w-[260px] border-b border-slate-200 bg-white/95 px-6 py-5 text-left align-top backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                        {device.brand}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
                        {device.name}
                      </p>
                      <p className="mt-2 max-w-[22rem] text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {device.tagline}
                      </p>
                    </div>
                    {bestDisplayPickId === device.id ? (
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-800 dark:bg-teal-500/20 dark:text-teal-300">
                        Best pick
                      </span>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => {
              const hasDifference = metricHasDifference(devices, row.key);
              const leaderIds = getMetricLeaderIds(devices, row.key);

              return (
                <tr key={row.key}>
                  <th className="sticky left-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-5 text-left align-top dark:border-slate-800 dark:bg-slate-950/95">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{row.label}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{row.helper}</p>
                  </th>
                  {devices.map((device) => {
                    const isLeader = leaderIds.has(device.id);

                    return (
                      <td
                        key={`${device.id}-${row.key}`}
                        className={cx(
                          "border-b border-slate-100 px-6 py-5 text-base text-slate-700 transition duration-300 dark:border-slate-800 dark:text-slate-200",
                          hasDifference &&
                            "bg-amber-50/70 font-semibold text-slate-950 dark:bg-amber-500/10 dark:text-white",
                          isLeader &&
                            "bg-teal-50/80 text-teal-900 dark:bg-teal-500/10 dark:text-teal-200"
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span>{formatMetricValue(device, row.key)}</span>
                          {isLeader ? (
                            <span className="rounded-full border border-teal-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700 dark:border-teal-500/40 dark:bg-slate-950 dark:text-teal-300">
                              Lead
                            </span>
                          ) : null}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
