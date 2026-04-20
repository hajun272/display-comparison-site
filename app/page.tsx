import { ComparisonExperience } from "@/components/ComparisonExperience";
import devicesData from "@/data/devices.json";
import { Device } from "@/types/device";

const devices = devicesData as Device[];

export default function HomePage() {

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Display Pro",
    description:
      "Side-by-side device display comparison app covering brightness, refresh rate, panel technology, HDR, and pixel density.",
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
                Production-ready comparison app
              </p>
              <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                Compare display specs visually and turn the site into a scalable content business.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Display Pro combines a clear side-by-side comparison table, dynamic device
                selection, dark mode, and ad-ready layouts in a clean Next.js foundation that can
                scale into a full review platform.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] bg-white/90 p-5 backdrop-blur dark:bg-slate-950/75">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                  Live comparison
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                  {devices.length} devices
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Seeded from local JSON with a reusable schema for future database migration.
                </p>
              </div>

              <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-panel dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
                  Built for growth
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <li>Sticky comparison header for long spec tables.</li>
                  <li>SEO metadata, structured data, robots, and sitemap generation.</li>
                  <li>Dedicated ad placeholders for leaderboard and sidebar inventory.</li>
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
