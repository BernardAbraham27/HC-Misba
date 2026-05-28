import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import { getMyOrders, getOrderStatusMeta, getPaymentStatusLabel } from "../../services/orderService";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import { formatCurrency } from "../../utils/currency";

export default function MyOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadOrders);
    return unsubscribe;
  }, [navigation]);

  async function loadOrders() {
    try {
      setLoading(true);
      const response = await getMyOrders();
      setOrders(response || []);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading your orders..." />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <AppHeader
        title="My Orders"
        subtitle="View order history and recent purchases"
        rightLabel="Track"
        onRightPress={() => navigation.navigate("TrackOrder")}
      />

      {!orders.length ? (
        <EmptyState
          title="No orders yet"
          description="Place your first order and it will appear here."
          actionLabel="Start Shopping"
          onAction={() => navigation.navigate("Products")}
        />
      ) : (
        orders.map((order) => (
          <View key={order.id || order.orderNumber} style={styles.card}>
            <Text style={styles.orderNumber}>Order ID: {order.orderNumber}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbRow}>
              {order.items?.map((item) => (
                <View key={`${item.productId}-${item.size}`} style={styles.thumbWrap}>
                  {item.productImageUrl ? (
                    <Image source={{ uri: item.productImageUrl }} style={styles.thumbImage} resizeMode="contain" />
                  ) : null}
                </View>
              ))}
            </ScrollView>
            <Text style={styles.meta}>Date: {new Date(order.orderDate).toLocaleDateString()}</Text>
            <Text style={styles.meta}>
              Status: {getOrderStatusMeta(order.status).find((item) => item.active)?.label || "Placed"}
            </Text>
            <Text style={styles.meta}>Payment: {getPaymentStatusLabel(order.paymentStatus)}</Text>
            <Text style={styles.total}>{formatCurrency(order.grandTotal)}</Text>
            <Button
              title="View Details"
              onPress={() => navigation.navigate("OrderDetails", { orderId: order.id, order })}
              variant="secondary"
              style={styles.buttonGap}
            />
          </View>
        ))
      )}
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
    paddingBottom: 120,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  meta: {
    color: colors.textMuted,
    marginBottom: 4,
  },
  total: {
    color: colors.emerald,
    fontSize: 18,
    fontWeight: "900",
    marginTop: spacing.sm,
  },
  thumbRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  thumbWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.sky,
    marginRight: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbImage: {
    width: 40,
    height: 40,
  },
  buttonGap: {
    marginTop: spacing.md,
  },
});
