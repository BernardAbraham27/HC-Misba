import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import Button from "../../components/Button";
import Input from "../../components/Input";
import OrderStatusTimeline from "../../components/OrderStatusTimeline";
import { getPaymentStatusLabel, trackOrder } from "../../services/orderService";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import { formatCurrency } from "../../utils/currency";
import { validateMobileNumber, validateRequired } from "../../utils/validators";

export default function TrackOrderScreen() {
  const [orderNumber, setOrderNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validateForm() {
    const nextErrors = {};
    if (!validateRequired(orderNumber)) nextErrors.orderNumber = "Order number is required.";
    if (!validateMobileNumber(mobileNumber)) nextErrors.mobileNumber = "Enter a valid mobile number.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleTrack() {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await trackOrder(orderNumber, mobileNumber);
      setResult(response);
    } catch (error) {
      Alert.alert("Track order", error.response?.data?.message || error.message || "Order not found.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <AppHeader title="Track Order" subtitle="Find your order with number and mobile" showBack />

      <View style={styles.card}>
        <Input
          label="Order Number"
          value={orderNumber}
          onChangeText={setOrderNumber}
          error={errors.orderNumber}
        />
        <Input
          label="Mobile Number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          error={errors.mobileNumber}
          style={styles.fieldGap}
        />
        <Button title="Track Order" onPress={handleTrack} loading={loading} style={styles.fieldGap} />
      </View>

      {result ? (
        <View style={styles.card}>
          <Text style={styles.resultTitle}>Order #{result.orderNumber}</Text>
          <Text style={styles.body}>Total: {formatCurrency(result.grandTotal)}</Text>
          <Text style={styles.body}>Payment: {getPaymentStatusLabel(result.paymentStatus)}</Text>
          <Text style={styles.body}>Mobile: {result.customerMobileNumber || mobileNumber}</Text>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <OrderStatusTimeline status={result.status} />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  fieldGap: {
    marginTop: spacing.md,
  },
  resultTitle: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 6,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: "800",
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
});
