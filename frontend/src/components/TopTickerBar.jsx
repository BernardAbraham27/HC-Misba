export default function TopTickerBar({ items = [] }) {
  const repeatedItems = [...items, ...items];

  return (
    <div className="group h-10 overflow-hidden bg-gradient-to-r from-emerald-700 via-teal-600 to-sky-600 text-white">
      <div className="flex h-full items-center">
        <div className="animate-marquee flex min-w-max items-center group-hover:[animation-play-state:paused]">
          {repeatedItems.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex h-10 items-center gap-4 px-5 text-sm font-semibold tracking-[0.08em]"
            >
              <span className="flex h-full items-center leading-none">{item}</span>
              <span className="flex h-full items-center text-white/70 leading-none">&bull;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
