const cards = [
  {
    id: "own",
    title: "God Grace Home Products",
    badge: "Own Brand",
    description: "Trusted home care essentials from our own product range.",
    monogram: "GG",
  },
  {
    id: "other",
    title: "Other Brands",
    badge: "Multi Brand",
    description: "Selected cleaning and hygiene products from trusted brands.",
    monogram: "MB",
  },
];

export default function ShopByBrand({
  activeBrandScope,
  ownBrandCount,
  otherBrandCount,
  onSelectBrand,
  onClearBrandFilter,
}) {
  return (
    <section className="section-shell py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">Shop by Brand</span>
        <h2 className="section-title">Shop by Brand</h2>
        <p className="section-copy">
          Browse God Grace own-brand essentials or switch to partner-brand
          products in one tap.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {cards.map((card) => {
          const isActive = activeBrandScope === card.id;
          const count = card.id === "own" ? ownBrandCount : otherBrandCount;

          return (
            <article
              key={card.id}
              className={`rounded-[2rem] border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                isActive ? "border-emerald-300 ring-2 ring-emerald-200" : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-lg font-bold text-white shadow-lg shadow-emerald-200/70">
                  {card.monogram}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      card.id === "own"
                        ? "bg-slate-950 text-white"
                        : "bg-sky-50 text-sky-700"
                    }`}
                  >
                    {card.badge}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    {count} product{count === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <h3 className="mt-5 text-2xl font-semibold text-slate-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>

              <button
                type="button"
                onClick={() => onSelectBrand(card.id)}
                className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                View Products
              </button>
            </article>
          );
        })}
      </div>

      {activeBrandScope !== "all" ? (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onClearBrandFilter}
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            Show All Brands
          </button>
        </div>
      ) : null}
    </section>
  );
}
