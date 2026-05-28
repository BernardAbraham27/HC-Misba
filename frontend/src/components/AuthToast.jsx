export default function AuthToast({ toast }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[80] max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-2xl">
      <p
        className={`text-sm font-medium ${
          toast.type === "error" ? "text-rose-700" : "text-emerald-700"
        }`}
      >
        {toast.message}
      </p>
    </div>
  );
}
