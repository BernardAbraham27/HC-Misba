import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { getAddresses } from "../../services/addressService";
import { getMyOrders, getOrderStatusMeta } from "../../services/orderService";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";

export default function ProfileScreen({ navigation }) {
  const { isAuthenticated, user, logout } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProfileData();
    } else {
      setAddresses([]);
      setOrders([]);
    }
  }, [isAuthenticated]);

  async function loadProfileData() {
    try {
      const [addressList, orderList] = await Promise.all([getAddresses(), getMyOrders()]);
      setAddresses(addressList);
      setOrders(orderList);
    } catch {
      setAddresses([]);
      setOrders([]);
    }
  }

  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "AuthChoice" }] });
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.pageTitle}>My Account</Text>
          <View style={styles.card}>
            <Text style={styles.title}>Sign in to view your account</Text>
            <Text style={styles.subtitle}>
              Please sign in to access profile details, orders, saved items, and checkout.
            </Text>
            <Button title="Sign In" onPress={() => navigation.navigate("Login")} style={styles.gap} />
            <Button
              title="Create Account"
              onPress={() => navigation.navigate("Register")}
              variant="secondary"
              style={styles.gap}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const defaultAddress = addresses.find((item) => item.isDefault) || addresses[0];
  const recentOrder = orders[0];
  const initials = String(user?.fullName || "GG")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>My Account</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileTextWrap}>
            <Text style={styles.profileName}>{user?.fullName}</Text>
            <Text style={styles.profileMeta}>{user?.mobileNumber || "No mobile number saved"}</Text>
            <Text style={styles.profileMeta}>{user?.email || "No email saved"}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Saved Address</Text>
          {defaultAddress ? (
            <>
              <Text style={styles.infoStrong}>{defaultAddress.fullName}</Text>
              <Text style={styles.infoText}>{defaultAddress.mobileNumber}</Text>
              <Text style={styles.infoText}>{defaultAddress.addressLine1}</Text>
              {defaultAddress.addressLine2 ? (
                <Text style={styles.infoText}>{defaultAddress.addressLine2}</Text>
              ) : null}
              <Text style={styles.infoText}>
                {defaultAddress.city} - {defaultAddress.pincode}
              </Text>
            </>
          ) : (
            <Text style={styles.infoText}>No saved address yet.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {recentOrder ? (
            <>
              <Text style={styles.infoStrong}>Order ID: {recentOrder.orderNumber}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbRow}>
                {recentOrder.items?.map((item) => (
                  <View key={`${item.productId}-${item.size}`} style={styles.thumbWrap}>
                    {item.productImageUrl ? (
                      <Image source={{ uri: item.productImageUrl }} style={styles.thumbImage} resizeMode="contain" />
                    ) : (
                      <Text style={styles.thumbFallback}>{item.productName?.slice(0, 1) || "P"}</Text>
                    )}
                  </View>
                ))}
              </ScrollView>
              <Text style={styles.infoText}>Total: Rs {recentOrder.grandTotal}</Text>
              <Text style={styles.infoText}>
                Status:{" "}
                {getOrderStatusMeta(recentOrder.status).find((item) => item.active)?.label || "Placed"}
              </Text>
              <Button
                title="View Orders"
                variant="secondary"
                onPress={() => navigation.navigate("MyOrders")}
                style={styles.gap}
              />
            </>
          ) : (
            <>
              <Text style={styles.infoStrong}>No orders yet</Text>
              <Text style={styles.infoText}>
                Start shopping your favourite cleaning products.
              </Text>
            </>
          )}
        </View>

        <Button title="Logout" onPress={handleLogout} variant="secondary" />
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
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: spacing.md,
  },
  card: {
    marginTop: spacing.md,
    borderRadius: 28,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileCard: {
    borderRadius: 28,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.primaryDeep,
    fontSize: 22,
    fontWeight: "900",
  },
  profileTextWrap: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  profileMeta: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  infoStrong: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  infoText: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  thumbRow: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  thumbWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.sky,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  thumbImage: {
    width: 42,
    height: 42,
  },
  thumbFallback: {
    color: colors.primaryDeep,
    fontWeight: "800",
  },
  gap: {
    marginTop: spacing.md,
  },
});
