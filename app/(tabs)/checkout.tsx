import React, { useCallback, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, BackHandler } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft, MapPin, CreditCard } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/utils/api";
import axios from "axios";
import RazorpayCheckout from "@/components/RazorpayCheckout";

export default function Checkout() {
  const router = useRouter();
  const [loading , setLoading] = useState(false);
  const { user, token } = useAuth();

  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null);

  // Fill the form with the user's default saved address (if they have one)
  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      axios
        .get(`${API_URL}/address/${user._id}`)
        .then((res) => {
          const saved = Array.isArray(res.data) ? res.data : [];
          const address = saved.find((a: any) => a.isDefault) || saved[0];
          if (!address) return;
          setFullName(address.fullName || "");
          setStreet(address.street || "");
          setCity(address.city || "");
          setState(address.state || "");
          setPostalCode(address.postalCode || "");
          setCountry(address.country || "");
        })
        .catch((error) => console.log("Error loading saved address:", error));
    }, [user])
  );

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!fullName.trim() || !street.trim() || !city.trim() || !state.trim() || !postalCode.trim() || !country.trim()) {
      Alert.alert("Missing address", "Please fill in your full shipping address.");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/bag/${user._id}/validate`);
      if (!data.valid) {
        Alert.alert("Some items unavailable", "Some bag items are no longer available. Please review your bag.");
        return;
      }
      if (!data.newTotal || data.newTotal <= 0) {
        Alert.alert("Your bag is empty", "Add some items to your bag before placing an order.", [
          { text: "OK", onPress: () => router.push("/bag") },
        ]);
        return;
      }

      const orderRes = await axios.post(`${API_URL}/payment/razorpay/create-order`, {
        amount: data.newTotal,
      });

      setRazorpayOrder(orderRes.data);
      setShowRazorpay(true);
    } catch (error) {
      console.error("Error starting payment:", error);
      Alert.alert("Could not start payment", "Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpaySuccess = async (data: any) => {
    setShowRazorpay(false);
    try {
      // The backend checks the Razorpay signature itself before marking the order as paid
      await axios.post(
        `${API_URL}/order/create/${user?._id}`,
        {
          shippingAddress: { street, city, state, postalCode, country },
          paymentMethod: "Razorpay",
          razorpay_order_id: data.razorpay_order_id,
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_signature: data.razorpay_signature,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/orders");
    } catch (error: any) {
      console.error("Error finishing order:", error);
      Alert.alert(
        "Order not placed",
        error?.response?.data?.message ||
          `Your payment went through but we couldn't create the order. Please contact support with payment ID ${data.razorpay_payment_id}.`
      );
    }
  };

  const handleRazorpayClose = () => {
    setShowRazorpay(false);
  };

  // Leave checkout without ordering. Checkout is a hidden tab, so a plain
  // "back" would jump to Home; send the user back to their bag instead.
  const goBackToBag = () => {
    router.navigate("/bag");
  };

  // Android's hardware back button does the same
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        goBackToBag();
        return true;
      });
      return () => sub.remove();
    }, [])
  );
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBackToBag}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
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
            <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
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
              You&apos;ll pay securely on the next screen via Razorpay (UPI or wallet).
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder} disabled={loading}>
        <Text style={styles.placeOrderText}>{loading ? "Please wait..." : "Place Order"}</Text>
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
  backButton: {
    position: "absolute",
    left: 16,
    bottom: 12,
    padding: 4,
    zIndex: 1,
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
