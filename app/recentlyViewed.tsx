import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type RecentlyViewedProduct = {
  id: string | number;
  image: string | { uri: string };
  name: string;
  price: string | number;
};

export default function RecentlyViewedPage() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadViewed = async () => {
      const saved = await AsyncStorage.getItem("recentlyViewed");
      if (saved) setRecentlyViewed(JSON.parse(saved));
    };
    loadViewed();
  }, []);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Recently Viewed Products
      </Text>

      <FlatList
        data={recentlyViewed}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ marginBottom: 16 }}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image
              source={
                typeof item.image === "string"
                  ? { uri: item.image }
                  : item.image
              }
              style={{ width: "100%", height: 200, borderRadius: 8 }}
            />
            <Text style={{ fontSize: 16, marginTop: 8 }}>{item.name}</Text>
            <Text style={{ color: "gray" }}>₹{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}