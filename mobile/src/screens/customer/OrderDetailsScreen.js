import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import LoadingState from "../../components/LoadingState";
import OrderStatusTimeline from "../../components/OrderStatusTimeline";
import { getOrderById, getPaymentMethodLabel, getPaymentStatusLabel } from "../../services/orderService";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import { formatCurrency } from "../../utils/currency";

export default function OrderDetailsScreen({ route }) {
  const [order, setOrder] = useState(route.params?.order || null);
  const [loading, setLoading] = useState(!route.params?.order);

  useEffect(() => {
    if (route.params?.order || !route.params?.orderId) {
      return;
    }
    loadOrder();
  }, [route.params?.orderId]);

  async function loadOrder() {
    try {
      setLoading(true);
      const response = await getOrderById(route.params.orderId);
      setOrder(response);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !order) {
    return <LoadingState label="Loading order details..." />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <AppHeader title={`Order #${order.orderNumber}`} subtitle="Order details" showBack />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Status timeline</Text>
        <OrderStatusTimeline status={order.status} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <Text style={styles.body}>Payment status: {getPaymentStatusLabel(order.paymentStatus)}</Text>
        <Text style={styles.body}>Payment method: {getPaymentMethodLabel(order.paymentMethod)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery address</Text>
        <Text style={styles.body}>{order.address?.fullName || order.customerName}</Text>
        <Text style={styles.body}>{[order.address?.addressLine1, order.address?.addressLine2].filter(Boolean).join(", ")}</Text>
        <Text style={styles.body}>
          {order.address?.city}, {order.address?.state} - {order.address?.pincode}
        </Text>
        <Text style={styles.body}>{order.address?.mobileNumber || order.customerMobileNumber}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ordered items</Text>
        {order.items?.map((item) => (
          <View key={`${item.productId}-${item.size}`} style={styles.itemRow}>
            <View>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.body}>
                {item.size} x {item.quantity}
              </Text>
            </View>
            <Text style={styles.itemPrice}>{formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}</Text>
          </View>
        ))}
        <Text style={styles.total}>Total amount: {formatCurrency(order.grandTotal)}</Text>
      </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.navy,
    marginBottom: spacing.md,
  },
  body: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  itemName: {
    color: colors.navy,
    fontWeight: "700",
    marginBottom: 4,
  },
  itemPrice: {
    color: colors.emerald,
    fontWeight: "800",
  },
  total: {
    color: colors.navy,
    fontWeight: "900",
    fontSize: 16,
    marginTop: spacing.sm,
  },
});
