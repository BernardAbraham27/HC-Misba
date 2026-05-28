import { useEffect, useState } from "react";
import AccessDeniedPage from "./components/AccessDeniedPage";
import AuthToast from "./components/AuthToast";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import CustomerLoginPage from "./components/CustomerLoginPage";
import CustomerRegisterPage from "./components/CustomerRegisterPage";
import CustomerSite from "./components/CustomerSite";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import MyOrdersPage from "./components/MyOrdersPage";
import OffersPage from "./components/OffersPage";
import OrderDetailsPage from "./components/OrderDetailsPage";
import OrderSuccessPage from "./components/OrderSuccessPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import ProductsPage from "./components/ProductsPage";
import TrackOrderPage from "./components/TrackOrderPage";
import AdminApp from "./components/admin/AdminApp";
import { useAuth } from "./context/AuthContext";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ProfilePage from "./pages/customer/ProfilePage";
import WishlistPage from "./pages/customer/WishlistPage";

const customerProtectedRoutes = new Set([
  "/customer/dashboard",
  "/my-orders",
  "/profile",
  "/account",
  "/wishlist",
]);

function scrollToHash(hash) {
  const id = hash.replace(/^#/, "");
  if (!id) return false;

  const target = document.getElementById(id);
  if (!target) return false;

  const headerOffset = 126;
  const top = Math.max(target.getBoundingClientRect().top + window.scrollY - headerOffset, 0);
  window.scrollTo({ top, behavior: "smooth" });
  return true;
}

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [pendingHash, setPendingHash] = useState(window.location.hash);
  const [toast, setToast] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
      setPendingHash(window.location.hash);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!pendingHash) return undefined;

    let timerId = 0;
    let attempts = 0;

    const attemptScroll = () => {
      if (scrollToHash(pendingHash)) {
        setPendingHash("");
        return;
      }

      attempts += 1;
      if (attempts < 12) {
        timerId = window.setTimeout(attemptScroll, 80);
      } else {
        setPendingHash("");
      }
    };

    attemptScroll();
    return () => window.clearTimeout(timerId);
  }, [pathname, pendingHash]);

  useEffect(() => {
    if (!pathname.startsWith("/admin")) return;
    if (pathname !== "/admin/login" && !auth.isAuthenticated) {
      window.history.replaceState({}, "", "/admin/login");
      setPathname("/admin/login");
      setPendingHash("");
      setToast({ type: "error", message: "Please login to access this page." });
    }
  }, [auth.isAuthenticated, pathname]);

  const navigate = (to, options = {}) => {
    const { replace = false } = options;
    if (!to) return;

    const currentPath = window.location.pathname;
    let nextPath = currentPath;
    let nextHash = "";

    if (to.startsWith("#")) {
      nextHash = to;
    } else {
      const hashIndex = to.indexOf("#");
      if (hashIndex >= 0) {
        nextPath = to.slice(0, hashIndex) || currentPath;
        nextHash = to.slice(hashIndex);
      } else {
        nextPath = to;
      }
    }

    const nextUrl = `${nextPath}${nextHash}`;
    if (window.location.pathname !== nextPath || window.location.hash !== nextHash) {
      if (replace) {
        window.history.replaceState({}, "", nextUrl);
      } else {
        window.history.pushState({}, "", nextUrl);
      }
    }

    setPathname(nextPath);
    setPendingHash(nextHash);

    if (!nextHash) {
      window.scrollTo({ top: 0, behavior: nextPath === currentPath ? "smooth" : "auto" });
    }
  };

  const redirectAdminToDashboard = () => {
    window.history.replaceState({}, "", "/admin/dashboard");
    setPathname("/admin/dashboard");
    setPendingHash("");
    setToast({ type: "error", message: "Admin accounts use the admin dashboard." });
    return <AuthToast toast={toast} />;
  };

  const productDetailMatch = pathname.match(/^\/products\/([^/]+)$/);
  const orderDetailsMatch = pathname.match(/^\/orders\/(\d+)$/);
  const orderSuccessMatch = pathname.match(/^\/order-success\/([^/]+)$/);

  if (pathname === "/login") {
    return (
      <>
        <CustomerLoginPage onNavigate={navigate} setToast={setToast} />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (pathname === "/register") {
    return (
      <>
        <CustomerRegisterPage onNavigate={navigate} setToast={setToast} />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (pathname === "/forgot-password") {
    return (
      <>
        <ForgotPasswordPage onNavigate={navigate} setToast={setToast} />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (pathname === "/products") {
    return (
      <>
        <ProductsPage onNavigate={navigate} setToast={setToast} />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (pathname === "/offers") {
    return (
      <>
        <OffersPage onNavigate={navigate} />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (productDetailMatch) {
    return (
      <>
        <ProductDetailsPage
          slug={decodeURIComponent(productDetailMatch[1])}
          onNavigate={navigate}
          setToast={setToast}
        />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (pathname === "/cart") {
    return (
      <>
        <CartPage onNavigate={navigate} setToast={setToast} />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (pathname === "/checkout") {
    return (
      <>
        <CheckoutPage onNavigate={navigate} setToast={setToast} />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (pathname === "/track-order") {
    return (
      <>
        <TrackOrderPage onNavigate={navigate} setToast={setToast} />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (orderSuccessMatch) {
    return (
      <>
        <OrderSuccessPage
          orderNumber={decodeURIComponent(orderSuccessMatch[1])}
          onNavigate={navigate}
        />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login" && auth.isAuthenticated && !auth.isAdmin) {
      return (
        <>
          <AccessDeniedPage
            onNavigateHome={() => navigate("/", { replace: true })}
            onNavigateLogin={() => navigate("/login", { replace: true })}
          />
          <AuthToast toast={toast} />
        </>
      );
    }

    return (
      <>
        <AdminApp pathname={pathname} onNavigate={navigate} setToast={setToast} />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (customerProtectedRoutes.has(pathname)) {
    if (!auth.isAuthenticated) {
      window.history.replaceState({}, "", "/login");
      setPathname("/login");
      setPendingHash("");
      setToast({ type: "error", message: "Please login to access this page." });
      return <AuthToast toast={toast} />;
    }

    if (auth.isAdmin) {
      return redirectAdminToDashboard();
    }

    if (pathname === "/customer/dashboard") {
      return (
        <>
          <CustomerDashboard onNavigate={navigate} setToast={setToast} />
          <AuthToast toast={toast} />
        </>
      );
    }

    if (pathname === "/my-orders") {
      return (
        <>
          <MyOrdersPage onNavigate={navigate} setToast={setToast} />
          <AuthToast toast={toast} />
        </>
      );
    }

    if (pathname === "/profile" || pathname === "/account") {
      return (
        <>
          <ProfilePage onNavigate={navigate} setToast={setToast} />
          <AuthToast toast={toast} />
        </>
      );
    }

    return (
      <>
        <WishlistPage onNavigate={navigate} />
        <AuthToast toast={toast} />
      </>
    );
  }

  if (orderDetailsMatch) {
    if (!auth.isAuthenticated) {
      window.history.replaceState({}, "", "/login");
      setPathname("/login");
      setPendingHash("");
      setToast({ type: "error", message: "Please login to access this page." });
      return <AuthToast toast={toast} />;
    }

    if (auth.isAdmin) {
      return redirectAdminToDashboard();
    }

    return (
      <>
        <OrderDetailsPage
          id={orderDetailsMatch[1]}
          onNavigate={navigate}
          setToast={setToast}
        />
        <AuthToast toast={toast} />
      </>
    );
  }

  return (
    <>
      <CustomerSite onNavigate={navigate} setToast={setToast} />
      <AuthToast toast={toast} />
    </>
  );
}
