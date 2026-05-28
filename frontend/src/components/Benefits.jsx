import { SparklesIcon } from "./IconSet";

export default function Benefits({ items }) {
  return (
    <section className="section-shell pb-16" id="benefits">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <span className="section-kicker">Product Benefits</span>
          <h2 className="section-title">
            Everything Your Home Needs to Stay Clean
          </h2>
          <p className="section-copy">
            A product range designed to handle routine cleaning, freshness, and
            hygiene across every room.
          </p>
          <div className="mt-6 rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-sky-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Built for daily routines
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Choose from smaller household packs or larger bulk sizes depending
              on your home, facility, or retail needs.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((benefit) => (
            <div
              key={benefit}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-800">
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
