import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Heart, Trash2 } from "lucide-react-native";
import { StyleSheet } from "react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function Wishlist() {
  const router = useRouter();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`http://192.168.18.27:5000/wishlist/${user._id}`);
      setWishlist(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };
    useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [user])
  );
  // ✅ Delete item
  const handleDelete = async (itemId: string) => {
    try {
      await axios.delete(`http://192.168.18.27:5000/wishlist/${itemId}`);
      fetchWishlist(); // refresh after delete
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
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
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>
        <View style={styles.emptyState}>
          <Heart size={64} color="#ff3f6c" />
          <Text style={styles.emptyTitle}>Please login to view your wishlist.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ✅ Render wishlist items
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wishlist</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {wishlist.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No items in wishlist</Text>
        ) : (
          wishlist.map((item: any) => (
            <View key={item._id} style={styles.wishlistItem}>
              <Image
                source={{ uri: item.productId?.imageUrl || item.productId?.images?.[0] }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.brandName}>{item.productId?.brand}</Text>
                <Text style={styles.itemName}>{item.productId?.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>₹{item.productId?.price}</Text>
                  {item.productId?.discount && (
                    <Text style={styles.discount}>{item.productId?.discount}</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity style={styles.removeButton} onPress={() => handleDelete(item._id)}>
                <Trash2 color="#ff3f6c" size={20} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#ddd", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginTop: 50 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 16, color: "#555", marginTop: 15 },
  button: { marginTop: 20, padding: 12, backgroundColor: "#007AFF", borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  wishlistItem: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  itemImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  itemInfo: { flex: 1 },
  brandName: { fontSize: 14, fontWeight: "600", color: "#555" },
  itemName: { fontSize: 15, fontWeight: "bold", color: "#222" },
  priceContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  price: { fontSize: 15, fontWeight: "bold", marginRight: 8 },
  discount: { fontSize: 13, color: "#ff3f6c" },
  removeButton: { padding: 8 },
  scrollContent: {
  paddingHorizontal: 16,   // space on left & right
  paddingBottom: 20,       // extra space at bottom
  rowGap: 12,              // gap between items (React Native 0.71+)
  // If rowGap not supported, use marginBottom on each item instead
},

});
