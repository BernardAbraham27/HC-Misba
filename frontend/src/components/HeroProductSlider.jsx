import { useEffect, useState } from "react";
import ProductBottle from "./ProductBottle";
import { ChevronLeftIcon, ChevronRightIcon } from "./IconSet";

export default function HeroProductSlider({ slides, onNavigate }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full min-w-0">
      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-[0_26px_70px_-34px_rgba(15,23,42,0.48)] backdrop-blur sm:p-6 lg:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Product Slider
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Explore all 12 God Grace home care products
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
              aria-label="Previous product slide"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={() => setActiveSlide((current) => (current + 1) % slides.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
              aria-label="Next product slide"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] bg-[linear-gradient(140deg,#f0fdf7_0%,#ffffff_48%,#eef8ff_100%)]">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <article
                key={slide.id}
                className="grid w-full shrink-0 items-center gap-6 p-5 sm:p-6"
              >
                <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                        {slide.badge}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {String(index + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">
                      {slide.name}
                    </h2>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600 sm:text-base">
                      {slide.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {slide.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate(`/products/${slide.slug}`)}
                      className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      View Product
                    </button>
                  </div>

                  <div className="mx-auto flex justify-center">
                    <ProductBottle
                      name={slide.name}
                      tone={slide.tone}
                      badge={slide.badge}
                      alt={slide.alt}
                      size="hero"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeSlide ? "w-8 bg-emerald-500" : "w-2.5 bg-slate-300"
              }`}
              aria-label={`Go to ${slide.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
