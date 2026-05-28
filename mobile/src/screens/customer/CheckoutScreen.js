import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createCheckoutOrder, paymentMethods } from "../../services/orderService";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import { formatCurrency } from "../../utils/currency";
import { validateMobileNumber, validatePincode, validateRequired } from "../../utils/validators";

export default function CheckoutScreen({ navigation }) {
  const { user, isAuthenticated, isCustomer } = useAuth();
  const { items, subtotal, deliveryCharge, grandTotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: user?.fullName || "",
    mobileNumber: user?.mobileNumber || "",
    email: user?.email || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    paymentMethod: 1,
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const mappedItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    [items],
  );

  useEffect(() => {
    if (!isAuthenticated || !isCustomer) {
      navigation.replace("Login", { redirectTo: "Checkout" });
    }
  }, [isAuthenticated, isCustomer, navigation]);

  if (!isAuthenticated || !isCustomer) {
    return null;
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validateForm() {
    const nextErrors = {};
    if (!validateRequired(form.customerName)) nextErrors.customerName = "Customer name is required.";
    if (!validateMobileNumber(form.mobileNumber)) nextErrors.mobileNumber = "Enter a valid mobile number.";
    if (!validateRequired(form.addressLine1)) nextErrors.addressLine1 = "Address Line 1 is required.";
    if (!validateRequired(form.city)) nextErrors.city = "City is required.";
    if (!validateRequired(form.state)) nextErrors.state = "State is required.";
    if (!validatePincode(form.pincode)) nextErrors.pincode = "Enter a valid pincode.";
    if (!mappedItems.length) nextErrors.items = "Your cart is empty.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handlePlaceOrder() {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const result = await createCheckoutOrder(
        {
          ...form,
          items: mappedItems,
        },
        true,
      );
      const orderNumber = result.orderNumber || `GG${Date.now().toString().slice(-8)}`;
      await clearCart();
      navigation.replace("OrderSuccess", {
        orderNumber,
        customerName: form.customerName,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppHeader title="Checkout" subtitle="Enter delivery details" showBack />

        <View style={styles.card}>
          <Input
            label="Customer Name"
            value={form.customerName}
            onChangeText={(value) => updateField("customerName", value)}
            error={errors.customerName}
          />
          <Input
            label="Mobile Number"
            value={form.mobileNumber}
            onChangeText={(value) => updateField("mobileNumber", value)}
            keyboardType="phone-pad"
            error={errors.mobileNumber}
            style={styles.fieldGap}
          />
          <Input
            label="Email"
            value={form.email}
            onChangeText={(value) => updateField("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.fieldGap}
          />
          <Input
            label="Address Line 1"
            value={form.addressLine1}
            onChangeText={(value) => updateField("addressLine1", value)}
            error={errors.addressLine1}
            style={styles.fieldGap}
          />
          <Input
            label="Address Line 2"
            value={form.addressLine2}
            onChangeText={(value) => updateField("addressLine2", value)}
            style={styles.fieldGap}
          />
          <Input
            label="City"
            value={form.city}
            onChangeText={(value) => updateField("city", value)}
            error={errors.city}
            style={styles.fieldGap}
          />
          <Input
            label="State"
            value={form.state}
            onChangeText={(value) => updateField("state", value)}
            error={errors.state}
            style={styles.fieldGap}
          />
          <Input
            label="Pincode"
            value={form.pincode}
            onChangeText={(value) => updateField("pincode", value)}
            keyboardType="number-pad"
            error={errors.pincode}
            style={styles.fieldGap}
          />
          <Input
            label="Landmark"
            value={form.landmark}
            onChangeText={(value) => updateField("landmark", value)}
            style={styles.fieldGap}
          />

          <Text style={styles.paymentTitle}>Payment Method</Text>
          <View style={styles.paymentWrap}>
            {paymentMethods.map((method) => (
              <Text
                key={method.value}
                style={[
                  styles.paymentChip,
                  form.paymentMethod === method.value ? styles.paymentChipActive : null,
                ]}
                onPress={() => updateField("paymentMethod", method.value)}
              >
                {method.label}
              </Text>
            ))}
          </View>
          {errors.items ? <Text style={styles.errorText}>{errors.items}</Text> : null}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery charge</Text>
            <Text style={styles.summaryValue}>{formatCurrency(deliveryCharge)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Grand total</Text>
            <Text style={styles.summaryTotal}>{formatCurrency(grandTotal)}</Text>
          </View>
          <Button
            title="Place Order"
            onPress={handlePlaceOrder}
            loading={submitting}
            variant="secondary"
            style={styles.placeOrderButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    borderRadius: 28,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldGap: {
    marginTop: spacing.md,
  },
  paymentTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontSize: 14,
    fontWeight: "700",
    color: colors.navy,
  },
  paymentWrap: {
    gap: spacing.sm,
  },
  paymentChip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.navy,
    backgroundColor: colors.background,
  },
  paymentChipActive: {
    backgroundColor: colors.emeraldSoft,
    borderColor: colors.emerald,
    color: colors.emerald,
    fontWeight: "700",
  },
  errorText: {
    marginTop: spacing.md,
    color: colors.danger,
  },
  summaryCard: {
    backgroundColor: colors.navy,
    borderRadius: 28,
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  summaryTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.78)",
  },
  summaryValue: {
    color: colors.white,
    fontWeight: "700",
  },
  summaryTotal: {
    color: colors.sky,
    fontWeight: "900",
    fontSize: 18,
  },
  placeOrderButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
  },
});
