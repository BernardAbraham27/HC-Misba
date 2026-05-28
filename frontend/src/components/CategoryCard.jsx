import { CategorySymbol, ChevronRightIcon } from "./IconSet";

const toneStyles = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-700",
    ring: "group-hover:border-emerald-200",
    button: "text-emerald-700",
  },
  sky: {
    icon: "bg-sky-50 text-sky-700",
    ring: "group-hover:border-sky-200",
    button: "text-sky-700",
  },
  mint: {
    icon: "bg-lime-50 text-lime-700",
    ring: "group-hover:border-lime-200",
    button: "text-lime-700",
  },
  blue: {
    icon: "bg-blue-50 text-blue-700",
    ring: "group-hover:border-blue-200",
    button: "text-blue-700",
  },
  teal: {
    icon: "bg-teal-50 text-teal-700",
    ring: "group-hover:border-teal-200",
    button: "text-teal-700",
  },
  lime: {
    icon: "bg-green-50 text-green-700",
    ring: "group-hover:border-green-200",
    button: "text-green-700",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-700",
    ring: "group-hover:border-cyan-200",
    button: "text-cyan-700",
  },
};

export default function CategoryCard({ category }) {
  const theme = toneStyles[category.tone] ?? toneStyles.emerald;

  return (
    <article
      className={`group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft ${theme.ring}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.icon}`}
        >
          <CategorySymbol icon={category.icon} className="h-7 w-7" />
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Category
        </span>
      </div>

      <h3 className="mt-5 text-xl font-semibold text-slate-900">
        {category.name}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {category.description}
      </p>

      <a
        href="#products"
        className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold transition ${theme.button}`}
      >
        View Products
        <ChevronRightIcon className="h-4 w-4" />
      </a>
    </article>
  );
}
