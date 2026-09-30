import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MapPin, CreditCard } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/utils/api";
import axios from "axios";
import RazorpayCheckout from "@/components/RazorpayCheckout";

export default function Checkout() {
  const router = useRouter();
  const [loading , setLoading] = useState(false);
  const {user} = useAuth();
  const [activeSection, setActiveSection] = useState("shipping");

  const [street, setStreet] = useState("123 Main Street, Apt 4B");
  const [city, setCity] = useState("New York");
  const [state, setState] = useState("NY");
  const [postalCode, setPostalCode] = useState("10001");
  const [country, setCountry] = useState("United States");
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null);

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const { data } = await axios.get(`${API_URL}/bag/${user._id}/validate`);
      if (!data.valid) {
        console.error("Some bag items are no longer available");
        return;
      }

      const orderRes = await axios.post(`${API_URL}/payment/razorpay/create-order`, {
        amount: data.newTotal,
      });

      setRazorpayOrder(orderRes.data);
      setShowRazorpay(true);
    } catch (error) {
      console.error("Error starting payment:", error);
    }
  };

  const handleRazorpaySuccess = async (data: any) => {
    setShowRazorpay(false);
    try {
      const verifyRes = await axios.post(`${API_URL}/payment/razorpay/verify`, data);
      if (!verifyRes.data.verified) {
        console.error("Payment verification failed");
        return;
      }

      await axios.post(`${API_URL}/order/create/${user?._id}`, {
        shippingAddress: { street, city, state, postalCode, country },
        paymentMethod: "Razorpay",
        paymentStatus: "paid",
        razorpayPaymentId: data.razorpay_payment_id,
      });
      router.push("/orders");
    } catch (error) {
      console.error("Error finishing order:", error);
    }
  };

  const handleRazorpayClose = () => {
    setShowRazorpay(false);
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Shipping Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={24} color="#ff3f6c" />
            <Text style={styles.sectionTitle}>Shipping Address</Text>
          </View>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Full Name" defaultValue="John Doe" />
            <TextInput style={styles.input} placeholder="Address Line 1" value={street} onChangeText={setStreet} />
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.halfInput]} placeholder="City" value={city} onChangeText={setCity} />
              <TextInput style={[styles.input, styles.halfInput]} placeholder="State" value={state} onChangeText={setState} />
            </View>
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.halfInput]} placeholder="Postal Code" value={postalCode} onChangeText={setPostalCode} />
              <TextInput style={[styles.input, styles.halfInput]} placeholder="Country" value={country} onChangeText={setCountry} />
            </View>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={24} color="#ff3f6c" />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          <View style={styles.form}>
            <Text style={styles.paymentNote}>
              You'll enter your card details securely on the next screen via Razorpay.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>

      {razorpayOrder && (
        <RazorpayCheckout
          visible={showRazorpay}
          keyId={razorpayOrder.keyId}
          razorpayOrderId={razorpayOrder.razorpayOrderId}
          amount={razorpayOrder.amount}
          name={user?.name || "Guest"}
          email={user?.email || ""}
          onSuccess={handleRazorpaySuccess}
          onClose={handleRazorpayClose}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  header: {
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginLeft: 8,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  paymentNote: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  placeOrderButton: {
    marginBottom: 24,
    width: "90%",
    paddingVertical: 14,
    backgroundColor: "#ff3f6c",
    borderRadius: 8,
    alignSelf: "center",
    alignItems: "center",
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
