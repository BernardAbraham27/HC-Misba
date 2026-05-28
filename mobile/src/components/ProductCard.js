import React, { useEffect, useRef } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";

function BrandBadge({ type }) {
  const isOwn = type === "Own Brand";
  return (
    <View style={[styles.badge, isOwn ? styles.badgeOwn : styles.badgePartner]}>
      <Text style={[styles.badgeText, isOwn ? styles.badgeOwnText : styles.badgePartnerText]}>
        {type}
      </Text>
    </View>
  );
}

export default function ProductCard({ product, index = 0, onPress, onAdd }) {
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(18)).current;
  const addScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 280,
        delay: index * 70,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 320,
        delay: index * 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, index, translate]);

  function pressIn() {
    Animated.spring(addScale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  }

  function pressOut() {
    Animated.spring(addScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  }

  return (
    <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: translate }] }]}>
      <Pressable style={styles.mainPressable} onPress={onPress}>
        <View style={styles.imageWrap}>
          <Image source={product.image} style={styles.image} resizeMode="contain" />
        </View>
        <BrandBadge type={product.brandType} />
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.size}>{product.size}</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.price}>Rs {product.price}</Text>
        <Animated.View style={{ transform: [{ scale: addScale }] }}>
          <Pressable
            onPress={onAdd}
            onPressIn={pressIn}
            onPressOut={pressOut}
            style={styles.addButton}
          >
            <Ionicons name="add" size={16} color={colors.white} />
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48.2%",
    minHeight: 240,
    maxHeight: 252,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  mainPressable: {
    flex: 1,
  },
  imageWrap: {
    height: 118,
    borderRadius: 16,
    backgroundColor: colors.sky,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  image: {
    width: "86%",
    height: "86%",
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 9,
  },
  badgeOwn: {
    backgroundColor: colors.badgeOwnBg,
  },
  badgePartner: {
    backgroundColor: colors.badgePartnerBg,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  badgeOwnText: {
    color: colors.badgeOwnText,
  },
  badgePartnerText: {
    color: colors.badgePartnerText,
  },
  name: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
    minHeight: 36,
  },
  size: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
