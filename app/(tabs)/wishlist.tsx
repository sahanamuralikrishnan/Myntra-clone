import react from "react";
import { View, Text, Image,TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Heart, Trash2 } from "lucide-react-native";
import { StyleSheet } from "react-native";

const wishlisIitems = [
  {
    id: 1,
    name: "Classic Sneakers",
    brand: "Nike",
    price: "3499",
    discount: "30% OFF",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop",
  },

  {
    id: 4,
    name: "Men Jeans",
    brand: "Levis",
    price: "1999",
    discount: "30% OFF",
    image:
      "https://media.istockphoto.com/id/1132154377/photo/jeans.webp?b=1&s=170667a&w=0&k=20&c=tZASI7kn4G8LG-XQnu4i4yxDy_Ix-3G-SKUzWV9qa-w=",
  },
  {
    id: 6,
    name: "Sneakers",
    brand: "Adidas",
    price: "2499",
    discount: "20% OFF",
    image:
      "https://th.bing.com/th/id/OIP.b_9hj8vi9AJeqLysj2UJXgHaE8?w=193&h=129&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
  },
];

export default function Wishlist() {
  const router = useRouter();
  if (!global.isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style = {styles.header}>
          <Text style = {styles.headerTitle}>Wishlist</Text>
        </View>
        <View style = {styles.emptyState}>

          <Heart size={64} color="#ff3f6c" />
          <Text style={styles.emptyTitle}>Please login to view your wishlist.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
    function removeItem(id: number): void {
        throw new Error("Function not implemented.");
    }

  return(
    <View style={styles.container}>
        <View style = {styles.header}>
            <Text style = {styles.headerTitle}>Wishlist</Text>
        </View>
        <ScrollView>
            {wishlisIitems.map((item) => (
            <View key={item.id} style={{ flexDirection: "row", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
              <Text style={styles.brandName}>{item.brand}</Text>
              <Text style={styles.itemName}>{item.name}</Text>

              <View style={styles.priceContainer}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.discount}>{item.discount}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <Trash2 color="#ff3f6c" size={20} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",   // centers vertically
    alignItems: "center",       // centers horizontally
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 15,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#ff3f6c", // Myntra-style pink/red
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  wishlistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: "cover",
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  brandName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginRight: 8,
  },
  discount: {
    fontSize: 13,
    color: "#ff3f6c",
  },
  removeButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});



