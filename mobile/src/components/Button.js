import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import colors from "../theme/colors";
import spacing from "../theme/spacing";

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary || isGhost ? colors.emerald : colors.white} />
      ) : (
        <Text
          style={[
            styles.label,
            isSecondary && styles.secondaryLabel,
            isGhost && styles.ghostLabel,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: colors.emerald,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.emerald,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryLabel: {
    color: colors.emerald,
  },
  ghostLabel: {
    color: colors.navy,
  },
});
