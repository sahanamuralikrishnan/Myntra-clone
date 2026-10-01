import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from "lucide-react-native";
import { StyleSheet } from "react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/utils/api";

export default function Wishlist() {
  const router = useRouter();
  const navigation = useNavigation();
  const { from } = useLocalSearchParams<{ from?: string }>();

  // Opened from Profile → back to Profile; opened from the tab bar → back to Home
  const goBack = () => router.navigate(from === "profile" ? "/profile" : "/");

  // Tab screens keep their params, so forget "from" when leaving this screen
  useFocusEffect(
    useCallback(() => {
      return () => navigation.setParams({ from: undefined } as never);
    }, [navigation])
  );

  const header = (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Wishlist</Text>
    </View>
  );
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/wishlist/${user._id}`);
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
      await axios.delete(`${API_URL}/wishlist/${itemId}`);
      fetchWishlist(); // refresh after delete
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
    }
  };
  // Which wishlist item is showing its size picker, and which one is being moved
  const [sizePickerFor, setSizePickerFor] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  // Add the product to the bag in the chosen size, then take it off the wishlist
  const moveToBag = async (item: any, size: string) => {
    if (!user || movingId) return;
    setMovingId(item._id);
    try {
      await axios.post(`${API_URL}/bag`, {
        userId: user._id,
        productId: item.productId._id,
        size,
        quantity: 1,
      });
      await axios.delete(`${API_URL}/wishlist/${item._id}`);
      setWishlist((prev) => prev.filter((w) => w._id !== item._id));
      setSizePickerFor(null);
      Alert.alert("Moved to bag", `${item.productId.name} (${size}) is now in your bag.`, [
        { text: "Keep Browsing", style: "cancel" },
        { text: "Go to Bag", onPress: () => router.navigate("/bag") },
      ]);
    } catch (error) {
      console.log("Error moving to bag:", error);
      Alert.alert("Couldn't move to bag", "Please try again.");
    } finally {
      setMovingId(null);
    }
  };

  // "Move to Bag" tapped: ask for a size only when there's a choice to make
  const handleMoveToBag = (item: any) => {
    const sizes: string[] = item.productId?.sizes ?? [];
    if (sizes.length === 0) {
      moveToBag(item, "One Size");
    } else if (sizes.length === 1) {
      moveToBag(item, sizes[0]);
    } else {
      setSizePickerFor(sizePickerFor === item._id ? null : item._id);
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
        {header}
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
      {header}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {wishlist.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No items in wishlist</Text>
        ) : (
          wishlist.map((item: any) => {
            const product = item.productId;
            const isMoving = movingId === item._id;
            return (
              <View key={item._id} style={styles.wishlistCard}>
                <View style={styles.wishlistItem}>
                  {/* Tap the picture or details to open the product */}
                  <TouchableOpacity
                    style={styles.itemTouchable}
                    disabled={!product?._id}
                    onPress={() => router.push(`/product/${product._id}`)}
                  >
                    <Image
                      source={{ uri: product?.imageUrl || product?.images?.[0] }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemInfo}>
                      <Text style={styles.brandName}>{product?.brand}</Text>
                      <Text style={styles.itemName}>
                        {product?.name ?? "This product is no longer available"}
                      </Text>
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹{product?.price}</Text>
                        {product?.discount && (
                          <Text style={styles.discount}>{product?.discount}</Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeButton} onPress={() => handleDelete(item._id)}>
                    <Trash2 color="#ff3f6c" size={20} />
                  </TouchableOpacity>
                </View>

                {product?._id && (
                  <TouchableOpacity
                    style={[styles.moveButton, isMoving && { opacity: 0.6 }]}
                    onPress={() => handleMoveToBag(item)}
                    disabled={isMoving}
                  >
                    {isMoving ? (
                      <ActivityIndicator size="small" color="#ff3f6c" />
                    ) : (
                      <>
                        <ShoppingBag size={16} color="#ff3f6c" />
                        <Text style={styles.moveButtonText}>Move to Bag</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}

                {/* Size choices appear under the item once "Move to Bag" is tapped */}
                {sizePickerFor === item._id && (
                  <View style={styles.sizePicker}>
                    <Text style={styles.sizePickerTitle}>Select a size</Text>
                    <View style={styles.sizeRow}>
                      {product.sizes.map((size: string) => (
                        <TouchableOpacity
                          key={size}
                          style={styles.sizeChip}
                          onPress={() => moveToBag(item, size)}
                          disabled={isMoving}
                        >
                          <Text style={styles.sizeChipText}>{size}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })
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
  backButton: { position: "absolute", left: 16, bottom: 14, padding: 4, zIndex: 1 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 16, color: "#555", marginTop: 15 },
  button: { marginTop: 20, padding: 12, backgroundColor: "#007AFF", borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  wishlistCard: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  wishlistItem: { flexDirection: "row", alignItems: "center" },
  itemTouchable: { flex: 1, flexDirection: "row", alignItems: "center" },
  moveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ff3f6c",
    borderRadius: 6,
  },
  moveButtonText: { color: "#ff3f6c", fontWeight: "bold", fontSize: 14 },
  sizePicker: { marginTop: 10 },
  sizePickerTitle: { fontSize: 13, color: "#555", marginBottom: 6 },
  sizeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  sizeChip: {
    minWidth: 44,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    alignItems: "center",
  },
  sizeChipText: { fontSize: 14, color: "#333", fontWeight: "600" },
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
