import react from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react-native";
import { StyleSheet } from "react-native";
import React, { useState , useEffect } from "react";
import { useBag } from "../../context/BagContext";

interface BagItem {
  id: string | number;
  image: string;
  brand: string;
  name: string;
  price: number;
  selectedSize?: string | number;
  quantity?: number;
}
export default function shoppingBag() {
  const router = useRouter();
  const {bagItems, removeFromBag, decreaseQuantity, increaseQuantity  } = useBag(); 
  const [savedBagItems, setSavedBagItems] = useState<BagItem[]>([]);

 
  useEffect(() => {
  const loadBag = async () => {
    const saved = await AsyncStorage.getItem("bagItems");
    if (saved) {
      setSavedBagItems(JSON.parse(saved));
    } else {
      setSavedBagItems(bagItems);
    }
  };
  loadBag();
}, []);

  useEffect(() => {
    AsyncStorage.setItem("bagItems", JSON.stringify(bagItems));
    setSavedBagItems(bagItems);
  }, [bagItems]);

  
  const total = bagItems.reduce(
    (acc: number, item: any) =>
      acc + item.price * (item.quantity || 1),
    0
  );

  if (!global.isAuthenticated) {
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Bag</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {savedBagItems.length === 0 ? (
          <Text>Your bag is empty</Text>
        ) : (
        savedBagItems.map((item) => (
          
   
          <View key={item.id} style={styles.itemRow}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.brandName}>{item.brand}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.itemName}>size:{item.selectedSize}</Text>
              <View style={styles.priceContainer}>
                <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
    <Text style={styles.quantityButton}>-</Text>
  </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
    <Text style={styles.quantityButton}>+</Text>
  </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromBag(item.id)}>
                  <Trash2 />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
      </ScrollView>
      <View style={styles.footer}>
        {/* <View style={styles.emptyState}> */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>TotalAmount</Text>
          <Text style={styles.price}>{total}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/checkout")}
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
  header: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center", // centers horizontally
    marginTop: 50,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 120, // space so last item isn’t hidden behind footer
  },
  itemRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: "cover",
  },
  itemInfo: { flex: 1, justifyContent: "space-between" },
  brandName: { fontSize: 14, fontWeight: "600", color: "#555" },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    marginVertical: 2,
  },
  priceContainer: {
      flexDirection: "row",
  justifyContent: "space-between", // label left, amount right
  alignItems: "center",
  marginBottom: 16,
  },
  price: { fontSize: 15, fontWeight: "bold", color: "#000" },
  footer: {
      padding: 16,
  borderTopWidth: 1,
  borderTopColor: "#eee",
  backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: "#007AFF", // iOS-style blue button
    borderRadius: 8,
    width: "80%",               // wide enough for mobile
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 ,flex:1 ,paddingHorizontal: 20,},
  emptyTitle: {
    fontSize: 16,
    color: "#333",
    marginTop: 12,
    textAlign: "center",
  },

    bagIcon: {
    marginBottom: 16,
  },
  placeOrderButton: {
  backgroundColor: "#ff3f6c", // pink button
  paddingVertical: 16,
  borderRadius: 8,
  alignItems: "center",
},

placeOrderText: {
  color: "#fff", // white text
  fontSize: 16,
  fontWeight: "bold",
},
quantityContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
},

quantityButton: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#333",
  paddingHorizontal: 1,   // reduce this to make buttons closer
},

quantityText: {
  fontSize: 16,
  fontWeight: "600",
  marginHorizontal: 1,    // reduce spacing around the number
},
});