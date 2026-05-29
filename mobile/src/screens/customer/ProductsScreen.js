import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { getProductsByBrandType } from "../../data/products";
import { getMasterState, subscribeMasters } from "../../store/masterStore";
import colors from "../../theme/colors";

export default function ProductsScreen({ navigation, route }) {
  const { addToCart } = useCart();
  const [masterState, setMasterState] = useState(() => getMasterState());
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const screenMode = route?.params?.screenMode || "categories";

  useEffect(() => subscribeMasters(setMasterState), []);

  const filters = useMemo(
    () => [
      { label: "All", value: "All" },
      ...(masterState.brandTypes || []).map((item) => ({
        label: item.name,
        value: item.name,
      })),
    ],
    [masterState.brandTypes],
  );

  const products = useMemo(() => {
    const filtered = getProductsByBrandType(selectedFilter);
    if (!searchText.trim()) {
      return filtered;
    }

    const query = searchText.trim().toLowerCase();
    return filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    );
  }, [searchText, selectedFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>
              {screenMode === "search" ? "Find your next product" : "Browse the full catalogue"}
            </Text>
            <Text style={styles.headerTitle}>All Products</Text>
          </View>
          <Pressable style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="bag-handle-outline" size={20} color={colors.primaryDeep} />
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            autoFocus={screenMode === "search"}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search for products..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filterRow}>
          {filters.map((filter) => {
            const active = selectedFilter === filter.value;
            return (
              <Animated.View key={filter.value} style={{ transform: [{ scale: active ? 1.03 : 1 }] }}>
                <Pressable
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(filter.value)}
                >
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>
                    {filter.label}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrap}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ProductCard
              index={index}
              product={item}
              onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
              onAdd={() => addToCart(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No products matched that search.</Text>
              <Text style={styles.emptyCopy}>Try MISPA, RAINBOW, CLEANBOY, or a product category.</Text>
            </View>
          }
        />
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
    paddingHorizontal: 18,
  },
  header: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerEyebrow: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  headerTitle: {
    marginTop: 4,
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchBox: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  filterRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingTop: 18,
    paddingBottom: 126,
    gap: 14,
  },
  columnWrap: {
    justifyContent: "space-between",
  },
  emptyState: {
    marginTop: 80,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyCopy: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});
