import { Image } from "expo-image";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import { Collapsible } from "@/components/ui/collapsible";
import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useState } from "react";
import { X, Search } from "lucide-react-native";

// data/categories.js
const categories = [
  {
    id: 1,
    name: "Men",
    subcategories: [
      "T-Shirts",
      "Shirts",
      "Jeans",
      "Trousers",
      "Suits",
      "Activewear",
    ],
    image:
      "https://th.bing.com/th/id/OIP.ozqrouXltp_EClmNtQCI_gHaG4?w=211&h=195&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",

    products: [
      {
        id: 1,
        name: "Casual White T-Shirt",
        brand: "Roadster",
        price: 499,
        discount: "60% OFF",
        image:
          "https://i.pinimg.com/originals/80/5f/c4/805fc4b6d9cca0acace82db28258defa.jpg",
      },
      {
        id: 2,
        name: "Denim Jacket",
        brand: "Levis",
        price: 2499,
        discount: "40% OFF",
        image:
          "https://th.bing.com/th/id/OIP.KFqpfKh88odMwkX17Rs3MwHaJQ?w=193&h=241&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
      },
    ],
  },
  {
    id: 2,
    name: "Women",
    subcategories: [
      "Dresses",
      "Tops",
      "Ethnic Wear",
      "Western Wear",
      "Activewear",
    ],
    image:
      "https://th.bing.com/th/id/OIP.PYK2EwkPHD4Z1BEWwWzHaAHaJQ?w=193&h=241&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",

    products: [
      {
        id: 3,
        name: "Summer Dress",
        brand: "ONLY",
        price: 299,
        discount: "50% OFF",
        image:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format&fit=crop",
      },
    ],
  },
  {
    id: 3,
    name: "Kids",
    subcategories: [
      "Boys Clothing",
      "Girls Clothing",
      "Infants",
      "Toys",
      "School Essentials",
    ],
    image:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&auto=format&fit=crop",
    products: [],
  },
  {
    id: 4,
    name: "Beauty",
    subcategories: [
      "Makeup",
      "Skincare",
      "Haircare",
      "Fragrances",
      "Personal Care",
    ],
    image:
      "https://img.freepik.com/premium-photo/beauty-product-lipstic_1295550-2692.jpg",

    products: [],
  },
  {
    id: 5,
    name: "Accessories",
    subcategories: ["Watches", "Bags", "Jewellery", "Sunglasses", "Belts"],
    image:
      "http://smileestore.com/cdn/shop/collections/Women_s_Accessories_The_Finishing_Touch_to_Every_Look.jpg?v=1746119009",

    products: [],
  },
];

export default function Categories() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null,
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };
  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
    setSearchQuery("");
  };
  const handleSubCategorySelect = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
    setSearchQuery("");
  };
  const filtercategories = categories.filter(
    (category) =>
      category.subcategories.some((subcategory) =>
        subcategory.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      category.products.some(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const selectedCategoryData = selectedCategory
    ? categories.find((cat) => cat.id === selectedCategory)
    : null;
  const renderProducts = (products: (typeof categories)[0]["products"]) => {
    return products.map((product) => (
      <TouchableOpacity
        key={product.id}
        onPress={() => router.push(`/product/${product.id}`)}
      >
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.productCard}>
          <Text style={styles.productBrand}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>{product.price}</Text>
            <Text style={styles.productDiscount}>{product.discount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery !== "" && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories List */}
      <ScrollView>
        {!selectedCategory && (
          <View>
            {filtercategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryBox}
                onPress={() => handleCategorySelect(category.id)}
              >
                <Text style={styles.categoryName}>{category.name}</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.subcategoryRow}>
                    {category.subcategories.map((subcategory, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.subcategoryBox}
                        onPress={() => handleSubCategorySelect(subcategory)}
                      >
                        <Text style={styles.subcategoryText}>{subcategory}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <Image
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {selectedCategoryData && (
          <View>
            {/* Back button */}
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.backButton}>{"< Back to Categories"}</Text>
            </TouchableOpacity>

            {/* Category title */}
            <Text style={styles.categoryTitle}>
              {selectedCategoryData.name}
            </Text>

            {/* Subcategories scroll */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.subcategoriesScroll}
            >
              {selectedCategoryData.subcategories.map((sub, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.subcategoryButton,
                    selectedSubCategory === sub && styles.selectedSubcategory,
                  ]}
                  onPress={() => handleSubCategorySelect(sub)} // ✅ Added
                >
                  <Text style={styles.subcategoryText}>{sub}</Text> // ✅ Added
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.productGrid}>
              {renderProducts(selectedCategoryData.products)}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 50,
    textAlign: "center",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: "#333",
  },
  clearButton: {
    marginLeft: 8,
  },
  categoryBox: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  backButton: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 12,
  },
  subcategoryRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  subcategoryBox: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  subcategoryText: {
    fontSize: 14,
    color: "#555",
  },
  productImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  productBrand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  productDiscount: {
    fontSize: 14,
    color: "#007AFF",
  },

  subcategoriesScroll: {
    marginVertical: 10,
  },
  subcategoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 10,
  },
  selectedSubcategory: {
    backgroundColor: "#007AFF",
  },
  productGrid: {
    flexDirection: "row", // ✅ arrange items side by side
    flexWrap: "wrap", // ✅ allow wrapping to next line
    justifyContent: "space-between", // ✅ even spacing between items
    padding: 16, // ✅ space around the grid
  },
  // subcategoryText: {
  //   color: '#333',
  //   fontSize: 14,
  // },

  
});
