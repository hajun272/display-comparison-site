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
    <div className="overflow-hidden rounded-[36px] border border-white/80 bg-white/92 shadow-panel backdrop-blur dark:border-slate-800 dark:bg-slate-950/92">
      <div className="grid gap-4 border-b border-slate-200/80 bg-slate-50/90 p-6 dark:border-slate-800 dark:bg-slate-900/65 lg:grid-cols-[240px_repeat(2,minmax(0,1fr))]">
        <div className="rounded-[24px] bg-white/90 p-5 dark:bg-slate-950/90">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
            비교 안내
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            좌측에는 항목 설명, 우측에는 각 기기의 수치를 배치했습니다. 차이가 있는 값은 강조
            배경으로, 더 우세한 값은 배지로 표시해 가독성을 높였습니다.
          </p>
        </div>

        {devices.map((device) => (
          <div
            key={device.id}
            className="rounded-[28px] border border-slate-200 bg-white/95 p-6 dark:border-slate-800 dark:bg-slate-950/95"
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

              {bestDisplayPickId === device.id ? (
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-800 dark:bg-teal-500/20 dark:text-teal-300">
                  추천
                </span>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {device.display.size.toFixed(1)}"
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {device.display.panel}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {device.display.refreshRate}Hz
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 top-[73px] z-30 min-w-[240px] border-b border-slate-200 bg-white/95 px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-400">
                비교 항목
              </th>
              {devices.map((device) => (
                <th
                  key={device.id}
                  className="sticky top-[73px] z-20 min-w-[320px] border-b border-slate-200 bg-white/95 px-6 py-5 text-left text-sm font-semibold text-slate-900 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-100"
                >
                  {device.name}
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
                  <th className="sticky left-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-6 text-left align-top dark:border-slate-800 dark:bg-slate-950/95">
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {row.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {row.helper}
                    </p>
                  </th>

                  {devices.map((device) => {
                    const isLeader = leaderIds.has(device.id);

                    return (
                      <td
                        key={`${device.id}-${row.key}`}
                        className={cx(
                          "border-b border-slate-100 px-6 py-6 align-top text-base transition duration-300 dark:border-slate-800",
                          hasDifference
                            ? "bg-amber-50/75 text-slate-950 dark:bg-amber-500/10 dark:text-white"
                            : "text-slate-700 dark:text-slate-200",
                          isLeader &&
                            "bg-teal-50/85 text-teal-950 dark:bg-teal-500/10 dark:text-teal-200"
                        )}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className={cx("text-lg", hasDifference && "font-semibold")}>
                            {formatMetricValue(device, row.key)}
                          </span>
                          {isLeader ? (
                            <span className="rounded-full border border-teal-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700 dark:border-teal-500/40 dark:bg-slate-950 dark:text-teal-300">
                              우세
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
