import { useEffect, useMemo, useState } from "react";
import {
  BagIcon,
  ClipboardIcon,
  GridIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
} from "../components/IconSet";
import MobileBottomNav, { customerMobileNavItems } from "../components/MobileBottomNav";
import { getCartCount, onCartUpdated } from "../services/cartService";
import { useAuth } from "../context/AuthContext";

const quickLinks = [
  { label: "Dashboard", href: "/customer/dashboard", icon: HomeIcon },
  { label: "Products", href: "/products", icon: GridIcon },
  { label: "Cart", href: "/cart", icon: BagIcon },
  { label: "My Orders", href: "/my-orders", icon: ClipboardIcon },
  { label: "Track Order", href: "/track-order", icon: ClipboardIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
];

export default function CustomerLayout({ children, title, onNavigate, rightAction }) {
  const { logout, user } = useAuth();
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [search, setSearch] = useState("");
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    setCartCount(getCartCount());
    return onCartUpdated(setCartCount);
  }, []);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const initials = useMemo(
    () =>
      (user?.fullName || "Customer")
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
    [user],
  );

  const handleLogout = () => {
    logout();
    onNavigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-900">
      <div className="flex">
        <aside className="sticky top-0 hidden min-h-screen w-64 shrink-0 border-r border-slate-200/80 bg-white/88 backdrop-blur-xl lg:block">
          <div className="flex min-h-screen flex-col p-5">
            <button
              type="button"
              onClick={() => onNavigate("/customer/dashboard")}
              className="flex items-center gap-3 text-left"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 text-sm font-bold text-white shadow-soft">
                GG
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold uppercase tracking-[0.22em] text-slate-900">
                  God Grace
                </span>
                <span className="block truncate text-xs text-slate-500">Home Products</span>
              </span>
            </button>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Customer Panel
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">{title || "Dashboard"}</h2>

              <div className="mt-5 grid gap-2">
                {quickLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => onNavigate(item.href)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        isActive
                          ? "bg-slate-950 text-white shadow-sm"
                          : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-emerald-50 to-cyan-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                  {initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                  <p className="text-xs text-slate-500">Customer account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">
          <div className="w-full">
            <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/92 p-4 shadow-sm backdrop-blur-xl sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Customer Dashboard
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                  {title || "Dashboard"}
                </h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500 sm:min-w-[260px]">
                  <SearchIcon className="h-4 w-4" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && search.trim()) {
                        onNavigate("/products");
                      }
                    }}
                    placeholder="Search products"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => onNavigate("/cart")}
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <BagIcon className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1 text-[11px] font-semibold text-white">
                    {cartCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate("/profile")}
                  className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 sm:flex"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                    {initials}
                  </span>
                  <span className="text-left">
                    <span className="block text-sm font-semibold text-slate-900">{user?.fullName}</span>
                    <span className="block text-xs text-slate-500">Customer</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 lg:hidden"
                >
                  Logout
                </button>
              </div>
            </div>

            {rightAction ? <div className="mb-6 flex justify-end">{rightAction}</div> : null}
            {children}
          </div>
        </main>
      </div>

      <MobileBottomNav cartCount={cartCount} onNavigate={onNavigate} items={customerMobileNavItems} />
    </div>
  );
}
