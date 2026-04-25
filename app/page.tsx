import { ComparisonExperience } from "@/components/ComparisonExperience";
import devicesData from "@/data/devices.json";
import { Device } from "@/types/device";

const devices = devicesData as Device[];

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "디스플레이 비교",
    description:
      "밝기, 주사율, 패널 기술, HDR, 픽셀 밀도를 같은 화면에서 비교하는 디스플레이 비교 도구",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-[40px] border border-white/70 bg-hero-grid p-8 shadow-panel dark:border-slate-800 dark:bg-hero-grid-dark sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal-700 dark:text-teal-300">
                실제 사용 감각 중심의 화면 비교
              </p>
              <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                크기와 스펙 차이를 직관적으로 읽는 디스플레이 비교
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                실제 크기 비교, 핵심 스펙 비교표, 빠른 기기 전환 흐름을 한 페이지에 담았습니다.
                복잡한 수치를 보기 좋게 정리해 어떤 화면이 더 선명하고 밝고 큰지 바로 이해할 수
                있도록 구성했습니다.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] bg-white/90 p-5 backdrop-blur dark:bg-slate-950/75">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                  현재 비교 가능한 기기
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                  {devices.length}개
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  정적 JSON 구조로 빠르게 동작하며, 나중에 더 많은 기기를 추가해도 같은 방식으로
                  확장할 수 있습니다.
                </p>
              </div>

              <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-panel dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
                  비교 경험 요약
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <li>실제 크기 감각을 살린 비교 스테이지</li>
                  <li>차이를 강조하는 큰 스펙 비교표</li>
                  <li>광고와 SEO 확장까지 고려한 구조</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <ComparisonExperience initialDevices={devices} />
        </div>
      </section>
    </>
  );
}
