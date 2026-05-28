import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { featuredProducts, ownBrandProducts, thirdPartyProducts } from "../../data/products";
import colors from "../../theme/colors";

function OfferRow({ product, index, navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        delay: index * 70,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        delay: index * 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable
        style={styles.rowCard}
        onPress={() => navigation.navigate("ProductDetails", { productId: product.id })}
      >
        <View style={styles.rowImageWrap}>
          <Image source={product.image} style={styles.rowImage} resizeMode="contain" />
        </View>
        <View style={styles.rowContent}>
          <Text style={styles.rowName}>{product.name}</Text>
          <Text style={styles.rowMeta}>
            {product.size} • {product.brandType}
          </Text>
          <Text style={styles.rowPrice}>Rs {product.price}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function OffersScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>Today’s best picks</Text>
            <Text style={styles.headerTitle}>Offers</Text>
          </View>
          <Pressable style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="bag-handle-outline" size={20} color={colors.primaryDeep} />
          </Pressable>
        </View>

        <View style={styles.offerCard}>
          <Text style={styles.offerLabel}>Own Brand Spotlight</Text>
          <Text style={styles.offerTitle}>Buy 2 MISPA favourites and save more</Text>
          <Text style={styles.offerCopy}>
            Premium fabric and home-care essentials with a polished blue-and-white finish.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Own Brand Highlights</Text>
        {ownBrandProducts.slice(0, 4).map((product, index) => (
          <OfferRow key={product.id} product={product} index={index} navigation={navigation} />
        ))}

        <Text style={styles.sectionTitle}>Partner Brand Picks</Text>
        {thirdPartyProducts.map((product, index) => (
          <OfferRow
            key={product.id}
            product={product}
            index={index + ownBrandProducts.length}
            navigation={navigation}
          />
        ))}

        <Text style={styles.sectionTitle}>Quick Cart Entry</Text>
        <Pressable style={styles.ctaButton} onPress={() => navigation.navigate("Cart")}>
          <Text style={styles.ctaText}>Open Cart & Checkout</Text>
        </Pressable>
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
    paddingHorizontal: 18,
  },
  content: {
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
  offerCard: {
    marginTop: 20,
    borderRadius: 28,
    backgroundColor: colors.primaryDeep,
    padding: 22,
  },
  offerLabel: {
    color: "#c9e0ff",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  offerTitle: {
    marginTop: 10,
    color: colors.white,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
  },
  offerCopy: {
    marginTop: 10,
    color: "#e6f1ff",
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  rowCard: {
    flexDirection: "row",
    borderRadius: 24,
    padding: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  rowImageWrap: {
    width: 94,
    height: 94,
    borderRadius: 18,
    backgroundColor: colors.sky,
    alignItems: "center",
    justifyContent: "center",
  },
  rowImage: {
    width: 74,
    height: 74,
  },
  rowContent: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: "center",
  },
  rowName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
  },
  rowMeta: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  rowPrice: {
    marginTop: 8,
    color: colors.primaryDeep,
    fontSize: 16,
    fontWeight: "900",
  },
  ctaButton: {
    marginTop: 4,
    marginBottom: 0,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingVertical: 16,
  },
  ctaText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
});
