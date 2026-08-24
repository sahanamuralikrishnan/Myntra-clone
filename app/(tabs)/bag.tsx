import react from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react-native";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { useBag } from "../context/BagContext";

interface BagItem {
  id: string | number;
  image: string;
  brand: string;
  name: string;
  price: number;
  selectedSize?: string | number;
  quantity?: number;
}


// const bagItems = [
//   {
//     id: 1,
//     name: "Classic Sneakers",
//     brand: "Nike",
//     price: 3499,
//     discount: "30% OFF",
//     quantity: 1,
//     size: "10",
//     image:
//       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop",
//   },

//   {
//     id: 4,
//     name: "Men Jeans",
//     brand: "Levis",
//     price: 1999,
//     discount: "30% OFF",
//     quantity: 1,
//     size: "32",
//     image:
//       "https://media.istockphoto.com/id/1132154377/photo/jeans.webp?b=1&s=170667a&w=0&k=20&c=tZASI7kn4G8LG-XQnu4i4yxDy_Ix-3G-SKUzWV9qa-w=",
//   },
//   {
//     id: 6,
//     name: "Sneakers",
//     brand: "Adidas",
//     price: 2499,
//     discount: "20% OFF",
//     quantity: 1,
//     size: "9",
//     image:
//       "https://th.bing.com/th/id/OIP.b_9hj8vi9AJeqLysj2UJXgHaE8?w=193&h=129&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
//   },
// ];

export default function shoppingBag() {
  const router = useRouter();
  const {bagItems, removeFromBag, decreaseQuantity, increaseQuantity  } = useBag(); 
  // const [items, setItems] = useState(bagItems);
  const total = bagItems.reduce(
    (acc: number, item: any) =>
      acc + item.price * (item.quantity || 1),
    0
  );
  // const addToBag = (item: BagItem): void => {
  // bagItems((prev: typeof bagItems) => {
  //   // check if item already exists
  //   const existing = prev.find((p) => p.id === item.id);
  //   if (existing) {
  //     return prev.map((p) =>
  //       p.id === item.id
  //         ? { ...p, quantity: (p.quantity || 1) + 1 }
  //         : p
  //     );
  //   }
  //   return [...prev, { ...item, quantity: 1 }];
  // });
// };
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
        {bagItems.length === 0 ? (
          <Text>Your bag is empty</Text>
        ) : (
        bagItems.map((item: BagItem) => (
          
   
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