import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../theme/colors";

export default function AdminPlaceholderScreen({ route }) {
  const title = route.params?.title || "Admin";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.copy}>
          Admin access is connected through real authentication. This tab is ready for the admin
          mobile experience.
        </Text>
      </View>
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
    padding: 24,
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  copy: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
});
