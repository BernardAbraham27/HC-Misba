import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../theme/colors";
import spacing from "../theme/spacing";

export default function AppHeader({ title, subtitle, showBack = false, rightLabel, onRightPress }) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        ) : null}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightLabel ? (
        <Pressable onPress={onRightPress} style={styles.rightButton}>
          <Text style={styles.rightText}>{rightLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: spacing.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: {
    color: colors.navy,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.navy,
  },
  subtitle: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 13,
  },
  rightButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.emeraldSoft,
  },
  rightText: {
    color: colors.emerald,
    fontWeight: "700",
  },
});
