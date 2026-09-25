import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft, MapPin, ChevronRight, Package } from "lucide-react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function Orders() {
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const[isloading ,setIsLoading] = useState(true);
  const [order,setorder] = useState<any>(null);
  const { user }= useAuth();
  const fetchorder = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const product = await axios.get(`http://192.168.18.27:5000/order/user/${user._id}`);
      setorder(product.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reload orders every time the user opens this tab
  useFocusEffect(
    useCallback(() => {
      fetchorder();
    }, [user])
  );
  if (isloading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  if (!order || order.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No orders found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/bag")}>
          <ArrowLeft size={18} color="#333" />
          <Text style={styles.backButtonText}>Back to Bag</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {order.map((order: any) => (
          <View key={order._id} style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderId}>Order #{order._id}</Text>
              <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.orderStatusRow}>
              <Package />
              <Text style={styles.orderStatus}>{order.status}</Text>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Order Total</Text>
              <Text style={styles.totalAmount}>₹{order.total}</Text>
            </View>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => toggleOrderDetails(order._id)}
            >
              <Text style={styles.detailsButtonText}>
                {expandedOrder === order._id ? "Hide Details" : "View Details"}
              </Text>
              <ChevronRight size={20} color="#ff3f6c" />
            </TouchableOpacity>

            {expandedOrder === order._id && (
              <View style={styles.orderDetails}>
                {order.items.map((item: any) => (
                  <View key={item._id ?? item.productId?._id} style={styles.itemRow}>
                    <Image source={{ uri: item.productId?.images?.[0] }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.brandName}>{item.productId?.brand}</Text>
                      <Text style={styles.itemName}>{item.productId?.name}</Text>
                      <Text style={styles.itemName}>Size: {item.size}</Text>
                      <Text style={styles.price}>₹{item.price}</Text>
                    </View>
                  </View>
                ))}

                <View style={styles.shippingRow}>
                  <MapPin />
                  <Text style={styles.shippingText}>
                    {order.shippingAddress
                      ? [order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postalCode, order.shippingAddress.country]
                          .filter(Boolean)
                          .join(", ")
                      : "No shipping address"}
                  </Text>
                </View>

                <Text style={styles.paymentMethod}>Payment: {order.paymentMethod}</Text>

                <View style={styles.timeline}>
                  {order.tracking?.timeline?.map((step: any, index: number) => (
                    <View key={index} style={styles.timelineStep}>
                      <Text style={styles.timelineStatus}>{step.status}</Text>
                      {step.timestamp && (
                        <Text style={styles.timelineTime}>{new Date(step.timestamp).toLocaleString()}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
   backButtonText: {
    color: "#fff",                     // white text
    fontSize: 14,
    fontWeight: "600",
  },
   backButton: {
    backgroundColor: "#ff3f6c",        // Myntra pink
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    
  },

  header: {
  flexDirection: "row",        // arrange items horizontally
  justifyContent: "space-between",// align items to the left
  alignItems: "center",        // vertically center them
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#ddd",
  marginTop: 50,
},
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333", },
  orderCard: { margin: 12, padding: 16, borderWidth: 1, borderColor: "#eee", borderRadius: 8 },
  orderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: "600", color: "#444" },
  orderDate: { fontSize: 14, color: "#666" },
  orderStatusRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  orderStatus: { marginLeft: 8, fontSize: 14, color: "#ff3f6c", fontWeight: "600" },
  totalContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  totalLabel: { fontSize: 15, fontWeight: "500", color: "#444" },
  totalAmount: { fontSize: 16, fontWeight: "bold", color: "#333" },
  detailsButton: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  detailsButtonText: { fontSize: 14, color: "#ff3f6c", marginRight: 6 },
  orderDetails: { marginTop: 12, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 12 },
  itemRow: { flexDirection: "row", marginBottom: 12 },
  itemImage: { width: 60, height: 60, borderRadius: 6, marginRight: 10 },
  itemInfo: { flex: 1 },
  brandName: { fontSize: 15, fontWeight: "600", color: "#333" },
  itemName: { fontSize: 14, color: "#666" },
  price: { fontSize: 14, fontWeight: "bold", color: "#333" },
  shippingRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  shippingText: { marginLeft: 6, fontSize: 14, color: "#444" },
  paymentMethod: { marginTop: 8, fontSize: 13, color: "#555" },
  timeline: { marginTop: 12, paddingLeft: 8 },
  timelineStep: { marginBottom: 8 },
  timelineStatus: { fontSize: 14, fontWeight: "600", color: "#333" },
  timelineLocation: { fontSize: 13, color: "#666" },
  timelineTime: { fontSize: 12, color: "#999" },
});
