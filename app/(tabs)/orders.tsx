import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft, MapPin, ChevronRight, Package } from "lucide-react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/utils/api";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

const PAGE_SIZE = 5;

export default function Orders() {
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isloading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [order, setorder] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const STATUS_FILTERS = ["All", "Processing", "Shipped", "In Transit", "Out for Delivery", "Delivered", "Cancelled", "Returned"];
  const { user, token } = useAuth();

  const headers = { Authorization: `Bearer ${token}` };

  const fetchorder = async (pageToLoad: number, append: boolean) => {
    if (!user || !token) return;
    try {
      append ? setIsLoadingMore(true) : setIsLoading(true);
      const statusParam = statusFilter ? `&status=${statusFilter}` : "";
      const res = await axios.get(
        `${API_URL}/order/user/${user._id}?page=${pageToLoad}&limit=${PAGE_SIZE}${statusParam}`,
        { headers },
      );
      const { orders, page: currentPage, totalPages: pages } = res.data;
      setorder((prev) => (append ? [...prev, ...orders] : orders));
      setPage(currentPage);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      append ? setIsLoadingMore(false) : setIsLoading(false);
    }
  };

  // Reload orders every time the user opens this tab
  useFocusEffect(
    useCallback(() => {
      fetchorder(1, false);
    }, [user, token, statusFilter]),
  );

  const loadMore = () => {
    if (page < totalPages && !isLoadingMore) {
      fetchorder(page + 1, true);
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const cancelOrder = (orderId: string) => {
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.post(
              `${API_URL}/order/${orderId}/cancel`,
              { reason: "Cancelled by user" },
              { headers },
            );
            fetchorder(1, false);
          } catch (error: any) {
            Alert.alert(
              "Could not cancel",
              error.response?.data?.message || "Please try again",
            );
          }
        },
      },
    ]);
  };

  const requestReturn = (orderId: string) => {
    Alert.alert("Request Return", "Request a return for this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Request Return",
        onPress: async () => {
          try {
            await axios.post(
              `${API_URL}/order/${orderId}/return`,
              { reason: "Return requested by user" },
              { headers },
            );
            fetchorder(1, false);
          } catch (error: any) {
            Alert.alert(
              "Could not request return",
              error.response?.data?.message || "Please try again",
            );
          }
        },
      },
    ]);
  };

  const reorder = async (orderId: string) => {
    try {
      const res = await axios.post(
        `${API_URL}/order/${orderId}/reorder`,
        {},
        { headers },
      );
      const { added, skipped } = res.data;
      const skippedText = skipped.length
        ? ` ${skipped.length} item(s) are no longer available.`
        : "";
      Alert.alert(
        "Added to bag",
        `${added.length} item(s) added to your bag.${skippedText}`,
      );
    } catch (error: any) {
      Alert.alert(
        "Could not reorder",
        error.response?.data?.message || "Please try again",
      );
    }
  };
  const downloadInvoice = async (orderId: string) => {
    try {
      const fileUri = FileSystem.documentDirectory! + `invoice-${orderId}.pdf`;
      const { uri } = await FileSystem.downloadAsync(
        `${API_URL}/order/${orderId}/invoice`,
        fileUri,
        { headers },
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Downloaded", `Invoice saved to ${uri}`);
      }
    } catch {
      Alert.alert("Could not download invoice", "Please try again");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/bag")}
        >
          <ArrowLeft size={18} color="#333" />
          <Text style={styles.backButtonText}>Back to Bag</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterRowContent}
      >
        {STATUS_FILTERS.map((status) => {
          const isActive = status === "All" ? !statusFilter : statusFilter === status;
          return (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setStatusFilter(status === "All" ? "" : status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {isloading ? (
        <ActivityIndicator size="large" color="#ff3f6c" style={{ marginTop: 40 }} />
      ) : !order || order.length === 0 ? (
        <Text style={styles.emptyText}>No orders found</Text>
      ) : (
      <ScrollView>
        {order.map((order: any) => (
          <View key={order._id} style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderId}>Order #{order._id}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.date).toLocaleDateString()}
              </Text>
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
                  <View
                    key={item._id ?? item.productId?._id}
                    style={styles.itemRow}
                  >
                    <Image
                      source={{ uri: item.productId?.images?.[0] }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemInfo}>
                      <Text style={styles.brandName}>
                        {item.productId?.brand}
                      </Text>
                      <Text style={styles.itemName}>
                        {item.productId?.name}
                      </Text>
                      <Text style={styles.itemName}>Size: {item.size}</Text>
                      <Text style={styles.price}>₹{item.price}</Text>
                    </View>
                  </View>
                ))}

                <View style={styles.shippingRow}>
                  <MapPin />
                  <Text style={styles.shippingText}>
                    {order.shippingAddress
                      ? [
                          order.shippingAddress.street,
                          order.shippingAddress.city,
                          order.shippingAddress.state,
                          order.shippingAddress.postalCode,
                          order.shippingAddress.country,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      : "No shipping address"}
                  </Text>
                </View>

                <Text style={styles.paymentMethod}>
                  Payment: {order.paymentMethod}
                </Text>

                <View style={styles.timeline}>
                  {order.tracking?.timeline?.map((step: any, index: number) => (
                    <View key={index} style={styles.timelineStep}>
                      <Text style={styles.timelineStatus}>{step.status}</Text>
                      {step.timestamp && (
                        <Text style={styles.timelineTime}>
                          {new Date(step.timestamp).toLocaleString()}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>

                <View style={styles.actionsRow}>
                  {order.status === "Processing" && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => cancelOrder(order._id)}
                    >
                      <Text style={styles.actionButtonText}>Cancel Order</Text>
                    </TouchableOpacity>
                  )}
                  {order.status === "Delivered" && !order.returnRequest && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => requestReturn(order._id)}
                    >
                      <Text style={styles.actionButtonText}>
                        Request Return
                      </Text>
                    </TouchableOpacity>
                  )}
                  {order.returnRequest && (
                    <Text style={styles.returnStatus}>
                      Return: {order.returnRequest.status}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => reorder(order._id)}
                  >
                    <Text style={styles.actionButtonText}>Reorder</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => downloadInvoice(order._id)}
                  >
                    <Text style={styles.actionButtonText}>
                      Download Invoice
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}

        {page < totalPages && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <ActivityIndicator size="small" color="#ff3f6c" />
            ) : (
              <Text style={styles.loadMoreText}>Load More</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButtonText: {
    color: "#fff", // white text
    fontSize: 14,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#ff3f6c", // Myntra pink
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  header: {
    flexDirection: "row", // arrange items horizontally
    justifyContent: "space-between", // align items to the left
    alignItems: "center", // vertically center them
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 50,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  filterRow: {
    height: 52,
    paddingHorizontal: 12,
    flexGrow: 0,
  },
  filterRowContent: { alignItems: "center" },
  filterChip: {
    borderWidth: 1,
    borderColor: "#ff3f6c",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: "#ff3f6c" },
  filterChipText: { color: "#ff3f6c", fontSize: 13, fontWeight: "600" },
  filterChipTextActive: { color: "#fff" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#666", fontSize: 15 },
  orderCard: {
    margin: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: { fontSize: 16, fontWeight: "600", color: "#444" },
  orderDate: { fontSize: 14, color: "#666" },
  orderStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  orderStatus: {
    marginLeft: 8,
    fontSize: 14,
    color: "#ff3f6c",
    fontWeight: "600",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  totalLabel: { fontSize: 15, fontWeight: "500", color: "#444" },
  totalAmount: { fontSize: 16, fontWeight: "bold", color: "#333" },
  detailsButton: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  detailsButtonText: { fontSize: 14, color: "#ff3f6c", marginRight: 6 },
  orderDetails: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
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
  actionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  actionButton: {
    borderWidth: 1,
    borderColor: "#ff3f6c",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  actionButtonText: { color: "#ff3f6c", fontSize: 13, fontWeight: "600" },
  returnStatus: { fontSize: 13, color: "#666", alignSelf: "center" },
  loadMoreButton: { alignItems: "center", padding: 16 },
  loadMoreText: { color: "#ff3f6c", fontWeight: "600" },
});
