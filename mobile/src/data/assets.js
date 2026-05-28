export const mobileProductAssets = {
  mispaFabricConditionerGroup: require("../../assets/images/products/transparent/mispa-fabric-conditioner-blue.png"),
  cleanboyDishwashLiquid: require("../../assets/images/products/transparent/cleanboy-dishwash-liquid.png"),
  mispaFabricConditionerBlue: require("../../assets/images/products/transparent/mispa-fabric-conditioner-blue.png"),
  mispaFabricConditionerPinkGroup: require("../../assets/images/products/transparent/mispa-fabric-conditioner-pink.png"),
  mispaFabricConditionerPink: require("../../assets/images/products/transparent/mispa-fabric-conditioner-pink.png"),
  mispaDetergentLiquid: require("../../assets/images/products/transparent/mispa-detergent-liquid.png"),
  mispaToiletCleaner5L: require("../../assets/images/products/transparent/mispa-disinfectant-toilet-cleaner-5l.png"),
  mispaFabricConditionerBlueGroup: require("../../assets/images/products/transparent/mispa-fabric-conditioner-blue.png"),
  rainbowSanitizerFluid: require("../../assets/images/products/transparent/rainbow-rose.png"),
  cleanboyWashingLiquid: require("../../assets/images/products/transparent/cleanboy-washing-liquid-5l.png"),
  productGroupBanner: require("../../assets/images/products/transparent/mispa-detergent-liquid.png"),
  acidBottles: require("../../assets/products/acid-bottles.jpeg"),
  mispaBleachingPowder: require("../../assets/products/mispa-bleaching-powder.jpeg"),
  bulkCleaningMaterialPack: require("../../assets/products/bulk-cleaning-material-pack.jpeg"),
};

export function getMobileProductAsset(key) {
  return mobileProductAssets[key] || mobileProductAssets.productGroupBanner;
}
