import { CategorySymbol } from "./IconSet";

const toneMap = {
  emerald: "from-emerald-100 via-white to-emerald-50 text-emerald-700",
  green: "from-green-100 via-white to-emerald-50 text-green-700",
  sky: "from-sky-100 via-white to-cyan-50 text-sky-700",
  teal: "from-teal-100 via-white to-cyan-50 text-teal-700",
  blue: "from-blue-100 via-white to-sky-50 text-blue-700",
  cyan: "from-cyan-100 via-white to-sky-50 text-cyan-700",
  indigo: "from-indigo-100 via-white to-blue-50 text-indigo-700",
  orange: "from-orange-100 via-white to-amber-50 text-orange-700",
  pink: "from-pink-100 via-white to-rose-50 text-pink-700",
  purple: "from-purple-100 via-white to-fuchsia-50 text-purple-700",
  violet: "from-violet-100 via-white to-purple-50 text-violet-700",
  amber: "from-amber-100 via-white to-yellow-50 text-amber-700",
};

export default function CategoryStrip({
  items,
  activeCategoryId,
  onSelectCategory,
}) {
  return (
    <section id="categories" className="section-shell py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">Shop by Category</span>
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-copy">
          Browse home care essentials by category and jump straight to the products
          that match your cleaning routine.
        </p>
      </div>

      <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        <div className="flex min-w-max gap-4 md:grid md:min-w-0 md:grid-cols-4">
          {items.map((item) => {
            const isActive = activeCategoryId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory(item)}
                className="group w-[220px] shrink-0 rounded-[2rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg md:w-auto"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-gradient-to-br shadow-lg shadow-emerald-100/60 transition group-hover:scale-[1.03] ${
                      toneMap[item.tone] ?? toneMap.emerald
                    } ${isActive ? "ring-2 ring-emerald-300 ring-offset-2" : ""}`}
                  >
                    <CategorySymbol icon={item.icon} className="h-8 w-8" />
                  </div>
                  <div className="min-w-0 pt-2">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {item.productNames.length} product{item.productNames.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-6 text-slate-900">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
