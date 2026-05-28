import { StarIcon } from "./IconSet";

export default function Reviews({ reviews }) {
  return (
    <section id="reviews" className="section-shell py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">Customer Reviews</span>
        <h2 className="section-title">Loved by Families and Businesses</h2>
        <p className="section-copy">
          Real feedback from customers who use God Grace products in everyday
          homes and workspaces.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {reviews.map((item) => (
          <article
            key={item.id}
            className="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{item.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Product: {item.product}
                </p>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <StarIcon key={index} filled className="h-4 w-4" />
                ))}
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">"{item.review}"</p>
          </article>
        ))}
      </div>
    </section>
  );
}
