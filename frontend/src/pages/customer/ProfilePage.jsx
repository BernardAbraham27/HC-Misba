import { useEffect, useState } from "react";
import CustomerLayout from "../../layouts/CustomerLayout";
import { useAuth } from "../../context/AuthContext";
import { getAddresses } from "../../services/addressService";
import { updateUserProfile } from "../../services/userService";

const initialForm = {
  fullName: "",
  mobileNumber: "",
  email: "",
};

export default function ProfilePage({ onNavigate, setToast }) {
  const { getProfile, user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Profile | God Grace Home Products";
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const profile = await getProfile();
        setForm({
          fullName: profile?.fullName || user?.fullName || "",
          mobileNumber: profile?.mobileNumber || user?.mobileNumber || "",
          email: profile?.email || user?.email || "",
        });
        try {
          const addresses = await getAddresses();
          setDefaultAddress(addresses.find((item) => item.isDefault) || addresses[0] || null);
        } catch {
          setDefaultAddress(null);
        }
      } catch (requestError) {
        setError(requestError.message || "Could not load your profile.");
        setForm({
          fullName: user?.fullName || "",
          mobileNumber: user?.mobileNumber || "",
          email: user?.email || "",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [getProfile, user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      await updateUserProfile(user.id, {
        fullName: form.fullName.trim(),
        mobileNumber: form.mobileNumber.trim(),
      });
      await getProfile();
      setEditing(false);
      setToast({ type: "success", message: "Profile updated successfully." });
    } catch (requestError) {
      const message = requestError.message || "Could not update your profile.";
      setError(message);
      setToast({ type: "error", message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomerLayout title="Profile" onNavigate={onNavigate}>
      {loading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading profile...
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <span className="section-kicker">Account Details</span>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900">My Profile</h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Update your name, mobile number, and review the email linked to your customer account.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Full Name</span>
                <input
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                  disabled={!editing}
                  className="customer-input disabled:bg-slate-50 disabled:text-slate-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</span>
                <input
                  value={form.mobileNumber}
                  onChange={(event) => setForm((current) => ({ ...current, mobileNumber: event.target.value }))}
                  disabled={!editing}
                  className="customer-input disabled:bg-slate-50 disabled:text-slate-500"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <input
                  value={form.email}
                  disabled
                  className="customer-input bg-slate-50 text-slate-500"
                />
              </label>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              {editing ? (
                <>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSave}
                    className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <span className="section-kicker">Default Address</span>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">Saved delivery address</h2>
              {defaultAddress ? (
                <div className="mt-5 text-sm leading-7 text-slate-600">
                  <p className="font-semibold text-slate-900">{defaultAddress.fullName}</p>
                  <p>{defaultAddress.mobileNumber}</p>
                  <p>{defaultAddress.addressLine1}</p>
                  {defaultAddress.addressLine2 ? <p>{defaultAddress.addressLine2}</p> : null}
                  <p>
                    {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                  </p>
                  {defaultAddress.landmark ? <p>Landmark: {defaultAddress.landmark}</p> : null}
                </div>
              ) : (
                <p className="mt-5 text-sm leading-7 text-slate-600">
                  No default address found yet. Add one during checkout and it will be available here.
                </p>
              )}
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <span className="section-kicker">Quick Actions</span>
              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate("/my-orders")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  View My Orders
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/track-order")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Track an Order
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/products")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Browse Products
                </button>
              </div>
            </section>
          </aside>
        </div>
      )}
    </CustomerLayout>
  );
}
