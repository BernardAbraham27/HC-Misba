import { useState } from "react";
import AuthShell from "./AuthShell";

export default function ForgotPasswordPage({ onNavigate, setToast }) {
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setToast({
      type: "success",
      message: "Reset link / OTP flow is ready for backend integration.",
    });
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your email or mobile number to receive a reset link or OTP."
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Email or Mobile Number
          <input
            type="text"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            className="customer-input"
            placeholder="Email or Mobile Number"
          />
        </label>
        <button
          type="submit"
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Send Reset Link / OTP
        </button>
        <button
          type="button"
          onClick={() => onNavigate("/login")}
          className="text-sm font-semibold text-[#155BD5]"
        >
          Back to Login
        </button>
      </form>
    </AuthShell>
  );
}
