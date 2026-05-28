import { HighlightSymbol } from "./IconSet";

const toneMap = [
  "bg-emerald-50 text-emerald-700",
  "bg-sky-50 text-sky-700",
  "bg-teal-50 text-teal-700",
  "bg-amber-50 text-amber-700",
];

export default function WhyChooseUs({ items }) {
  return (
    <section className="section-shell py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">Why Choose Us</span>
        <h2 className="section-title">Why Choose God Grace Home Products?</h2>
        <p className="section-copy">
          Trusted cleaning performance, fresh fragrance, and practical pricing for
          homes and business supply needs.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                toneMap[index % toneMap.length]
              }`}
            >
              <HighlightSymbol icon={item.icon} className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
