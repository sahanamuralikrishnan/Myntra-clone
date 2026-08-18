import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, MapPin, ChevronRight, Package } from "lucide-react-native";

const orders = [
  {
    id: "ORD123456",
    date: "07 Mar 2024",
    status: "Delivered",
    total: 3499,
    items: [
      {
        id: "p1",
        brand: "Nike",
        name: "Air Max Sneakers",
        size: "9",
        price: 3499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=cropg",
      },
    ],
    shippingAddress: "123 Main Street, Apt 4B, New York, NY 10001",
    paymentMethod: "Credit Card ending in 4242",
    tracking: {
      number: "TRK/89012345",
      carrier: "FedEx",
      estimatedDelivery: "15 Mar 2024",
      currentLocation: "New York City Hub",
      status: "Delivered",
      timeline: [
        { status: "Delivered", location: "New York, NY", timestamp: "15 Mar 2024, 14:30" },
        { status: "Out for Delivery", location: "New York City Hub", timestamp: "15 Mar 2024, 09:15" },
        { status: "Arrived at Delivery Facility", location: "New York Distribution Center", timestamp: "14 Mar 2024, 23:45" },
        { status: "Order Shipped", location: "New Jersey Warehouse", timestamp: "13 Mar 2024, 16:20" },
        { status: "Order Confirmed", location: "Online", timestamp: "12 Mar 2024, 10:00" },
      ],
    },
  },
  {
    id: "ORD123457",
    date: "10 Mar 2024",
    status: "Delivered",
    total: 1999,
    items: [
      {
        id: "p2",
        brand: "ONLY",
        name: "Men's jean",
        size: "S",
        price: 1999,
        image: "https://media.istockphoto.com/id/1132154377/photo/jeans.webp?b=1&s=170667a&w=0&k=20&c=tZASI7kn4G8LG-XQnu4i4yxDy_Ix-3G-SKUzWV9qa-w=",
      },
    ],
    shippingAddress: "456 Park Avenue, Apt 12C, New York, NY 10022",
    paymentMethod: "UPI Payment",
    tracking: {
      number: "TRK/56789012",
      carrier: "DHL",
      estimatedDelivery: "18 Mar 2024",
      currentLocation: "New Jersey Warehouse",
      status: "Delivered",
      timeline: [
        { status: "Delivered", location: "New York, NY", timestamp: "18 Mar 2024, 12:00" },
        { status: "Out for Delivery", location: "New Jersey Warehouse", timestamp: "18 Mar 2024, 08:30" },
        { status: "Order Confirmed", location: "Online", timestamp: "10 Mar 2024, 09:30" },
      ],
    },
  },

  {
    id: "ORD123458",
    date: "07 Mar 2024",
    status: "Delivered",
    total: 2499,
    items: [
      {
        id: "p1",
        brand: "Sneakers",
        name: "Adidas",
        size: "9",
        price: 2499,
        image: "https://th.bing.com/th/id/OIP.b_9hj8vi9AJeqLysj2UJXgHaE8?w=193&h=129&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
      },
    ],
    shippingAddress: "123 Main Street, Apt 4B, New York, NY 10001",
    paymentMethod: "Credit Card ending in 4242",
    tracking: {
      number: "TRK/89012345",
      carrier: "FedEx",
      estimatedDelivery: "15 Mar 2024",
      currentLocation: "New York City Hub",
      status: "Delivered",
      timeline: [
        { status: "Delivered", location: "New York, NY", timestamp: "15 Mar 2024, 14:30" },
        { status: "Out for Delivery", location: "New York City Hub", timestamp: "15 Mar 2024, 09:15" },
        { status: "Arrived at Delivery Facility", location: "New York Distribution Center", timestamp: "14 Mar 2024, 23:45" },
        { status: "Order Shipped", location: "New Jersey Warehouse", timestamp: "13 Mar 2024, 16:20" },
        { status: "Order Confirmed", location: "Online", timestamp: "12 Mar 2024, 10:00" },
      ],
    },
  },
];

export default function Orders() {
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

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
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
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
              onPress={() => toggleOrderDetails(order.id)}
            >
              <Text style={styles.detailsButtonText}>
                {expandedOrder === order.id ? "Hide Details" : "View Details"}
              </Text>
              <ChevronRight size={20} color="#ff3f6c" />
            </TouchableOpacity>

            {expandedOrder === order.id && (
              <View style={styles.orderDetails}>
                {order.items.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.brandName}>{item.brand}</Text>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemName}>Size: {item.size}</Text>
                      <Text style={styles.price}>₹{item.price}</Text>
                    </View>
                  </View>
                ))}

                <View style={styles.shippingRow}>
                  <MapPin />
                  <Text style={styles.shippingText}>{order.shippingAddress}</Text>
                </View>

                <Text style={styles.paymentMethod}>Payment: {order.paymentMethod}</Text>

                <View style={styles.timeline}>
                  {order.tracking.timeline.map((step, index) => (
                    <View key={index} style={styles.timelineStep}>
                      <Text style={styles.timelineStatus}>{step.status}</Text>
                      <Text style={styles.timelineLocation}>{step.location}</Text>
                      {step.timestamp && <Text style={styles.timelineTime}>{step.timestamp}</Text>}
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
