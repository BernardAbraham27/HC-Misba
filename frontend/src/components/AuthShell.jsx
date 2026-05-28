export default function AuthShell({
  title,
  subtitle,
  eyebrow,
  children,
  tabs,
  helper,
  sideTitle = "Complete Home Care Solutions",
  sideCopy = "Trusted daily cleaning, hygiene, and housekeeping products for homes, offices, hotels, and institutions.",
  onBackHome,
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.16),_transparent_24%),linear-gradient(180deg,_#f0fdf4_0%,_#ffffff_35%,_#ecfeff_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-2xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 text-sm font-bold">
                GG
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em]">God Grace</p>
                <p className="text-xs text-emerald-100/80">Home Products</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onBackHome}
              className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
            >
              Back Home
            </button>
          </div>

          <h1 className="mt-10 text-4xl font-semibold sm:text-5xl">{sideTitle}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">{sideCopy}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Trusted toilet, floor, bathroom, and kitchen cleaners",
              "Daily hygiene products with fresh fragrance",
              "Bulk-ready product range for institutions",
              "Customer and admin access kept separate",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-2xl sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{subtitle}</p>
          {tabs ? <div className="mt-6">{tabs}</div> : null}
          <div className="mt-8">{children}</div>
          {helper ? <div className="mt-5 text-sm text-slate-500">{helper}</div> : null}
        </section>
      </div>
    </div>
  );
}
