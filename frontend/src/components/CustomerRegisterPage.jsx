import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthTabs from "./AuthTabs";
import AuthShell from "./AuthShell";

const initialForm = {
  fullName: "",
  mobileNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!/^\d{10,15}$/.test(form.mobileNumber.trim())) {
    errors.mobileNumber = "Enter a valid mobile number.";
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = "Enter a valid email.";
  if (form.password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}

export default function CustomerRegisterPage({ onNavigate, setToast }) {
  const { loading, register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    document.title = "Create Account | God Grace Home Products";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await register({
        fullName: form.fullName.trim(),
        mobileNumber: form.mobileNumber.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setToast({ type: "success", message: "Registration successful. Please log in." });
      onNavigate("/login", { replace: true });
    } catch (requestError) {
      const message = requestError.message || "Registration failed.";
      setSubmitError(message);
      setToast({ type: "error", message });
    }
  };

  const renderError = (key) =>
    errors[key] ? <p className="mt-2 text-xs text-rose-600">{errors[key]}</p> : null;

  return (
    <AuthShell
      eyebrow="Customer Register"
      title="Create your customer account"
      subtitle="Register once to save your profile, track orders, and access customer-only shopping routes."
      tabs={<AuthTabs active="customer-register" onNavigate={onNavigate} />}
      helper={
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate("/login")}
            className="font-semibold text-emerald-700 transition hover:text-emerald-600"
          >
            Already have an account? Login
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/admin/login")}
            className="font-semibold text-slate-700 transition hover:text-emerald-700"
          >
            Admin Login
          </button>
        </div>
      }
      onBackHome={() => onNavigate("/", { replace: true })}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Full Name</span>
          <input
            className="customer-input"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            required
          />
          {renderError("fullName")}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</span>
          <input
            className="customer-input"
            value={form.mobileNumber}
            onChange={(event) => setForm({ ...form, mobileNumber: event.target.value })}
            required
          />
          {renderError("mobileNumber")}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            className="customer-input"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          {renderError("email")}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              className="customer-input"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
            {renderError("password")}
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</span>
            <input
              type="password"
              className="customer-input"
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              required
            />
            {renderError("confirmPassword")}
          </label>
        </div>
        {submitError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
}
