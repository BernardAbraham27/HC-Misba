import { WhatsAppIcon } from "./IconSet";
import ProductBottle from "./ProductBottle";

export default function BulkOrderBanner({ contactDetails, onRequestQuote }) {
  return (
    <section id="bulk-orders" className="section-shell py-14">
      <div className="overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-800 p-8 text-white shadow-xl lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
              Bulk Orders
            </span>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Bulk Orders for Homes, Offices, Hotels &amp; Institutions
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50 sm:text-base">
              Get special pricing for commercial, housekeeping, and institutional
              cleaning supply needs.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onRequestQuote}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-50"
              >
                Request Bulk Quote
              </button>
              <a
                href={contactDetails.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp Enquiry
              </a>
            </div>
          </div>

          <div className="relative hidden min-h-[240px] lg:block">
            <div className="absolute left-10 top-6">
              <ProductBottle
                name="Disinfectant Liquid"
                tone="green"
                badge="Bulk Supply"
                size="card"
              />
            </div>
            <div className="absolute right-8 bottom-0">
              <ProductBottle
                name="Floor Cleaner"
                tone="emerald"
                badge="Institutional Use"
                size="hero"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
