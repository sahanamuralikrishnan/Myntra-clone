import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";

// Products are saved here by the product page, in the same shape the backend returns
type RecentlyViewedProduct = {
  _id: string;
  images?: string[];
  name: string;
  price: string | number;
};

export default function RecentlyViewedPage() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadViewed = async () => {
        const saved = await AsyncStorage.getItem("recentlyViewed");
        if (saved) {
          const parsed = JSON.parse(saved);
          setRecentlyViewed(parsed.filter((item: any) => item && item._id));
        }
      };
      loadViewed();
    }, []),
  );
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Recently Viewed Products
      </Text>

      <FlatList
        data={recentlyViewed}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>You haven&apos;t viewed any products yet</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ marginBottom: 16 }}
            onPress={() => router.push(`/product/${item._id}`)}
          >
            <Image
              source={{ uri: item.images?.[0] }}
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
