import react from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react-native";
import { StyleSheet } from "react-native";
import React, { useState , useEffect } from "react";
import { useBag } from "../../context/BagContext";
import { useAuth } from "@/context/AuthContext";
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
      const response = await axios.get(`http://192.168.18.27:5000/bag/${user._id}`);
      setBag(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching bag:", error);
      setBag([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBag();
  }, [user]);

  // ✅ Delete item
  const handleDelete = async (itemId: string) => {
    try {
      await axios.delete(`http://192.168.18.27:5000/bag/${itemId}`);
      fetchBag(); // refresh after delete
    } catch (error) {
      console.error("Error deleting bag item:", error);
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
          <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const total = bag.reduce((sum, item) => sum + item.productId?.price * (item.quantity || 1), 0);

  // ✅ Render bag items
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Bag</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {bag.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Your bag is empty</Text>
        ) : (
          bag.map((item: any) => (
            <View key={item._id} style={styles.itemRow}>
              <Image
                source={{ uri: item.productId?.imageUrl || item.productId?.images?.[0] }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.brandName}>{item.productId?.brand}</Text>
                <Text style={styles.itemName}>{item.productId?.name}</Text>
                <Text style={styles.price}>₹{item.productId?.price}</Text>
                <Text style={styles.itemName}>Size: {item.selectedSize}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
                  <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Trash2 />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>Total Amount</Text>
          <Text style={styles.price}>₹{total}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/checkout")} style={styles.placeOrderButton}>
          <Text style={styles.placeOrderText}>Place order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingVertical: 18, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee" },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginTop: 50 },
  scrollContent: { padding: 12, paddingBottom: 120 },
  itemRow: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, marginBottom: 12, padding: 10 },
  itemImage: { width: 90, height: 90, borderRadius: 8, marginRight: 12 },
  itemInfo: { flex: 1 },
  brandName: { fontSize: 14, fontWeight: "600", color: "#555" },
  itemName: { fontSize: 15, fontWeight: "bold", color: "#222" },
  priceContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  price: { fontSize: 15, fontWeight: "bold" },
  quantityText: { fontSize: 14, fontWeight: "600" },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: "#eee" },
  placeOrderButton: { backgroundColor: "#ff3f6c", paddingVertical: 16, borderRadius: 8, alignItems: "center" },
  placeOrderText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: { marginTop: 20, padding: 12, backgroundColor: "#007AFF", borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  emptyTitle: {
  fontSize: 16,          // readable size
  fontWeight: "600",     // semi-bold for emphasis
  color: "#666",         // softer gray tone
  marginTop: 12,         // spacing from icon or header
  textAlign: "center",   // center align text
  lineHeight: 22,        // improves readability
},

});
