import { useState } from "react";

export default function FAQ({ faqs }) {
  const [openQuestion, setOpenQuestion] = useState(faqs[0]?.question || "");

  return (
    <section className="section-shell py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="section-kicker">FAQ</span>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-copy">
          Quick answers about ordering, daily use, bulk supply, and order
          tracking.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl space-y-4">
        {faqs.map((faq) => {
          const isOpen = openQuestion === faq.question;

          return (
            <article
              key={faq.question}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenQuestion(isOpen ? "" : faq.question)}
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
              >
                <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-medium text-slate-500">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen ? (
                <p className="mt-4 text-sm leading-7 text-slate-600">{faq.answer}</p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
