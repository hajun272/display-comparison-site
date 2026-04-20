import { cx } from "@/lib/cx";

interface AdSlotProps {
  label: string;
  variant?: "banner" | "sidebar";
}

export function AdSlot({ label, variant = "banner" }: AdSlotProps) {
  return (
    <aside
      aria-label={`${label} advertising placeholder`}
      className={cx(
        "overflow-hidden rounded-[28px] border border-dashed border-slate-300/80 bg-white/70 p-5 text-sm text-slate-500 shadow-sm backdrop-blur",
        "dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400",
        variant === "banner" ? "min-h-[120px]" : "min-h-[260px]"
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
        Ad space
      </p>
      <p className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
        {label}
      </p>
      <p className="mt-2 leading-6">
        Reserved for Google AdSense or direct sponsorship units without shifting layout.
      </p>
    </aside>
  );
}

