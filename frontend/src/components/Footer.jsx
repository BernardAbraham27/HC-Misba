import { MailIcon, PhoneIcon, SocialIcon, WhatsAppIcon } from "./IconSet";

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

export default function Footer({
  navLinks,
  categories,
  contactDetails,
  socialLinks,
  onNavigate,
}) {
  const handleNavigate = (href) => {
    if (onNavigate) {
      onNavigate(href);
      return;
    }

    window.location.href = href;
  };

  return (
    <footer className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-slate-200">
      <div className="section-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.8fr_0.9fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-sky-300 text-lg font-bold text-slate-950">
                GG
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">
                  God Grace
                </p>
                <p className="text-lg font-semibold text-white">Home Products</p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Trusted home care and cleaning products for everyday hygiene, homes,
              offices, hotels, and institutions.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-emerald-300 hover:text-emerald-200"
                >
                  <SocialIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="mt-5 grid gap-3 text-sm">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNavigate(link.href)}
                  className="text-left text-slate-300 transition hover:text-emerald-200"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Product Categories</h3>
            <div className="mt-5 grid gap-3 text-sm">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleNavigate("/#categories")}
                  className="text-left text-slate-300 transition hover:text-emerald-200"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Contact Details</h3>
            <div className="mt-5 grid gap-4 text-sm">
              <a
                href={`tel:${contactDetails.phone.replace(/\s+/g, "")}`}
                className="flex items-start gap-3 text-slate-300 transition hover:text-emerald-200"
              >
                <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{contactDetails.phone}</span>
              </a>
              <a
                href={`mailto:${contactDetails.email}`}
                className="flex items-start gap-3 text-slate-300 transition hover:text-emerald-200"
              >
                <MailIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{contactDetails.email}</span>
              </a>
              <div className="flex items-start gap-3 text-slate-300">
                <AddressIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{contactDetails.address}</span>
              </div>
              <a
                href={contactDetails.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 text-slate-300 transition hover:text-emerald-200"
              >
                <WhatsAppIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-400">
          Copyright © 2026 God Grace Home Products. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
