import ProductBottle from "./ProductBottle";
import { ShieldIcon, SparklesIcon, StarIcon, TruckIcon } from "./IconSet";

const heroProductsLeft = [
  { name: "Toilet Cleaner", tone: "blue", badge: "Best Seller", alt: "God Grace Toilet Cleaner bottle illustration" },
  { name: "Floor Cleaner", tone: "emerald", badge: "Popular", alt: "God Grace Floor Cleaner bottle illustration" },
  { name: "Dishwash Liquid", tone: "sky", badge: "Top Rated", alt: "God Grace Dishwash Liquid bottle illustration" },
];

const heroProductsRight = [
  { name: "Laundry Liquid", tone: "teal", badge: "Fresh Wash", alt: "God Grace Laundry Liquid bottle illustration" },
  { name: "Room Freshener", tone: "amber", badge: "New Arrival", alt: "God Grace Room Freshener bottle illustration" },
  { name: "Handwash", tone: "pink", badge: "Daily Care", alt: "God Grace Handwash bottle illustration" },
];

const trustBadges = [
  { label: "5 Star Rated", icon: StarIcon },
  { label: "Safe for Daily Use", icon: ShieldIcon },
  { label: "Fresh Fragrance", icon: SparklesIcon },
  { label: "Fast Delivery", icon: TruckIcon },
];

function BottleCluster({ items, align = "left" }) {
  return (
    <div className={`grid gap-4 ${align === "right" ? "justify-items-end" : "justify-items-start"}`}>
      {items.map((item, index) => (
        <div
          key={item.name}
          className={`flex items-end gap-3 rounded-[2rem] border border-white/70 bg-white/75 p-3 shadow-lg backdrop-blur ${
            index === 1 ? "translate-x-4 lg:translate-x-6" : ""
          } ${index === 2 ? "translate-y-2" : ""}`}
        >
          <ProductBottle
            name={item.name}
            tone={item.tone}
            badge={item.badge}
            alt={item.alt}
            size="card"
          />
        </div>
      ))}
    </div>
  );
}

export default function HomeHero({ onNavigate }) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-emerald-100 via-white to-sky-100"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_28%)]" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.2fr_0.9fr]">
          <div className="hidden lg:block">
            <BottleCluster items={heroProductsLeft} />
          </div>

          <div className="relative rounded-[2.5rem] border border-emerald-100 bg-white/80 p-6 shadow-xl backdrop-blur sm:p-8 lg:p-10">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              5 Star Rated Home Care Products
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-[3.3rem]">
              Ready to Make Your Home Cleaner, Fresher &amp; Safer?
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
              Shop trusted cleaning essentials for bathrooms, kitchens, floors,
              laundry, glass, and everyday hygiene.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate("/products")}
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Shop Now
              </button>
              <a
                href="#featured-products"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Explore Products
              </a>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="rounded-2xl border border-emerald-100 bg-white px-4 py-4 shadow-sm"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <p className="mt-3 text-sm font-semibold leading-5 text-slate-800">
                      {badge.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:hidden">
              {[heroProductsLeft[0], heroProductsRight[0]].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-center rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-3"
                >
                  <ProductBottle
                    name={item.name}
                    tone={item.tone}
                    badge={item.badge}
                    alt={item.alt}
                    size="card"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <BottleCluster items={heroProductsRight} align="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
