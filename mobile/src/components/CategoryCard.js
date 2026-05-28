import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { getMobileProductAsset } from "../data/assets";
import colors from "../theme/colors";
import spacing from "../theme/spacing";

export default function CategoryCard({ category, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={getMobileProductAsset(category.imageKey)} style={styles.image} resizeMode="contain" />
      <Text style={styles.name}>{category.name}</Text>
      <Text style={styles.description}>{category.description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: spacing.md,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: "100%",
    height: 86,
    borderRadius: 14,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.navy,
  },
  description: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
