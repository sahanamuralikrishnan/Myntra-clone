import React, { useRef, useState, useEffect, useContext } from "react";
import { ThemeProvider, ThemeContext } from "@/app/context/ThemeContext";
import {
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
import navigator from "../navigator";
import { router, useRouter } from "expo-router";
import { products } from "../data/products";
import { useBag } from "../context/BagContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 200;
const categories = [
  {
    id: "1",
    title: "Women",
    image: {
      uri: "https://th.bing.com/th/id/OIP.d5O8gMUXQ01BreTRxPkbhQHaE8?w=193&h=129&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
    },
  },
  {
    id: "2",
    title: "Kids",
    image: {
      uri: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    },
  },
  {
    id: "3",
    title: "Beauty",
    image: {
      uri: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500",
    },
  },
  {
    id: "4",
    title: "Men",
    image: {
      uri: "https://th.bing.com/th/id/OIP.GIG4kbLTsB8B6Mk3hJctUAAAAA?w=193&h=193&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
    },
  },
];
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

// const products = [
//   {
//     id: 1,
//     name: "Summer Dress",
//     brand: "ONLY",
//     price: "1299",
//     discount: "50% OFF",
//     image: {
//       uri: "https://media.istockphoto.com/id/1081873610/photo/young-woman-on-beach-with-sun-dress.webp?b=1&s=170667a&w=0&k=20&c=sHNTnj-gPOBQ5Ydn04_px3dl_Deq91dLHoyApnSA-EQ=",
//     },
//   },

//   {
//     id: 2,
//     name: "Classic Sneakers",
//     brand: "Nike",
//     price: "3499",
//     discount: "30% OFF",
//     image:
//       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop",
//   },

//   {
//     id: 3,
//     name: "Handbag",
//     brand: "DressBerry",
//     price: "1599",
//     discount: "25% OFF",
//     image:
//       "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     id: 4,
//     name: "Men Jeans",
//     brand: "Levis",
//     price: "1999",
//     discount: "30% OFF",
//     image:
//       "https://media.istockphoto.com/id/1132154377/photo/jeans.webp?b=1&s=170667a&w=0&k=20&c=tZASI7kn4G8LG-XQnu4i4yxDy_Ix-3G-SKUzWV9qa-w=",
//   },
//   {
//     id: 5,
//     name: "Kurti",
//     brand: "Anouk",
//     price: "899",
//     discount: "15% OFF",
//     image:
//       "https://images.unsplash.com/photo-1760287363750-1c888c75578f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGt1cnRpfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
//   },
//   {
//     id: 6,
//     name: "Sneakers",
//     brand: "Adidas",
//     price: "2499",
//     discount: "20% OFF",
//     image:
//       "https://th.bing.com/th/id/OIP.b_9hj8vi9AJeqLysj2UJXgHaE8?w=193&h=129&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
//   },
//   {
//     id: 7,
//     name: "Kids Jacket",
//     brand: "U.S. Polo Kids",
//     price: "1299",
//     discount: "10% OFF",
//     image:
//       "https://img.freepik.com/premium-photo/kids-jacket_1059430-73415.jpg",
//   },
//   {
//     id: 8,
//     name: "Perfume",
//     brand: "Calvin Klein",
//     price: "699",
//     discount: "5% OFF",
//     image:
//       "https://images.unsplash.com/photo-1615160460524-432433ba1b8f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBlcmZ1bWUlMjBib3R0bGV8ZW58MHx8MHx8fDA%3D",
//   },
//   {
//     id: 9,
//     name: "Saree",
//     brand: "Sangria",
//     price: "2999",
//     discount: "35% OFF",
//     image:
//       "https://media.istockphoto.com/id/1402583520/photo/closeup-view-of-stacked-colours-saris-or-sarees-in-display-of-indian-retail-shop-textile-shop.webp?b=1&s=170667a&w=0&k=20&c=KI123lKpRC5bEoZ0et3SO3SfUrOaFPHPF92Wdqnz768=",
//   },
//   {
//     id: 10,
//     name: "Formal Shirt",
//     brand: "Arrow",
//     price: "1499",
//     discount: "20% OFF",
//     image:
//       "https://plus.unsplash.com/premium_photo-1723925110801-110c00d392a3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9ybWFsJTIwc2hpcnRzfGVufDB8fDB8fHww",
//   },
//   {
//     id: 11,
//     name: "Kids Shorts",
//     brand: "H&M Kids",
//     price: "499",
//     discount: "10% OFF",
//     image:
//       "https://i5.walmartimages.com/seo/Reduce-Herrnalise-Toddler-Boys-Formal-Suit-Shorts-Dress-Pants-Baby-Clothes-Solid-Color-School-Uniform-Suit-Kids-Fashion-Cute-Casual-Shorts-Navy-A_73af338d-4958-4302-a21b-ac8754f806c9.166f4df07395060c4255185474093a98.jpeg",
//   },
//   {
//     id: 12,
//     name: "Lipstick",
//     brand: "Maybelline",
//     price: "₹399",
//     discount: "15% OFF",
//     image:
//       "https://images.unsplash.com/photo-1542452255191-c85a98f2c5d1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGxpcHN0aWNrfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
//   },
//   {
//     id: 13,
//     name: "Sandals",
//     brand: "Catwalk",
//     price: "1199",
//     discount: "20% OFF",
//     image:
//       "https://images.unsplash.com/photo-1595970487296-8818e128ac4b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhbmRhbHN8ZW58MHx8MHx8fDA%3D",
//   },
//   {
//     id: 14,
//     name: "Watch",
//     brand: "Fossil",
//     price: "3499",
//     discount: "25% OFF",
//     image:
//       "https://images.unsplash.com/photo-1619134778706-7015533a6150?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdhdGNoZXN8ZW58MHx8MHx8fDA%3D",
//   },
//   {
//     id: 15,
//     name: "Backpack",
//     brand: "Puma Kids",
//     price: "799",
//     discount: "10% OFF",
//     image:
//       "https://images.unsplash.com/photo-1589966781848-056f1d039519?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     id: 16,
//     name: "Face Cream",
//     brand: "Nivea",
//     price: "599",
//     discount: "5% OFF",
//     image:
//       "https://images.unsplash.com/photo-1591134608223-67005960e763?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjaWFsJTIwY3JlYW18ZW58MHx8MHx8fDA%3Dp",
//   },
//   {
//     id: 17,
//     name: "Women Top",
//     brand: "Forever 21",
//     price: "699",
//     discount: "15% OFF",
//     image:
//       "https://plus.unsplash.com/premium_photo-1682095661711-f5d67d0e75a9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFzaGlvbiUyMHdvbWFufGVufDB8fDB8fHww ",
//   },
//   {
//     id: 18,
//     name: "Track Pants",
//     brand: "Adidas",
//     price: "999",
//     discount: "20% OFF",
//     image:
//       "http://www.clothingindia.co/cdn/shop/collections/FN07_d13bb78f-b002-4aa9-a852-c4c586c14c41.jpg?v=1750339858",
//   },
//   {
//     id: 19,
//     name: "Women Kurti",
//     brand: "Biba",
//     price: "1299",
//     discount: "25% OFF",
//     image:
//       "https://images.unsplash.com/photo-1741847639057-b51a25d42892?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGt1cnRpfGVufDB8fDB8fHww",
//   },
//   {
//     id: 20,
//     name: "Men Hoodie",
//     brand: "Roadster",
//     price: "1799",
//     discount: "30% OFF",
//     image:
//       "https://images.unsplash.com/photo-1556821840-3a63f95609a7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvb2RpZXN8ZW58MHx8MHx8fDA%3D",
//   },
// ];

export default function HomeScreen() {

 const  router=useRouter();
 const { addToBag } = useBag();
 const handleProductPress = (productId: number) => {
  if(!global.isAuthenticated){
    router.push("/login");
  } else {
    router.push(`/product/${productId}`)}
 }
  
  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[number] | null
  >(null);

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
  const handleAddToWishlist = async (
    product: (typeof products)[number]
  ) => {
    const savedWishlist = await AsyncStorage.getItem("wishlist");
    const wishlistItems: (typeof products)[number][] = savedWishlist
      ? JSON.parse(savedWishlist)
      : [];

    const updatedWishlist = wishlistItems.some(
      (item) => item.id === product.id
    )
      ? wishlistItems.map((item) =>
          item.id === product.id ? product : item
        )
      : [...wishlistItems, product];

    await AsyncStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

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
          {categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.categoryItem}
              activeOpacity={0.7}
              onPress={() => router.push("/categories")}
              
            >
              <Image
                source={c.image}
                style={styles.categoryImage}
                contentFit="cover"
              />
              <Text style={[styles.categoryLabel, { color: theme.text }]}>
                {c.title}
              </Text>
            </TouchableOpacity>
          ))}
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
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          TRENDING PRODUCTS
        </Text>
      </View>

      <View style={styles.productGrid}>
        {products.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.productCard, { backgroundColor: theme.card }]}
            onPress = {() =>handleProductPress(p.id)}
          >
            <Image
              source={p.image}
              style={styles.productImage}
              contentFit="cover"
            />
            <Text style={[styles.productName, { color: theme.text }]}>
              {p.name}
            </Text>
            <Text style={{ color: theme.primary }}>₹{p.price}</Text>
            <Text style={[styles.productBrand, { color: theme.text }]}>
              {p.brand}
            </Text>
            <Text style={[styles.productDiscount, { color: theme.text }]}>
              {p.discount}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                onPress={() => handleAddToBag(p)}
              >
                <Text style={styles.actionText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                onPress={() => handleAddToWishlist(p)}
              >
                <Text style={styles.actionText}>Wishlist</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
            <Text style={styles.sizeModalProduct}>
              {selectedProduct?.name}
            </Text>
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
