import { useState } from "react";
import { CartIcon, CloseIcon, MenuIcon, SearchIcon } from "./IconSet";
import TopTickerBar from "./TopTickerBar";

export default function Header({
  navLinks,
  cartCount,
  searchTerm,
  onSearchChange,
  authState,
  onNavigateLink,
  onCartClick,
  onLoginClick,
  onDashboardClick,
  onMyOrdersClick,
  onAdminDashboardClick,
  onLogoutClick,
  announcementItems = [],
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showGuestActions = !authState?.isAuthenticated;
  const showAdminActions = authState?.isAuthenticated && authState?.isAdmin;
  const showCustomerActions = authState?.isAuthenticated && !authState?.isAdmin;
  const showSearch = !showAdminActions;
  const showCart = !showAdminActions;
  const displayName =
    authState?.user?.fullName?.split(" ")[0] ||
    authState?.user?.email?.split("@")[0] ||
    "Customer";

  const handleNavigate = (href) => {
    setMobileMenuOpen(false);
    onNavigateLink?.(href);
  };

  const desktopAuthActions = showGuestActions ? (
    <button
      type="button"
      onClick={onLoginClick}
      className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
    >
      Login
    </button>
  ) : showAdminActions ? (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={onAdminDashboardClick}
        className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
      >
        Admin Dashboard
      </button>
      <button
        type="button"
        onClick={onLogoutClick}
        className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2.5">
      <span className="hidden rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 xl:inline-flex">
        Hi, {displayName}
      </span>
      <button
        type="button"
        onClick={onDashboardClick}
        className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
      >
        Customer Dashboard
      </button>
      <button
        type="button"
        onClick={onMyOrdersClick}
        className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
      >
        My Orders
      </button>
      <button
        type="button"
        onClick={onLogoutClick}
        className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Logout
      </button>
    </div>
  );

  const mobileAuthActions = showGuestActions ? (
    <button
      type="button"
      onClick={() => {
        setMobileMenuOpen(false);
        onLoginClick?.();
      }}
      className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
    >
      Login
    </button>
  ) : showAdminActions ? (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={() => {
          setMobileMenuOpen(false);
          onAdminDashboardClick?.();
        }}
        className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
      >
        Admin Dashboard
      </button>
      <button
        type="button"
        onClick={() => {
          setMobileMenuOpen(false);
          onLogoutClick?.();
        }}
        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="grid gap-3">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        Signed in as {displayName}
      </div>
      <button
        type="button"
        onClick={() => {
          setMobileMenuOpen(false);
          onDashboardClick?.();
        }}
        className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
      >
        Customer Dashboard
      </button>
      <button
        type="button"
        onClick={() => {
          setMobileMenuOpen(false);
          onMyOrdersClick?.();
        }}
        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
      >
        My Orders
      </button>
      <button
        type="button"
        onClick={() => {
          setMobileMenuOpen(false);
          onLogoutClick?.();
        }}
        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
      >
        Logout
      </button>
    </div>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <TopTickerBar items={announcementItems} />

      <div className="border-b border-white/60 bg-white/92 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.65)] backdrop-blur-xl">
        <div className="section-shell flex h-[78px] items-center">
          <div className="flex w-full items-center gap-3 lg:gap-5">
            <button
              type="button"
              onClick={() => handleNavigate("/")}
              className="flex shrink-0 items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-sm font-bold text-white shadow-lg shadow-emerald-200/70">
                GG
              </div>
              <div className="text-left leading-tight">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-950">
                  God Grace
                </p>
                <p className="text-xs font-medium text-slate-500">Home Products</p>
              </div>
            </button>

            <nav aria-label="Primary navigation" className="ml-3 hidden items-center gap-5 lg:flex">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNavigate(link.href)}
                  className="text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="ml-auto hidden items-center gap-2.5 md:flex">
              {showSearch ? (
                <label
                  aria-label="Search products"
                  className="hidden items-center gap-3 rounded-full border border-emerald-100 bg-slate-50 px-4 py-2.5 text-slate-500 shadow-sm transition focus-within:border-emerald-300 focus-within:bg-white lg:flex lg:w-52 xl:w-60"
                >
                  <SearchIcon className="h-4 w-4" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search products"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </label>
              ) : null}

              {showCart ? (
                <button
                  type="button"
                  aria-label="Open cart"
                  onClick={onCartClick}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <CartIcon />
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1 text-[11px] font-semibold text-white">
                    {cartCount}
                  </span>
                </button>
              ) : null}

              {desktopAuthActions}
            </div>

            <div className="ml-auto flex items-center gap-2 md:hidden">
              {showCart ? (
                <button
                  type="button"
                  aria-label="Open cart"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onCartClick?.();
                  }}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
                >
                  <CartIcon />
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1 text-[11px] font-semibold text-white">
                    {cartCount}
                  </span>
                </button>
              ) : null}
              <button
                type="button"
                aria-label="Toggle mobile menu"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-4 shadow-lg md:hidden">
          <div className="section-shell px-0">
            {showSearch ? (
              <label
                aria-label="Search products"
                className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-slate-50 px-4 py-3 text-slate-500 shadow-sm"
              >
                <SearchIcon className="h-4 w-4" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search products"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>
            ) : null}

            <nav aria-label="Mobile navigation" className="mt-4 grid gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNavigate(link.href)}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="mt-4">{mobileAuthActions}</div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
