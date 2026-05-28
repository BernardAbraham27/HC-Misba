import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./IconSet";
import ProductBottle from "./ProductBottle";

export default function HeroSlider({ slides }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlide];

  return (
    <div className="mx-auto w-full max-w-[35rem]">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-xl lg:p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Featured Product Slider
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Explore top home care products
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
              aria-label="Previous product slide"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={() => setActiveSlide((current) => (current + 1) % slides.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
              aria-label="Next product slide"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <div className="min-h-[300px] rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="max-w-sm">
              <span className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                {currentSlide.badge}
              </span>
              <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-950 sm:text-[1.9rem]">
                {currentSlide.name}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                {currentSlide.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {currentSlide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href="#products"
                className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                View Product
              </a>
            </div>

            <div className="mx-auto flex justify-center sm:justify-end">
              <ProductBottle
                name={currentSlide.name}
                tone={currentSlide.tone}
                badge={currentSlide.badge}
                alt={currentSlide.alt}
                size="hero"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeSlide
                  ? "w-8 bg-emerald-500"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to ${slide.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
