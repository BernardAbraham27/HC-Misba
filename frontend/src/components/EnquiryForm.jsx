import { useEffect, useMemo, useState } from "react";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "./IconSet";

const initialValues = {
  name: "",
  mobile: "",
  email: "",
  product: "",
  quantity: "",
  message: "",
};

function AddressIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20s-6-4.6-6-10a6 6 0 1 1 12 0c0 5.4-6 10-6 10Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

export default function EnquiryForm({ productOptions, contactDetails }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setToast("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const validate = () => {
    const nextErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!/^\d{10,15}$/.test(values.mobile.trim())) {
      nextErrors.mobile = "Please enter a valid mobile number.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!values.product) {
      nextErrors.product = "Please choose a product.";
    }

    if (!values.quantity.trim()) {
      nextErrors.quantity = "Please enter a quantity.";
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setToast("Thanks! Your enquiry has been submitted successfully.");
    setValues(initialValues);
  };

  const whatsappLink = useMemo(() => {
    const message = [
      "Hello God Grace Home Products,",
      values.name ? `Name: ${values.name}` : "",
      values.mobile ? `Mobile: ${values.mobile}` : "",
      values.product ? `Product Interested: ${values.product}` : "",
      values.quantity ? `Quantity: ${values.quantity}` : "",
      values.message ? `Message: ${values.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const baseNumber = (contactDetails.phone || "").replace(/[^\d]/g, "");
    return `https://wa.me/${baseNumber}?text=${encodeURIComponent(message || "Hello God Grace Home Products")}`;
  }, [contactDetails.phone, values]);

  return (
    <section id="contact" className="section-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <span className="section-kicker">Contact / Enquiry</span>
          <h2 className="section-title">Need Help Choosing the Right Product?</h2>
          <p className="section-copy">
            Share your requirement and we will help you find the right cleaning
            product, pack size, or bulk supply option.
          </p>

          <div className="mt-8 grid gap-4">
            <InfoCard
              icon={<PhoneIcon />}
              tone="bg-emerald-50 text-emerald-700"
              title="Phone placeholder"
              text={contactDetails.phone}
            />
            <InfoCard
              icon={<MailIcon />}
              tone="bg-sky-50 text-sky-700"
              title="Email placeholder"
              text={contactDetails.email}
            />
            <InfoCard
              icon={<AddressIcon />}
              tone="bg-teal-50 text-teal-700"
              title="Address placeholder"
              text={contactDetails.address}
            />
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.36)] sm:p-7">
          {toast ? (
            <div
              className="absolute right-4 top-4 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg"
              aria-live="polite"
            >
              {toast}
            </div>
          ) : null}

          <form aria-label="Enquiry form" onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter your name"
              />
              <Field
                label="Mobile Number"
                name="mobile"
                value={values.mobile}
                onChange={handleChange}
                error={errors.mobile}
                placeholder="Enter mobile number"
              />
            </div>

            <Field
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Product Interested"
                name="product"
                value={values.product}
                onChange={handleChange}
                error={errors.product}
                options={productOptions}
              />
              <Field
                label="Quantity"
                name="quantity"
                value={values.quantity}
                onChange={handleChange}
                error={errors.quantity}
                placeholder="Eg. 12 bottles"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Message
              </label>
              <textarea
                name="message"
                value={values.message}
                onChange={handleChange}
                rows="5"
                placeholder="Share your requirement"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Submit Enquiry
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-3.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp Enquiry
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, tone, title, text }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3 text-slate-700">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-rose-300 bg-rose-50 focus:border-rose-400"
            : "border-slate-200 bg-slate-50 focus:border-emerald-300 focus:bg-white"
        }`}
      />
      {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

function SelectField({ label, name, value, onChange, error, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-700 outline-none transition ${
          error
            ? "border-rose-300 bg-rose-50 focus:border-rose-400"
            : "border-slate-200 bg-slate-50 focus:border-emerald-300 focus:bg-white"
        }`}
      >
        <option value="">Select product</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}
