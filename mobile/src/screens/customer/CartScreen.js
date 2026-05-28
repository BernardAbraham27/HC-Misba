import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import colors from "../../theme/colors";

function CartRow({ item, onQuantityChange, onRemove }) {
  const rowShift = useRef(new Animated.Value(0)).current;
  const rowOpacity = useRef(new Animated.Value(1)).current;
  const qtyScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(qtyScale, {
        toValue: 1.08,
        useNativeDriver: true,
        speed: 26,
        bounciness: 8,
      }),
      Animated.spring(qtyScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 26,
        bounciness: 8,
      }),
    ]).start();
  }, [item.quantity, qtyScale]);

  function handleRemove() {
    Animated.parallel([
      Animated.timing(rowShift, {
        toValue: 180,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(rowOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onRemove();
      }
    });
  }

  return (
    <Animated.View style={[styles.card, { opacity: rowOpacity, transform: [{ translateX: rowShift }] }]}>
      <View style={styles.imageWrap}>
        <Image source={item.product.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{item.productName}</Text>
        <Text style={styles.meta}>
          {item.size} • Rs {item.unitPrice}
        </Text>
        <View style={styles.rowBottom}>
          <Animated.View style={[styles.qtyWrap, { transform: [{ scale: qtyScale }] }]}>
            <Pressable style={styles.qtyButton} onPress={() => onQuantityChange(item.quantity - 1)}>
              <Text style={styles.qtyText}>-</Text>
            </Pressable>
            <Text style={styles.qtyValue}>{item.quantity}</Text>
            <Pressable style={styles.qtyButton} onPress={() => onQuantityChange(item.quantity + 1)}>
              <Text style={styles.qtyText}>+</Text>
            </Pressable>
          </Animated.View>
          <Pressable onPress={handleRemove}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

export default function CartScreen({ navigation }) {
  const { isAuthenticated, isCustomer, user } = useAuth();
  const { items, subtotal, deliveryCharge, savings, grandTotal, updateQuantity, removeItem } =
    useCart();

  function handleCheckout() {
    if (!isAuthenticated || !isCustomer) {
      navigation.navigate("Login", { redirectTo: "Checkout" });
      return;
    }

    navigation.navigate("Checkout");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Cart</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        {!items.length ? (
          <View style={styles.emptyCard}>
            <Text style={styles.sectionTitle}>Your cart is empty</Text>
            <Text style={styles.addressCopy}>Add products to start your order.</Text>
          </View>
        ) : null}

        {items.map((item) => (
          <CartRow
            key={`${item.cartItemId || item.productId}-${item.size}`}
            item={item}
            onQuantityChange={(quantity) =>
              updateQuantity(item.productId, item.size, quantity, item.cartItemId)
            }
            onRemove={() => removeItem(item.productId, item.size, item.cartItemId)}
          />
        ))}

        <View style={styles.addressCard}>
          <Text style={styles.sectionTitle}>Delivery Account</Text>
          {isAuthenticated && isCustomer ? (
            <>
              <Text style={styles.addressName}>
                {user?.fullName} • {user?.mobileNumber}
              </Text>
              <Text style={styles.addressCopy}>
                Checkout will use your signed-in customer account.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.addressName}>Guest cart</Text>
              <Text style={styles.addressCopy}>
                Product browsing is public, but you need to sign in before checkout.
              </Text>
            </>
          )}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rs {subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Charges</Text>
            <Text style={styles.summaryValue}>Rs {deliveryCharge}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Savings</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>- Rs {savings}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowTotal]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>Rs {grandTotal}</Text>
          </View>
        </View>

        <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>
            {isAuthenticated && isCustomer ? "Proceed to Checkout" : "Please sign in to continue"}
          </Text>
        </Pressable>
      </ScrollView>
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
    paddingHorizontal: 18,
  },
  content: {
    paddingBottom: 120,
  },
  header: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonPlaceholder: {
    width: 44,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  emptyCard: {
    marginTop: 16,
    borderRadius: 24,
    padding: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  card: {
    marginTop: 16,
    borderRadius: 24,
    padding: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
  },
  imageWrap: {
    width: 88,
    height: 88,
    borderRadius: 18,
    backgroundColor: colors.sky,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
  },
  content: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: "space-between",
  },
  name: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  meta: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  rowBottom: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qtyWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 999,
    backgroundColor: colors.sky,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    color: colors.primaryDeep,
    fontSize: 18,
    fontWeight: "800",
  },
  qtyValue: {
    minWidth: 16,
    textAlign: "center",
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  addressCard: {
    marginTop: 18,
    borderRadius: 24,
    padding: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryCard: {
    marginTop: 18,
    borderRadius: 24,
    padding: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  addressName: {
    marginTop: 12,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  addressCopy: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  summaryRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  summaryValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  summaryRowTotal: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  totalValue: {
    color: colors.primaryDeep,
    fontSize: 20,
    fontWeight: "900",
  },
  checkoutButton: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingVertical: 18,
  },
  checkoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
});
