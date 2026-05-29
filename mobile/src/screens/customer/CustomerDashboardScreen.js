import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../../components/ProductCard";
import { featuredProducts, ownBrandProducts, partnerBrands, ourBrands } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { getMasterState, subscribeMasters } from "../../store/masterStore";
import colors from "../../theme/colors";

const homeBanner = require("../../../assets/images/banners/home-banner.png");

function BrandRow({ title, data }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandRow}
      >
        {data.map((brand) => (
          <View key={brand.id} style={styles.brandCard}>
            <Image
              source={
                brand.logo
                  ? brand.logo
                  : { uri: brand.logoUrl || brand.logoPath || brand.imageUrl }
              }
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>{brand.name}</Text>
            <Text style={styles.brandType}>{brand.brandTypeName || brand.type}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function CustomerDashboardScreen({ navigation }) {
  const { addToCart } = useCart();
  const [masterState, setMasterState] = useState(() => getMasterState());
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const bannerShift = useRef(new Animated.Value(16)).current;

  useEffect(() => subscribeMasters(setMasterState), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bannerOpacity, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.timing(bannerShift, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bannerOpacity, bannerShift]);

  const mobileBrands = useMemo(() => {
    const normalized = (masterState.brands || []).map((brand) => ({
      ...brand,
      imageUrl: brand.logoUrl || brand.logoPath || "",
      brandTypeName: brand.brandTypeName || "",
      isOwnBrand: (brand.brandTypeName || "").toLowerCase() === "own brand",
    }));

    return {
      our: normalized.filter((brand) => brand.isOwnBrand),
      partner: normalized.filter((brand) => !brand.isOwnBrand),
    };
  }, [masterState.brands]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>Household cleaning store</Text>
            <Text style={styles.headerTitle}>GOD GRACE Home Products</Text>
          </View>
          <Pressable style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="bag-handle-outline" size={20} color={colors.primaryDeep} />
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            editable={false}
            placeholder="Search for products..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        <Animated.View
          style={[
            styles.heroBanner,
            { opacity: bannerOpacity, transform: [{ translateY: bannerShift }] },
          ]}
        >
          <ImageBackground source={homeBanner} resizeMode="cover" style={styles.heroBackground}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle}>Premium Cleaning Products</Text>
              <Text style={styles.heroSubtitle}>Home and business essentials in one catalog.</Text>
              <Pressable style={styles.heroButton} onPress={() => navigation.navigate("Categories")}>
                <Text style={styles.heroButtonText}>Shop Now</Text>
              </Pressable>
            </View>
            <View style={styles.heroRight}>
              {ownBrandProducts.slice(0, 3).map((product, index) => (
                <Animated.Image
                  key={product.id}
                  source={product.image}
                  resizeMode="contain"
                  style={[
                    styles.heroProductImage,
                    index === 1 && styles.heroProductImageCenter,
                    index === 2 && styles.heroProductImageBottom,
                  ]}
                />
              ))}
            </View>
          </ImageBackground>
        </Animated.View>

        <BrandRow title="Our Brands" data={mobileBrands.our.length ? mobileBrands.our : ourBrands} />
        <BrandRow title="Partner Brands" data={mobileBrands.partner.length ? mobileBrands.partner : partnerBrands} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <Pressable onPress={() => navigation.navigate("Categories")}>
              <Text style={styles.linkText}>See all</Text>
            </Pressable>
          </View>

          <View style={styles.productGrid}>
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                index={index}
                product={product}
                onPress={() => navigation.navigate("ProductDetails", { productId: product.id })}
                onAdd={() => addToCart(product)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },
  header: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerEyebrow: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  headerTitle: {
    marginTop: 4,
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchBox: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  heroBanner: {
    marginTop: 18,
    borderRadius: 28,
    overflow: "hidden",
    minHeight: 220,
    backgroundColor: colors.primary,
  },
  heroBackground: {
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 12,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "900",
  },
  heroSubtitle: {
    marginTop: 8,
    color: "#EAF2FF",
    fontSize: 15,
    fontWeight: "600",
  },
  heroButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  heroButtonText: {
    color: colors.primaryDeep,
    fontSize: 13,
    fontWeight: "800",
  },
  heroRight: {
    width: 128,
    height: 170,
    justifyContent: "center",
    alignItems: "center",
  },
  heroProductImage: {
    position: "absolute",
    width: 74,
    height: 120,
    right: 12,
    top: 6,
  },
  heroProductImageCenter: {
    width: 84,
    height: 132,
    right: 42,
    top: 24,
  },
  heroProductImageBottom: {
    width: 74,
    height: 118,
    right: 0,
    top: 48,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  linkText: {
    color: colors.primaryDeep,
    fontSize: 13,
    fontWeight: "700",
  },
  brandRow: {
    gap: 12,
    paddingTop: 14,
  },
  brandCard: {
    width: 146,
    borderRadius: 20,
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brandLogo: {
    width: "100%",
    height: 50,
  },
  brandName: {
    marginTop: 10,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  brandType: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  productGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
});
