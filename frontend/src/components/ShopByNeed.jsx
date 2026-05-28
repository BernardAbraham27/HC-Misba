import { CategorySymbol } from "./IconSet";

const toneMap = [
  "bg-emerald-50 text-emerald-700",
  "bg-sky-50 text-sky-700",
  "bg-cyan-50 text-cyan-700",
  "bg-orange-50 text-orange-700",
];

export default function ShopByNeed({ items, onSelectNeed }) {
  return (
    <section className="section-shell py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">Shop by Need</span>
        <h2 className="section-title">Shop by Cleaning Need</h2>
        <p className="section-copy">
          Choose products based on the cleaning task you want to solve right now.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                toneMap[index % toneMap.length]
              }`}
            >
              <CategorySymbol icon={item.icon} className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            <button
              type="button"
              onClick={() => onSelectNeed(item)}
              className="mt-5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              View Products
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
