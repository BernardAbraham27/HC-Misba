export default function OfferBanner() {
  return (
    <section id="offers" className="section-shell py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-emerald-900 to-sky-900 px-6 py-8 text-white shadow-soft sm:px-8 lg:px-10 lg:py-10">
        <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
              Bulk Supply
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Bulk Orders Available for Homes, Offices, Hotels & Institutions
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
              Get special pricing on large quantity orders for cleaning and
              hygiene products.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100">
              Custom quantity plans
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100">
              Fast dispatch support
            </span>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-100"
            >
              Request Bulk Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
