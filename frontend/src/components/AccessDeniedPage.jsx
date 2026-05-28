export default function AccessDeniedPage({ onNavigateHome, onNavigateLogin }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-cyan-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-2xl">
        <span className="section-kicker border-rose-100 text-rose-700">Access Denied</span>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">You do not have access to this page.</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          This route is restricted based on account type. Please sign in with the
          correct account or go back to the customer storefront.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Go to Login
          </button>
          <button
            type="button"
            onClick={onNavigateHome}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
