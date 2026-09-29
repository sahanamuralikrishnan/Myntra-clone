import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react-native";
import { StyleSheet } from "react-native";
import React, { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/utils/api";
import axios from "axios";

export default function Bag() {
  const router = useRouter();
  const { user } = useAuth();
  const [bag, setBag] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch bag items from backend
  const fetchBag = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/bag/${user._id}`);
      setBag(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching bag:", error);
      setBag([]);
    } finally {
      setIsLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchBag();
    }, [user]),
  );
  // ✅ Delete item
  const handleDelete = async (itemId: string) => {
    try {
      await axios.delete(`${API_URL}/bag/${itemId}`);
      fetchBag(); // refresh after delete
    } catch (error) {
      console.error("Error deleting bag item:", error);
    }
  };
  // ✅ Save an item for later / move it back to the bag
  const saveForLater = async (itemId: string) => {
    try {
      await axios.post(`${API_URL}/bag/${itemId}/save-for-later`);
      fetchBag();
    } catch (error) {
      console.error("Error saving item for later:", error);
    }
  };

  const moveToBag = async (itemId: string) => {
    try {
      await axios.post(`${API_URL}/bag/${itemId}/move-to-bag`);
      fetchBag();
    } catch (error) {
      console.error("Error moving item to bag:", error);
    }
  };

  // ✅ Validate stock/price before actually going to checkout
  const handlePlaceOrder = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_URL}/bag/${user._id}/validate`);
      const { valid, unavailableItems, priceChangedItems } = res.data;

      if (!valid) {
        const names = unavailableItems
          .map((i: any) => i.name || "An item")
          .join(", ");
        Alert.alert(
          "Some items aren't available",
          `${names} — please update your bag before checking out.`,
        );
        fetchBag();
        return;
      }

      if (priceChangedItems.length > 0) {
        const names = priceChangedItems.map((i: any) => i.name).join(", ");
        Alert.alert(
          "Prices have changed",
          `${names} changed in price. Continue to checkout with the updated total?`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Continue", onPress: () => router.push("/checkout") },
          ],
        );
        return;
      }

      router.push("/checkout");
    } catch (error) {
      console.error("Error validating bag:", error);
      Alert.alert("Something went wrong", "Please try again.");
    }
  };

  // ✅ Increase / decrease quantity
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    const previousBag = bag;
    // 1. Update the screen immediately so it feels fast
    setBag((current) =>
      current.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
    // 2. Save to the backend; if it fails, put the old numbers back
    try {
      await axios.put(`${API_URL}/bag/${itemId}`, {
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      setBag(previousBag);
    }
  };
  // ✅ Loader
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }
  // ✅ If not logged in
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Bag</Text>
        </View>
        <View style={styles.emptyState}>
          <ShoppingBag size={64} color="#ff3f6c" />
          <Text style={styles.emptyTitle}>Please login to view your bag.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  const activeItems = bag.filter((item) => !item.savedForLater);
  const savedItems = bag.filter((item) => item.savedForLater);
  const total = activeItems.reduce(
    (sum, item) =>
      sum + (Number(item.productId?.price) || 0) * (item.quantity || 1),
    0,
  );
  // ✅ Render bag items
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Bag</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeItems.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Your bag is empty
          </Text>
        ) : (
          activeItems.map((item: any) => (
            <View key={item._id} style={styles.itemRow}>
              <Image
                source={{
                  uri: item.productId?.imageUrl || item.productId?.images?.[0],
                }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.brandName}>{item.productId?.brand}</Text>
                <Text style={styles.itemName}>{item.productId?.name}</Text>
                <Text style={styles.price}>₹{item.productId?.price}</Text>
                <Text style={styles.itemName}>Size: {item.size}</Text>
                <View style={styles.priceContainer}>
                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() =>
                        updateQuantity(item._id, (item.quantity || 1) - 1)
                      }
                      disabled={(item.quantity || 1) <= 1}
                    >
                      <Minus
                        size={16}
                        color={(item.quantity || 1) <= 1 ? "#ccc" : "#222"}
                      />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                      {item.quantity || 1}
                    </Text>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() =>
                        updateQuantity(item._id, (item.quantity || 1) + 1)
                      }
                      disabled={(item.quantity || 1) >= 10}
                    >
                      <Plus
                        size={16}
                        color={(item.quantity || 1) >= 10 ? "#ccc" : "#222"}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Trash2 />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => saveForLater(item._id)}>
                  <Text style={styles.saveForLaterLink}>Save for Later</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {savedItems.length > 0 && (
          <View style={styles.savedSection}>
            <Text style={styles.savedSectionTitle}>
              Saved for Later ({savedItems.length})
            </Text>
            {savedItems.map((item: any) => (
              <View key={item._id} style={styles.itemRow}>
                <Image
                  source={{
                    uri:
                      item.productId?.imageUrl || item.productId?.images?.[0],
                  }}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.brandName}>{item.productId?.brand}</Text>
                  <Text style={styles.itemName}>{item.productId?.name}</Text>
                  <Text style={styles.price}>₹{item.productId?.price}</Text>
                  <Text style={styles.itemName}>Size: {item.size}</Text>
                  <View style={styles.priceContainer}>
                    <TouchableOpacity onPress={() => moveToBag(item._id)}>
                      <Text style={styles.saveForLaterLink}>
                        Move to Bag
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item._id)}>
                      <Trash2 />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>Total Amount</Text>
          <Text style={styles.price}>₹{total}</Text>
        </View>
        <TouchableOpacity
          onPress={handlePlaceOrder}
          style={styles.placeOrderButton}
        >
          <Text style={styles.placeOrderText}>Place order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginTop: 50 },
  scrollContent: { padding: 12, paddingBottom: 120 },
  itemRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
  },
  itemImage: { width: 90, height: 90, borderRadius: 8, marginRight: 12 },
  itemInfo: { flex: 1 },
  brandName: { fontSize: 14, fontWeight: "600", color: "#555" },
  itemName: { fontSize: 15, fontWeight: "bold", color: "#222" },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  price: { fontSize: 15, fontWeight: "bold" },
  quantityText: { fontSize: 14, fontWeight: "600", marginHorizontal: 12 },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  saveForLaterLink: {
    color: "#ff3f6c",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
  savedSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  savedSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: "#eee" },
  placeOrderButton: {
    backgroundColor: "#ff3f6c",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  placeOrderText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  emptyTitle: {
    fontSize: 16, // readable size
    fontWeight: "600", // semi-bold for emphasis
    color: "#666", // softer gray tone
    marginTop: 12, // spacing from icon or header
    textAlign: "center", // center align text
    lineHeight: 22, // improves readability
  },
});
