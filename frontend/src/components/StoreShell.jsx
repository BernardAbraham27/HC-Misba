import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import { useAuth } from "../context/AuthContext";
import { shopCategories } from "../data/categories";
import { contactDetails, navLinks, socialLinks } from "../data/products";
import { tickerItems } from "../data/tickerItems";
import { getCartCount, onCartUpdated } from "../services/cartService";

export default function StoreShell({
  children,
  onNavigate,
  searchTerm = "",
  onSearchChange = () => {},
}) {
  const { isAdmin, isAuthenticated, logout, user } = useAuth();
  const [cartCount, setCartCount] = useState(() => getCartCount());

  useEffect(() => {
    setCartCount(getCartCount());
    return onCartUpdated(setCartCount);
  }, []);

  const handleLogout = () => {
    logout();
    onNavigate("/", { replace: true });
  };

  const headerNavLinks = isAdmin
    ? [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
      ]
    : navLinks;

  return (
    <div className="min-h-screen overflow-x-clip bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-900">
      <Header
        navLinks={headerNavLinks}
        cartCount={cartCount}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        authState={{ isAdmin, isAuthenticated, user }}
        announcementItems={tickerItems}
        onNavigateLink={onNavigate}
        onCartClick={() => onNavigate("/cart")}
        onLoginClick={() => onNavigate("/login")}
        onDashboardClick={() => onNavigate("/customer/dashboard")}
        onMyOrdersClick={() => onNavigate("/my-orders")}
        onAdminDashboardClick={() => onNavigate("/admin/dashboard")}
        onLogoutClick={handleLogout}
      />
      <main className="pb-24 pt-[118px] md:pb-0">{children}</main>
      <Footer
        navLinks={navLinks}
        categories={shopCategories.map((category) => category.name)}
        contactDetails={contactDetails}
        socialLinks={socialLinks}
        onNavigate={onNavigate}
      />
      {!isAdmin ? <MobileBottomNav cartCount={cartCount} onNavigate={onNavigate} /> : null}
    </div>
  );
}
