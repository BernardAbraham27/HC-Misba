import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthTabs from "./AuthTabs";
import AuthShell from "./AuthShell";

export default function CustomerLoginPage({ onNavigate, setToast }) {
  const { isAuthenticated, isAdmin, loading, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Customer Login | God Grace Home Products";
    if (isAuthenticated) {
      onNavigate(isAdmin ? "/admin/dashboard" : "/customer/dashboard", { replace: true });
    }
  }, [isAdmin, isAuthenticated, onNavigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const auth = await login(form);
      setToast({ type: "success", message: "Login successful." });
      onNavigate(auth.role === "Admin" ? "/admin/dashboard" : "/customer/dashboard", {
        replace: true,
      });
    } catch (requestError) {
      setError(requestError.message || "Login failed.");
      setToast({ type: "error", message: requestError.message || "Login failed." });
    }
  };

  return (
    <AuthShell
      eyebrow="Customer Login"
      title="Sign in to continue shopping"
      subtitle="Access your cart, wishlist, checkout, profile, and order history."
      tabs={<AuthTabs active="customer-login" onNavigate={onNavigate} />}
      helper={
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate("/register")}
            className="font-semibold text-emerald-700 transition hover:text-emerald-600"
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/admin/login")}
            className="font-semibold text-slate-700 transition hover:text-emerald-700"
          >
            Admin Login
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/forgot-password")}
            className="font-semibold text-[#155BD5] transition hover:text-[#124eb9]"
          >
            Forgot Password
          </button>
        </div>
      }
      onBackHome={() => onNavigate("/", { replace: true })}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email or Mobile Number</span>
          <input
            type="text"
            className="customer-input"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Enter your email or mobile number"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            className="customer-input"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Enter your password"
            required
          />
        </label>
        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/register")}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            Create Account
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
