const steps = [
  { value: 1, label: "Pending" },
  { value: 2, label: "Confirmed" },
  { value: 3, label: "Packed" },
  { value: 4, label: "Shipped" },
  { value: 5, label: "Out For Delivery" },
  { value: 6, label: "Delivered" },
];

export default function OrderStatusTimeline({ status }) {
  if (status === 7) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-700">
        Order Cancelled
      </div>
    );
  }

  if (status === 8) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-medium text-amber-700">
        Order Returned
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-6">
      {steps.map((step) => {
        const complete = status >= step.value;
        return (
          <div
            key={step.value}
            className={`rounded-3xl border px-4 py-4 text-center text-sm font-medium ${
              complete
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            {step.label}
          </div>
        );
      })}
    </div>
  );
}
