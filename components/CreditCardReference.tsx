import { formatDimensionLabel } from "@/lib/physical-size";

interface CreditCardReferenceProps {
  widthCssPixels: number;
  heightCssPixels: number;
  scalePercent: number;
  isActualScale: boolean;
}

export function CreditCardReference({
  widthCssPixels,
  heightCssPixels,
  scalePercent,
  isActualScale
}: CreditCardReferenceProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative overflow-hidden rounded-xl border border-slate-300 bg-[linear-gradient(135deg,_#fef3c7,_#f8fafc_36%,_#dbeafe_100%)] shadow-lg dark:border-slate-600"
        style={{
          width: widthCssPixels,
          height: heightCssPixels
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.62),_transparent_55%)]" />
        <div className="absolute left-[9%] top-[22%] h-[28%] w-[18%] rounded-md bg-amber-200/90 shadow-sm" />
        <div className="absolute bottom-[16%] left-[10%] text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-600">
          기준자
        </div>
      </div>

      <div className="rounded-2xl bg-white/90 px-3 py-2 text-center text-xs leading-5 text-slate-600 shadow-sm dark:bg-slate-950/80 dark:text-slate-300">
        <p className="font-semibold text-slate-900 dark:text-white">신용카드 기준자</p>
        <p>
          {formatDimensionLabel(3.37, 85.6)} × {formatDimensionLabel(2.13, 53.98)}
        </p>
        <p>{isActualScale ? "실제 배율 기준" : `현재 비교 배율 ${scalePercent}% 적용`}</p>
      </div>
    </div>
  );
}
