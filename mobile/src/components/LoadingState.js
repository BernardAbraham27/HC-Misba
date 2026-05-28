import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import colors from "../theme/colors";

export default function LoadingState({ label = "Loading..." }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.emerald} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  label: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 14,
  },
});
