export default function AuthTabs({ active, onNavigate }) {
  const tabs = [
    { key: "customer-login", label: "Customer Login", path: "/login" },
    { key: "customer-register", label: "Customer Register", path: "/register" },
    { key: "admin-login", label: "Admin Login", path: "/admin/login" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1">
      <div className="grid gap-1 sm:grid-cols-3">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onNavigate(tab.path)}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-emerald-700"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
