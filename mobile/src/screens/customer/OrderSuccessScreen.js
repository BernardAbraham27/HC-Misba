import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";

export default function OrderSuccessScreen({ navigation, route }) {
  const orderNumber = route.params?.orderNumber || "Pending";
  const customerName = route.params?.customerName || "Customer";

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>OK</Text>
      </View>
      <Text style={styles.title}>Order placed successfully</Text>
      <Text style={styles.subtitle}>
        Thank you, {customerName}. Your order number is {orderNumber}.
      </Text>
      <Button
        title="View My Orders"
        onPress={() => navigation.navigate("MyOrders")}
        style={styles.buttonGap}
      />
      <Button title="Track Order" onPress={() => navigation.navigate("TrackOrder")} variant="secondary" style={styles.buttonGap} />
      <Button
        title="Continue Shopping"
        onPress={() => navigation.navigate("CustomerTabs")}
        variant="ghost"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mint,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.emerald,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  badgeText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.navy,
    textAlign: "center",
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  buttonGap: {
    marginBottom: spacing.sm,
    alignSelf: "stretch",
  },
});
