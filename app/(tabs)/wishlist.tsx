import react from "react";
import { View, Text, Image,TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Heart, Trash2 } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { useState ,useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function Wishlist() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadWishlist = async () => {
      const data = await AsyncStorage.getItem("wishlist");
        if (isActive) {
          setWishlistItems(data ? JSON.parse(data) : []);
          setIsLoaded(true);
        }
      };

      loadWishlist();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoaded]);

  function removeItem(id: number): void {
      const updatedItems = wishlistItems.filter((item) => item.id !== id);
      setWishlistItems(updatedItems);
    }


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
  

  return(
    <View style={styles.container}>
        <View style = {styles.header}>
            <Text style = {styles.headerTitle}>Wishlist</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {wishlistItems.map((item) => (
            <View key={item.id} style={{ flexDirection: "row", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                <Image
                  source={
                    typeof item.image === "string"
                      ? { uri: item.image }
                      : item.image
                  }
                  style={styles.itemImage}
                />
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 50,
    textAlign: "center",
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
  scrollContent: {
    paddingBottom: 20,
  },
});



