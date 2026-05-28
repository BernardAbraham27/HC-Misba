import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../theme/colors";
import spacing from "../theme/spacing";
import { getOrderStatusMeta } from "../services/orderService";

export default function OrderStatusTimeline({ status }) {
  const steps = getOrderStatusMeta(status);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.label} style={styles.row}>
          <View style={styles.left}>
            <View
              style={[
                styles.dot,
                step.done ? styles.dotDone : null,
                step.active ? styles.dotActive : null,
              ]}
            />
            {index < steps.length - 1 ? (
              <View style={[styles.line, step.done ? styles.lineDone : null]} />
            ) : null}
          </View>
          <View style={styles.content}>
            <Text style={styles.label}>{step.label}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  left: {
    width: 28,
    alignItems: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  dotDone: {
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
  },
  dotActive: {
    borderColor: colors.navy,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 34,
    backgroundColor: colors.border,
    marginTop: 3,
  },
  lineDone: {
    backgroundColor: colors.emerald,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.navy,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
  },
});
