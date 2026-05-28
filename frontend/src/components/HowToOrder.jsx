export default function HowToOrder({ steps }) {
  return (
    <section id="how-to-order" className="section-shell py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="section-kicker">How to Order</span>
        <h2 className="section-title">How to Order</h2>
        <p className="section-copy">
          Shop easily from God Grace Home Products. Browse your required cleaning
          products, add them to your cart, enter your delivery details, and place
          your order. You can also track your order using your order number and
          mobile number.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.id}
            className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-sm font-bold text-white shadow-lg shadow-emerald-200/70">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
