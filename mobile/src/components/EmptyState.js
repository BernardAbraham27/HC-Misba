import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../theme/colors";
import spacing from "../theme/spacing";
import Button from "./Button";

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel ? <Button title={actionLabel} onPress={onAction} style={styles.button} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: "center",
  },
  button: {
    marginTop: spacing.lg,
    alignSelf: "stretch",
  },
});
