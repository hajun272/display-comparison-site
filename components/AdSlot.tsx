import { cx } from "@/lib/cx";

interface AdSlotProps {
  label: string;
  variant?: "banner" | "sidebar";
}

export function AdSlot({ label, variant = "banner" }: AdSlotProps) {
  return (
    <aside
      aria-label={`${label} 광고 자리 예시`}
      className={cx(
        "overflow-hidden rounded-[28px] border border-dashed border-slate-300/80 bg-white/70 p-5 text-sm text-slate-500 shadow-sm backdrop-blur",
        "dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400",
        variant === "banner" ? "min-h-[120px]" : "min-h-[260px]"
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
        광고 영역
      </p>
      <p className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{label}</p>
      <p className="mt-2 leading-6">
        Google AdSense나 직접 판매 광고를 붙여도 레이아웃이 흔들리지 않도록 미리 공간을
        확보한 자리입니다.
      </p>
    </aside>
  );
}
