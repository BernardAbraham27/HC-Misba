import { CubeIcon, ShieldIcon, SparklesIcon, TruckIcon } from "./IconSet";
import HeroProductSlider from "./HeroProductSlider";

const trustBadges = [
  { label: "Quality Products", icon: ShieldIcon },
  { label: "Safe for Daily Use", icon: SparklesIcon },
  { label: "Fast Delivery", icon: TruckIcon },
  { label: "Bulk Orders Available", icon: CubeIcon },
];

export default function HeroSection({ slides, onNavigate }) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_30%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_24%),linear-gradient(135deg,#ecfff5_0%,#ffffff_48%,#eef8ff_100%)]"
    >
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-0 top-12 h-48 w-48 rounded-full bg-emerald-200/45 blur-3xl" />
        <div className="absolute right-0 top-20 h-60 w-60 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-teal-200/35 blur-3xl" />
      </div>

      <div className="section-shell relative py-10 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 shadow-sm">
              5 Star Rated Home Care Products
            </span>

            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-[3.35rem]">
              Ready to Make Your Home Cleaner, Fresher &amp; Safer?
            </h1>

            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Shop trusted cleaning essentials for bathrooms, kitchens, floors,
              laundry, glass, and everyday hygiene.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate("/products")}
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/70 transition hover:bg-emerald-700"
              >
                Shop Now
              </button>
              <button
                type="button"
                onClick={() => onNavigate("/#best-sellers")}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Explore Products
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;

                return (
                  <div
                    key={badge.label}
                    className="rounded-[1.4rem] border border-emerald-100 bg-white/85 px-4 py-4 shadow-sm backdrop-blur"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-sm font-semibold leading-5 text-slate-800">
                      {badge.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <HeroProductSlider slides={slides} onNavigate={onNavigate} />
        </div>
      </div>
    </section>
  );
}
