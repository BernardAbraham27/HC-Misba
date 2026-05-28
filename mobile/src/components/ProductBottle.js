import React from "react";
import { Image, StyleSheet, View } from "react-native";

const imageMap = {
  "MISPA Fabric Conditioner Blue": require("../../assets/images/products/transparent/mispa-fabric-conditioner-blue.png"),
  "MISPA Fabric Conditioner Pink": require("../../assets/images/products/transparent/mispa-fabric-conditioner-pink.png"),
  "MISPA Detergent Liquid": require("../../assets/images/products/transparent/mispa-detergent-liquid.png"),
  "MISPA Disinfectant Toilet Cleaner 5L": require("../../assets/images/products/transparent/mispa-disinfectant-toilet-cleaner-5l.png"),
  "RAINBOW Rose Sanitizer": require("../../assets/images/products/transparent/rainbow-rose.png"),
  "RAINBOW Jasmine Sanitizer": require("../../assets/images/products/transparent/rainbow-jasmine.png"),
  "RAINBOW Lemon Sanitizer": require("../../assets/images/products/transparent/rainbow-lemon.png"),
  "CLEANBOY Dishwash Liquid": require("../../assets/images/products/transparent/cleanboy-dishwash-liquid.png"),
  "CLEANBOY Washing Liquid 5L": require("../../assets/images/products/transparent/cleanboy-washing-liquid-5l.png"),
};

export default function ProductBottle({ productName = "MISPA Fabric Conditioner Pink", size = "md" }) {
  const image = imageMap[productName];
  const scale = size === "lg" ? styles.large : size === "sm" ? styles.small : styles.medium;

  if (!image) {
    return null;
  }

  return (
    <View style={[styles.wrapper, scale]}>
      <Image source={image} resizeMode="contain" style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  small: {
    width: 84,
    height: 118,
  },
  medium: {
    width: 96,
    height: 140,
  },
  large: {
    width: 120,
    height: 176,
  },
});
