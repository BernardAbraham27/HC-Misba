export const mobileProductAssets = {
  mispaFabricConditionerGroup: require("../../assets/products/mispa-fabric-conditioner-group.jpeg"),
  cleanboyDishwashLiquid: require("../../assets/products/cleanboy-dishwash-liquid.jpeg"),
  mispaFabricConditionerBlue: require("../../assets/products/mispa-fabric-conditioner-blue.jpeg"),
  mispaFabricConditionerPinkGroup: require("../../assets/products/mispa-fabric-conditioner-pink-group.jpeg"),
  mispaFabricConditionerPink: require("../../assets/products/mispa-fabric-conditioner-pink.jpeg"),
  mispaDetergentLiquid: require("../../assets/products/mispa-detergent-liquid.jpeg"),
  mispaToiletCleaner5L: require("../../assets/products/mispa-toilet-cleaner-5ltr.jpeg"),
  mispaFabricConditionerBlueGroup: require("../../assets/products/mispa-fabric-conditioner-blue-group.jpeg"),
  acidBottles: require("../../assets/products/acid-bottles.jpeg"),
  mispaBleachingPowder: require("../../assets/products/mispa-bleaching-powder.jpeg"),
  rainbowSanitizerFluid: require("../../assets/products/rainbow-sanitizer-fluid.jpeg"),
  mispaDetergentLiquidCollage: require("../../assets/products/mispa-detergent-liquid-collage.jpeg"),
  cleanboyWashingLiquid: require("../../assets/products/cleanboy-washing-liquid.jpeg"),
  productGroupBanner: require("../../assets/products/product-group-banner.jpeg"),
  bulkCleaningMaterialPack: require("../../assets/products/bulk-cleaning-material-pack.jpeg"),
};

export function getMobileProductAsset(key) {
  return mobileProductAssets[key] || mobileProductAssets.productGroupBanner;
}
