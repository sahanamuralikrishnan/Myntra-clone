import {
  ActivityIndicator,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useEffect } from "react";
import { handleUrlParams } from "expo-router/build/fork/getStateFromPath-forks";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { products } from "../data/products";
import { useBag } from "../context/BagContext";


export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [selectedSize, setSelectedSize] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const product = products.find((p) => p.id === Number(id));
  const {addToBag} = useBag();
  

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleToaddBag = () => {
    if (!global.isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!selectedSize) {
      alert("Please select the size");
      return;
    }
    addToBag({ ...product, selectedSize:selectedSize });  // ✅ add product to bag
  router.push("/bag");
};
  useEffect(() => {
  saveViewedProduct(product); // product is the current product details
}, [product]);

  if (isLoading || !product) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }
  return (
    <View style={styles.productContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#222" />
      </TouchableOpacity>

      <ScrollView>
        {/* Product Image */}
        <View style={styles.carouselContainer}>
          <Image
            source={
              typeof product.image === "string"
                ? { uri: product.image }
                : product.image
            }
            style={[styles.productImage, { width }]}
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>{product.brand}</Text>
              <Text style={styles.name}>{product.name}</Text>
            </View>
            <TouchableOpacity style={styles.wishlistButton}>
              <Heart />
            </TouchableOpacity>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{product.price}</Text>
            <Text style={styles.discount}>{product.discount}</Text>
          </View>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Sizes */}
        {product.sizes && (
          <View style={styles.sizeSectionWrapper}>
            <Text style={styles.sizeTitle}>Select Size</Text>
            <View style={styles.sizeGrid}>
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.selectedSize,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.selectedSizeText,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Add to Bag */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addToBagButton}
            onPress={handleToaddBag}
          >
            <ShoppingBag size={20} color="#fff" />
            <Text style={styles.addToBagText}>ADD TO BAG</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  productContainer: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: "#fff",
    borderRadius: 21,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  productDiscount: {
    fontSize: 14,
    color: "#ff3f6c",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },
  sizeButtonSelected: {
    borderColor: "#ff3f6c",
    backgroundColor: "#ffe6ec",
  },
  sizeButtonText: {
    fontSize: 14,
    color: "#333",
  },
  scrollView: {
    flexGrow: 0,
    height: 300,
    marginBottom: 16,
  },
  image: {
    height: 300,
    resizeMode: "cover",
  },
  carouselContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  productImage: {
    height: 250,
    borderRadius: 8,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#ff3f6c",
    width: 10,
    height: 10,
  },
  content: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  brand: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginTop: 4,
  },
  wishlistButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginRight: 8,
  },
  discount: {
    fontSize: 14,
    color: "#ff3f6c",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  sizeSectionWrapper: {
    padding: 16,
    backgroundColor: "#fff",
  },
  sizeTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#000",
  },
  sizeSection: {
    marginBottom: 16,
  },
  sizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  selectedSize: {
    borderColor: "#ff3f6c",
    backgroundColor: "#ffe6ec",
  },
  sizeText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  selectedSizeText: {
    color: "#ff3f6c",
    fontWeight: "700",
  },

  // Footer Add to Bag
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  addToBagButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff3f6c",
    paddingVertical: 12,
    borderRadius: 6,
  },
  addToBagText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
function addToBag(arg0: { selectedSize: string; } | { selectedSize: string; id: number; name: string; brand: string; price: string; discount: string; sizes: string[]; image: { uri: string; }; } | { selectedSize: string; id: number; name: string; brand: string; price: string; discount: string; sizes: string[]; image: string; } | { selectedSize: string; id: number; name: string; brand: string; price: string; discount: string; image: string; sizes?: undefined; }) {
  throw new Error("Function not implemented.");
}

function saveViewedProduct(product: { id: number; name: string; brand: string; price: string; discount: string; sizes: string[]; image: { uri: string; }; } | { id: number; name: string; brand: string; price: string; discount: string; sizes: string[]; image: string; } | { id: number; name: string; brand: string; price: string; sizes: string[]; image: string; discount?: undefined; } | undefined) {
  if (!product) return;

  void (async () => {
    try {
      const stored = await AsyncStorage.getItem("recentlyViewed");
      const viewedProducts: typeof product[] = stored ? JSON.parse(stored) : [];
      const updatedProducts = [
        product,
        ...viewedProducts.filter((item) => item.id !== product.id),
      ].slice(0, 20);

      await AsyncStorage.setItem(
        "recentlyViewed",
        JSON.stringify(updatedProducts)
      );
    } catch (error) {
      console.warn("Unable to save viewed product", error);
    }
  })();
}

