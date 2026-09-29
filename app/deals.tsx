import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { ArrowLeft } from "lucide-react-native";


export default function Deals() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axios.get(`${API_URL}/product`);
        const discounted = res.data.filter((p: any) => p.discount);
        setProducts(discounted);
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>🔥 Deals of the Day</Text>
      </View>

      {products.length === 0 ? (
        <Text style={styles.emptyText}>No deals available right now</Text>
      ) : (
        <View style={styles.grid}>
          {products.map((product) => (
            <TouchableOpacity
              key={product._id}
              style={styles.card}
              onPress={() => router.push(`/product/${product._id}`)}
            >
              <Image
                source={{ uri: product.images?.[0] }}
                style={styles.image}
              />
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.price}>₹{product.price}</Text>
              <Text style={styles.discount}>{product.discount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 40,
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#666" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", backgroundColor: "#f9f9f9", borderRadius: 8, padding: 10, marginBottom: 16 },
  image: { width: "100%", height: 140, borderRadius: 8 },
  name: { marginTop: 8, fontSize: 14, fontWeight: "600", color: "#333" },
  price: { fontSize: 14, color: "#e55353", fontWeight: "bold", marginTop: 4 },
  discount: { fontSize: 12, color: "green", marginTop: 2 },
});
