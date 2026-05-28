import {
  BagIcon,
  ClipboardIcon,
  GridIcon,
  HomeIcon,
  UserIcon,
} from "./IconSet";

const guestNavItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Products", href: "/products", icon: GridIcon },
  { label: "Cart", href: "/cart", icon: BagIcon },
  { label: "Track", href: "/track-order", icon: ClipboardIcon },
  { label: "Contact", href: "/#contact", icon: ClipboardIcon },
];

export const customerMobileNavItems = [
  { label: "Home", href: "/customer/dashboard", icon: HomeIcon },
  { label: "Products", href: "/products", icon: GridIcon },
  { label: "Cart", href: "/cart", icon: BagIcon },
  { label: "Orders", href: "/my-orders", icon: ClipboardIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
];

export default function MobileBottomNav({ cartCount, onNavigate, items = guestNavItems }) {
  const currentPath = window.location.pathname;

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/94 backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-xl grid-cols-5 px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <button
              type="button"
              key={item.label}
              onClick={() => onNavigate(item.href)}
              className={`relative flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.label === "Cart" ? (
                <span className="absolute right-4 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
