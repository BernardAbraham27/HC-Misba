const toneStyles = {
  emerald: {
    glow: "from-emerald-300/55 via-teal-200/40 to-transparent",
    liquid: "from-emerald-400 via-teal-400 to-cyan-300",
    badge: "bg-emerald-50 text-emerald-700",
  },
  sky: {
    glow: "from-sky-300/55 via-cyan-200/40 to-transparent",
    liquid: "from-sky-400 via-cyan-400 to-blue-300",
    badge: "bg-sky-50 text-sky-700",
  },
  teal: {
    glow: "from-teal-300/55 via-emerald-200/40 to-transparent",
    liquid: "from-teal-400 via-cyan-400 to-emerald-300",
    badge: "bg-teal-50 text-teal-700",
  },
  mint: {
    glow: "from-lime-200/55 via-emerald-200/40 to-transparent",
    liquid: "from-lime-300 via-emerald-300 to-teal-300",
    badge: "bg-lime-50 text-lime-700",
  },
  blue: {
    glow: "from-blue-300/55 via-cyan-200/40 to-transparent",
    liquid: "from-blue-400 via-sky-400 to-cyan-300",
    badge: "bg-blue-50 text-blue-700",
  },
  cyan: {
    glow: "from-cyan-300/55 via-sky-200/40 to-transparent",
    liquid: "from-cyan-400 via-sky-400 to-teal-300",
    badge: "bg-cyan-50 text-cyan-700",
  },
  lime: {
    glow: "from-lime-300/55 via-green-200/40 to-transparent",
    liquid: "from-lime-400 via-emerald-400 to-teal-300",
    badge: "bg-lime-50 text-lime-700",
  },
};

const sizeStyles = {
  large: {
    frame: "h-[20rem] w-[14rem]",
    cap: "h-12 w-16 rounded-b-2xl",
    body: "h-[14.5rem] w-[10.5rem] rounded-[2.5rem]",
    label: "top-20 inset-x-7 rounded-[1.5rem] px-3 py-3 text-sm",
    sparkle: "h-3 w-3",
  },
  small: {
    frame: "h-52 w-40",
    cap: "h-10 w-14 rounded-b-xl",
    body: "h-40 w-28 rounded-[2.1rem]",
    label: "top-14 inset-x-5 rounded-[1.2rem] px-2.5 py-2 text-xs",
    sparkle: "h-2.5 w-2.5",
  },
};

export default function ProductVisual({
  label,
  tag,
  tone = "emerald",
  size = "large",
  className = "",
}) {
  const theme = toneStyles[tone] ?? toneStyles.emerald;
  const scale = sizeStyles[size] ?? sizeStyles.large;

  return (
    <div className={`relative ${scale.frame} ${className}`}>
      <div
        className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${theme.glow} blur-2xl`}
      />
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <div className={`${scale.cap} border border-slate-200/70 bg-white shadow-lg`}>
          <div className="mx-auto mt-1.5 h-2.5 w-8 rounded-full bg-slate-200" />
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 overflow-hidden border border-white/80 bg-gradient-to-b from-white to-slate-50 shadow-soft ${scale.body}`}
      >
        <div
          className={`absolute inset-x-4 bottom-4 top-8 rounded-[1.65rem] bg-gradient-to-b ${theme.liquid}`}
        />
        <div
          className={`absolute bg-white/90 text-center shadow-md backdrop-blur ${scale.label}`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            God Grace
          </p>
          <p className="mt-1 font-semibold text-slate-900">{label}</p>
          {tag ? (
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${theme.badge}`}
            >
              {tag}
            </span>
          ) : null}
        </div>
        <div className="absolute right-4 top-8 flex flex-col gap-2">
          <span className={`${scale.sparkle} rounded-full bg-white/70`} />
          <span className={`${scale.sparkle} rounded-full bg-white/50`} />
        </div>
      </div>
    </div>
  );
}
