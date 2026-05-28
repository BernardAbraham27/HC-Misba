const imageMap = {
  "MISPA Fabric Conditioner Blue": "/assets/images/products/transparent/mispa-fabric-conditioner-blue.png",
  "MISPA Fabric Conditioner Pink": "/assets/images/products/transparent/mispa-fabric-conditioner-pink.png",
  "MISPA Detergent Liquid": "/assets/images/products/transparent/mispa-detergent-liquid.png",
  "MISPA Disinfectant Toilet Cleaner 5L": "/assets/images/products/transparent/mispa-disinfectant-toilet-cleaner-5l.png",
  "RAINBOW Rose Sanitizer": "/assets/images/products/transparent/rainbow-rose.png",
  "RAINBOW Jasmine Sanitizer": "/assets/images/products/transparent/rainbow-jasmine.png",
  "RAINBOW Lemon Sanitizer": "/assets/images/products/transparent/rainbow-lemon.png",
  "CLEANBOY Dishwash Liquid": "/assets/images/products/transparent/cleanboy-dishwash-liquid.png",
  "CLEANBOY Washing Liquid 5L": "/assets/images/products/transparent/cleanboy-washing-liquid-5l.png",
};

const sizeStyles = {
  hero: "h-[280px] w-[180px] sm:h-[310px] sm:w-[210px]",
  card: "h-[208px] w-[138px]",
};

export default function ProductBottle({ name, badge, alt, size = "hero" }) {
  const imageUrl = imageMap[name];
  const scaleClass = sizeStyles[size] || sizeStyles.hero;

  if (!imageUrl) {
    return null;
  }

  return (
    <div className={`relative ${scaleClass}`}>
      <img
        src={imageUrl}
        alt={alt || `${name} product image`}
        className="h-full w-full object-contain"
      />
      {badge ? (
        <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
          {badge}
        </span>
      ) : null}
    </div>
  );
}
