export default function CustomerProtectedPage({
  title,
  description,
  ctaLabel,
  onCta,
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-24">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-xl sm:p-10">
        <span className="section-kicker">Customer Account</span>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">{description}</p>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
          This area is protected and available only after customer login. The route
          is live and ready for deeper feature work on top of your existing backend.
        </div>
        <button
          type="button"
          onClick={onCta}
          className="mt-8 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {ctaLabel}
        </button>
      </div>
    </main>
  );
}
