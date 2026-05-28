import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { focusProductId, getProductById } from "../../data/products";
import { useCart } from "../../context/CartContext";
import colors from "../../theme/colors";

export default function ProductDetailsScreen({ navigation, route }) {
  const { addToCart } = useCart();
  const productId = route?.params?.productId || focusProductId;
  const product = useMemo(() => getProductById(productId) || getProductById(focusProductId), [productId]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || product.size);
  const [quantity, setQuantity] = useState(1);
  const imageScale = useRef(new Animated.Value(0.94)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(imageScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 16,
      bounciness: 8,
    }).start();
  }, [imageScale]);

  function animateButtonIn() {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 28,
      bounciness: 2,
    }).start();
  }

  function animateButtonOut() {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 28,
      bounciness: 4,
    }).start();
  }

  function handleAddToCart() {
    addToCart(product, selectedSize, quantity);
    navigation.navigate("Cart");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="bag-handle-outline" size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.imageCard}>
          <Animated.Image
            source={product.image}
            style={[styles.image, { transform: [{ scale: imageScale }] }]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.brandType}</Text>
          </View>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.rating}>
            {product.rating} ★  ({product.reviews} reviews)
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>Rs {product.price}</Text>
            <Text style={styles.mrp}>Rs {product.mrp}</Text>
          </View>

          <Text style={styles.sectionTitle}>Select Size</Text>
          <View style={styles.sizeRow}>
            {product.sizes.map((size) => {
              const active = selectedSize === size;
              return (
                <Pressable
                  key={size}
                  style={[styles.sizeChip, active && styles.sizeChipActive]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.sizeChipText, active && styles.sizeChipTextActive]}>{size}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Highlights</Text>
          {product.highlights.map((item) => (
            <View key={item} style={styles.highlightRow}>
              <Ionicons name="checkmark-circle" size={18} color={colors.primaryDeep} />
              <Text style={styles.highlightText}>{item}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityWrap}>
            <Pressable
              style={styles.qtyButton}
              onPress={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </Pressable>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Pressable style={styles.qtyButton} onPress={() => setQuantity((value) => value + 1)}>
              <Text style={styles.qtyButtonText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.secondaryButton} onPress={handleAddToCart}>
              <Text style={styles.secondaryButtonText}>Add to Cart</Text>
            </Pressable>
            <Animated.View style={{ flex: 1, transform: [{ scale: buttonScale }] }}>
              <Pressable
                style={styles.primaryButton}
                onPress={handleAddToCart}
                onPressIn={animateButtonIn}
                onPressOut={animateButtonOut}
              >
                <Text style={styles.primaryButtonText}>Buy Now</Text>
              </Pressable>
            </Animated.View>
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
    paddingHorizontal: 18,
  },
  topBar: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  imageCard: {
    marginTop: 16,
    borderRadius: 30,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 350,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: "78%",
    height: 310,
  },
  infoCard: {
    marginTop: 18,
    marginBottom: 28,
    borderRadius: 30,
    backgroundColor: colors.white,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.badgeOwnBg,
  },
  badgeText: {
    color: colors.badgeOwnText,
    fontSize: 12,
    fontWeight: "800",
  },
  name: {
    marginTop: 14,
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
  },
  rating: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  priceRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  price: {
    color: colors.primaryDeep,
    fontSize: 30,
    fontWeight: "900",
  },
  mrp: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: "700",
    textDecorationLine: "line-through",
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  sizeRow: {
    flexDirection: "row",
    gap: 10,
  },
  sizeChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.sky,
  },
  sizeChipActive: {
    backgroundColor: colors.primary,
  },
  sizeChipText: {
    color: colors.primaryDeep,
    fontSize: 13,
    fontWeight: "800",
  },
  sizeChipTextActive: {
    color: colors.white,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  highlightText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  quantityWrap: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: 999,
    backgroundColor: colors.sky,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  qtyButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonText: {
    color: colors.primaryDeep,
    fontSize: 20,
    fontWeight: "800",
  },
  qtyValue: {
    minWidth: 20,
    textAlign: "center",
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  actions: {
    marginTop: 28,
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    paddingVertical: 16,
  },
  secondaryButtonText: {
    color: colors.primaryDeep,
    fontSize: 15,
    fontWeight: "800",
  },
  primaryButton: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
});
