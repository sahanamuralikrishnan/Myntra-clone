import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { ThemeProvider, ThemeContext } from "@/context/ThemeContext";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Button } from "react-native";
import { Search } from "lucide-react-native";
import { router, useRouter, useFocusEffect } from "expo-router";
import { products } from "../data/products";
import { useBag } from "../../context/BagContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { AnyAttributeType } from "react-native/Libraries/NativeComponent/NativeComponentRegistry";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 200;
// const categories = [
//   {
//     id: "1",
//     title: "Women",
//     image: {
//       uri: "https://th.bing.com/th/id/OIP.d5O8gMUXQ01BreTRxPkbhQHaE8?w=193&h=129&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
//     },
//   },
//   {
//     id: "2",
//     title: "Kids",
//     image: {
//       uri: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
//     },
//   },
//   {
//     id: "3",
//     title: "Beauty",
//     image: {
//       uri: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500",
//     },
//   },
//   {
//     id: "4",
//     title: "Men",
//     image: {
//       uri: "https://th.bing.com/th/id/OIP.GIG4kbLTsB8B6Mk3hJctUAAAAA?w=193&h=193&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
//     },
//   },
// ];
const deals = [
  {
    id: 1,
    title: "UNDER 499",
    image:
      "https://plus.unsplash.com/premium_photo-1682095661711-f5d67d0e75a9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFzaGlvbiUyMHdvbWFufGVufDB8fDB8fHww",
  },

  {
    id: 2,
    title: "UNDER 499",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "40-50% oFF",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "40-50% OFF",
    image:
      "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=800&q=80",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any>(null);
  const { user } = useAuth();

  const { addToBag } = useBag();
  const handleProductPress = (productId: number) => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(`/product/${productId}`);
    }
  };
  useEffect(() => {
    const fetchproduct = async () => {
      try {
        setIsLoading(true);
        const cat = await axios.get("http://192.168.18.27:5000/category");
        const product = await axios.get("http://192.168.18.27:5000/product");
        setCategories(cat.data);
        setProduct(product.data);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchproduct();
  }, []);
  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[number] | null
  >(null);
  const [recentlyViewed, setRecentlyViewed] = useState<
    (typeof products)[number][]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const loadRecentlyViewed = async () => {
        const saved = await AsyncStorage.getItem("recentlyViewed");

        if (saved) {
          setRecentlyViewed(JSON.parse(saved));
        }
      };

      loadRecentlyViewed();
    }, []),
  );

  // ✅ Get theme from context
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme, setTheme } = themeContext;

  const handleAddToBag = (product: (typeof products)[number]) => {
    setSelectedProduct(product);
  };

  const handleSizeSelect = (size: string) => {
    if (!selectedProduct) return;

    addToBag({
      ...selectedProduct,
      selectedSize: size,
      quantity: 1,
    });
    setSelectedProduct(null);
    router.push("/bag");
  };
  const handleAddToWishlist = async (product: (typeof products)[number]) => {
    const savedWishlist = await AsyncStorage.getItem("wishlist");
    const wishlistItems: (typeof products)[number][] = savedWishlist
      ? JSON.parse(savedWishlist)
      : [];

    const updatedWishlist = wishlistItems.some((item) => item.id === product.id)
      ? wishlistItems.map((item) => (item.id === product.id ? product : item))
      : [...wishlistItems, product];

    await AsyncStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    router.push("/wishlist");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Top header */}
      <View
        style={[
          styles.topBar,
          { backgroundColor: theme.card, borderBottomColor: theme.text },
        ]}
      >
        <Text style={[styles.brand, { color: theme.text }]}>MYNTRA</Text>
        <TextInput
          style={[
            styles.searchBox,
            { borderColor: theme.text, color: theme.text },
          ]}
          placeholder="Search for products"
          placeholderTextColor={theme.text}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchBtn} activeOpacity={0.7}>
          <Text style={[styles.searchIcon, { color: theme.text }]}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.headerWrapper}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
          }}
          style={{ width: "100%", height: 300 }}
          contentFit="cover"
        />
      </View>

      {/* Shop by Category */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          🛍️ Shop by Category
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryRow}
        >
          
          {isLoading ? (
        <ActivityIndicator size="large" color="#ff3f6c" />
      ) : !categories || categories.length === 0 ? (
        <Text>No categories Available</Text>
        ) : (
          
          categories.map((category:any) => (
            <TouchableOpacity
              key={category._id}
              style={styles.categoryItem}
              activeOpacity={0.7}
              onPress={() => router.push("/categories")}
            >
       <Image
  source={{ uri: category.image[0] }}
  style={styles.categoryImage}
  contentFit="cover"
/>
              <Text style={[styles.categoryLabel, { color: theme.text }]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          )))}
        </ScrollView>
      </View>

      {/* Deals of the Day */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          🔥 Deals of the Day
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {deals.map((item) => (
            <View key={item.id} style={styles.dealCard}>
              <Image
                source={item.image}
                style={styles.dealImage}
                contentFit="cover"
              />
              <Text style={[styles.dealTitle, { color: theme.text }]}>
                {item.title}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Trending Products */}

      {recentlyViewed.length > 0 && (
        <View style={styles.section}>
          <TouchableOpacity onPress={() => router.push("/recentlyViewed")}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              RECENTLY VIEWED
            </Text>
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {recentlyViewed.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/product/${item.id}`)}
                style={[
                  styles.productCard,
                  {
                    width: 160,
                    marginRight: 12,
                    backgroundColor: theme.card,
                  },
                ]}
              >
                <Image
                  source={
                    typeof item.image === "string"
                      ? { uri: item.image }
                      : item.image
                  }
                  style={styles.productImage}
                  contentFit="cover"
                />
                <Text style={[styles.productName, { color: theme.text }]}>
                  {item.name}
                </Text>
                <Text style={{ color: theme.primary }}>₹{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              TRENDING PRODUCTS
            </Text>
          </View>
        </View>
      )}

      <View style={styles.productGrid}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#ff3f6c" />
        ) : !product || product.length === 0 ? (
          <Text>No products Available</Text>
        ) : (
          product.map((product: any) => (
          <TouchableOpacity
            key={product._id}
            style={[styles.productCard, { backgroundColor: theme.card }]}
            onPress={() => handleProductPress(product._id)}
          >
          <Image
  source={
    typeof product.image === "string"
      ? { uri: product.image }
      : product.image
  }
  style={styles.productImage}
  contentFit="cover"
/>
            <Text style={[styles.productName, { color: theme.text }]}>
              {product.name}
            </Text>
            <Text style={{ color: theme.primary }}>₹{product.price}</Text>
            <Text style={[styles.productBrand, { color: theme.text }]}>
              {product.brand}
            </Text>
            <Text style={[styles.productDiscount, { color: theme.text }]}>
              {product.discount}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                onPress={() => handleAddToBag(product)}
              >
                <Text style={styles.actionText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                onPress={() => handleAddToWishlist(product)}
              >
                <Text style={styles.actionText}>Wishlist</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          ))
        )}
      </View>
      <Modal
        visible={selectedProduct !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sizeModal}>
            <Text style={styles.sizeModalTitle}>Select Size</Text>
            <Text style={styles.sizeModalProduct}>{selectedProduct?.name}</Text>
            <View style={styles.sizeOptions}>
              {selectedProduct?.sizes?.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={styles.sizeOption}
                  onPress={() => handleSizeSelect(size)}
                >
                  <Text style={styles.sizeOptionText}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelSizeButton}
              onPress={() => setSelectedProduct(null)}
            >
              <Text style={styles.cancelSizeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff" // ✅ keep only flex + background here
  },
  topBar: {
    height: 56,
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e6e6e6",
    marginTop: 40,
  },
  brand: {
    fontSize: 20,
    fontWeight: "800",
    // letterSpacing: 1,
    // color: "#111",
    // marginRight: 8,
  },
  searchBox: {
    width: 160,
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 14,
  },
  searchBtn: { marginLeft: 8 },
  searchIcon: { fontSize: 18 },

  headerWrapper: { marginBottom: 16 },

  section: { padding: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },

  categoryRow: { paddingVertical: 8 },
  categoryItem: { width: 96, alignItems: "center", marginRight: 16 },
  categoryImage: { width: 76, height: 76, borderRadius: 38, marginBottom: 8 },
  categoryLabel: { fontSize: 13, color: "#444" },

  dealCard: {
    width: 150,
    marginRight: 12,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    elevation: 2,
  },
  dealImage: { width: 140, height: 160, borderRadius: 8 },
  dealTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff3f6c",
    textAlign: "center",
  },

  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
    borderRadius: 8,
    padding: 10,
  },
  productImage: {
    width: "100%",
    height: 140,
    borderRadius: 8, // ✅ completed value
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  productPrice: {
    marginTop: 4,
    fontSize: 14,
    color: "#e55353",
    fontWeight: "bold",
  },
  productBrand: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  productDiscount: {
    fontSize: 12,
    color: "green",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#444",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sizeModal: {
    width: "82%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  sizeModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  sizeModalProduct: {
    marginTop: 6,
    color: "#666",
  },
  sizeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  sizeOption: {
    minWidth: 54,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ff3f6c",
    borderRadius: 6,
    alignItems: "center",
  },
  sizeOptionText: {
    color: "#ff3f6c",
    fontWeight: "600",
  },
  cancelSizeButton: {
    alignSelf: "flex-end",
    marginTop: 18,
    padding: 6,
  },
  cancelSizeText: {
    color: "#666",
    fontWeight: "600",
  },
});
