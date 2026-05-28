const baseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function SearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function CartIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" />
      <circle cx="10" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </svg>
  );
}

export function MenuIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function StarIcon({ className = "h-4 w-4", filled = true }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3.8 2.6 5.3 5.8.8-4.2 4 1 5.7-5.2-2.8-5.2 2.8 1-5.7-4.2-4 5.8-.8Z" />
    </svg>
  );
}

export function HeartIcon({ className = "h-5 w-5", filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.5 4.8 13.9A4.7 4.7 0 1 1 11.4 7l.6.8.6-.8a4.7 4.7 0 1 1 6.6 6.8Z" />
    </svg>
  );
}

export function ShieldIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M12 3 5.5 5.7v5.6c0 4.2 2.6 8 6.5 9.7 3.9-1.7 6.5-5.5 6.5-9.7V5.7Z" />
      <path d="m9.5 12 1.7 1.8 3.3-3.8" />
    </svg>
  );
}

export function SparklesIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="m12 3 1.1 3.4L16.5 7l-3.4 1.1L12 11.5l-1.1-3.4L7.5 7l3.4-.6Z" />
      <path d="m18 12 0.8 2.4 2.4.8-2.4.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8Z" />
      <path d="m6 13 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" />
    </svg>
  );
}

export function TruckIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M3 6h11v9H3Z" />
      <path d="M14 9h3l3 3v3h-6Z" />
      <circle cx="8" cy="18" r="1.6" />
      <circle cx="18" cy="18" r="1.6" />
    </svg>
  );
}

export function CubeIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="m12 3 7 4v10l-7 4-7-4V7Z" />
      <path d="m12 3 7 4-7 4-7-4 7-4Z" />
      <path d="M12 11v10" />
    </svg>
  );
}

export function HomeIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="m4 10 8-6 8 6" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function GridIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <rect x="4" y="4" width="6" height="6" rx="1.4" />
      <rect x="14" y="4" width="6" height="6" rx="1.4" />
      <rect x="4" y="14" width="6" height="6" rx="1.4" />
      <rect x="14" y="14" width="6" height="6" rx="1.4" />
    </svg>
  );
}

export function BagIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M6 8h12l-1 11H7Z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function ClipboardIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <rect x="6" y="5" width="12" height="15" rx="2" />
      <path d="M9 5.5h6a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 5.5Z" />
      <path d="M9 11h6" />
      <path d="M9 15h4" />
    </svg>
  );
}

export function UserIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M6.6 4.8h2.8l1.4 3.9-1.9 1.6a14 14 0 0 0 4.8 4.8l1.6-1.9 3.9 1.4v2.8a1.6 1.6 0 0 1-1.8 1.6A17.1 17.1 0 0 1 5 6.6a1.6 1.6 0 0 1 1.6-1.8Z" />
    </svg>
  );
}

export function MailIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m5 8 7 5 7-5" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <path d="M20 11.5A8.5 8.5 0 0 1 7.6 19L4 20l1-3.5A8.5 8.5 0 1 1 20 11.5Z" />
      <path d="M9 8.9c.2-.4.4-.4.7-.4h.6c.2 0 .5.1.6.4l.8 1.9c.1.2.1.4 0 .6l-.6 1a6.5 6.5 0 0 0 2.8 2.8l1-.6c.2-.1.4-.1.6 0l1.9.8c.3.1.4.4.4.6v.6c0 .3 0 .5-.4.7-.5.3-1.1.5-1.7.4a8.3 8.3 0 0 1-5.4-5.4c-.1-.6.1-1.2.4-1.7Z" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.5 20v-6H16l.4-3h-2.9V9.1c0-.9.2-1.6 1.5-1.6h1.6V4.8c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.3-3.8 4V11H8v3h2.6v6Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M5.7 8.6h2.9V18H5.7Zm1.5-4.2a1.7 1.7 0 1 1 0 3.3 1.7 1.7 0 0 1 0-3.3ZM10.4 8.6h2.8v1.3h.1c.4-.7 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V18H17v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V18h-3Z" />
    </svg>
  );
}

export function CategorySymbol({ icon, className = "h-6 w-6" }) {
  const shapes = {
    bathroom: (
      <>
        <rect x="5" y="4.5" width="14" height="10" rx="2" />
        <path d="M8 17.5h8" />
        <path d="M10 14.5v3" />
        <path d="M14 14.5v3" />
      </>
    ),
    floor: (
      <>
        <path d="M5 18h14" />
        <path d="m7 15 4-9 4 9" />
        <path d="m9.5 10.5 5 0" />
      </>
    ),
    kitchen: (
      <>
        <rect x="4.5" y="6" width="15" height="11" rx="2" />
        <path d="M9 6V4.5" />
        <path d="M15 6V4.5" />
        <path d="M9 11h6" />
      </>
    ),
    dishwash: (
      <>
        <circle cx="12" cy="12" r="5.5" />
        <path d="M12 6.5v11" />
        <path d="M6.5 12h11" />
      </>
    ),
    laundry: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="3" />
        <circle cx="12" cy="12" r="3.5" />
      </>
    ),
    handwash: (
      <>
        <path d="M12 4.5c2.6 3 4 5.2 4 7.2a4 4 0 1 1-8 0c0-2 1.4-4.2 4-7.2Z" />
        <path d="M15.5 17.5c-.8 1-2.1 1.5-3.5 1.5" />
      </>
    ),
    glass: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="m8 15 8-8" />
      </>
    ),
    disinfectant: (
      <>
        <path d="M12 4v16" />
        <path d="M6 10h12" />
        <path d="m8.5 6 7 12" />
        <path d="m15.5 6-7 12" />
      </>
    ),
    freshener: (
      <>
        <path d="M12 5c2 3 3.5 4.9 3.5 7a3.5 3.5 0 1 1-7 0C8.5 9.9 10 8 12 5Z" />
        <path d="M17.5 9.5c1 1.3 1.5 2.4 1.5 3.4a2.5 2.5 0 0 1-2.5 2.6" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      {shapes[icon]}
    </svg>
  );
}

export function HighlightSymbol({ icon, className = "h-6 w-6" }) {
  const shapes = {
    quality: (
      <>
        <path d="M12 3 5.5 5.7v5.6c0 4.2 2.6 8 6.5 9.7 3.9-1.7 6.5-5.5 6.5-9.7V5.7Z" />
        <path d="m9.5 12 1.7 1.8 3.3-3.8" />
      </>
    ),
    pricing: (
      <>
        <path d="M12 4v16" />
        <path d="M15.5 7.5a3.8 3.8 0 0 0-3.5-1.5c-2 0-3.5 1-3.5 2.7 0 4 7 1.5 7 5 0 1.6-1.5 2.8-3.5 2.8a4.2 4.2 0 0 1-3.8-1.8" />
      </>
    ),
    fragrance: (
      <>
        <path d="M12 5c2.4 2.9 4 5.2 4 7.4a4 4 0 0 1-8 0c0-2.2 1.6-4.5 4-7.4Z" />
        <path d="M17.5 9.5c1.1 1.2 1.5 2.3 1.5 3.4A2.5 2.5 0 0 1 16.5 15" />
      </>
    ),
    hygiene: (
      <>
        <circle cx="12" cy="12" r="7" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className={className} {...baseProps}>
      {shapes[icon]}
    </svg>
  );
}

export function SocialIcon({ icon, className = "h-5 w-5" }) {
  if (icon === "facebook") {
    return <FacebookIcon className={className} />;
  }

  if (icon === "instagram") {
    return <InstagramIcon className={className} />;
  }

  return <LinkedinIcon className={className} />;
}
