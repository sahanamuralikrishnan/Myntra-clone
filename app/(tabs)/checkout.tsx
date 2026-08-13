import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MapPin, CreditCard } from "lucide-react-native";

export default function Checkout() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("shipping");

  const handlePlaceOrder = () => {
    router.push("/orders");
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
            <TextInput style={styles.input} placeholder="Address Line 1" defaultValue="123 Main Street" />
            <TextInput style={styles.input} placeholder="Address Line 2" defaultValue="Apt 4B" />
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.halfInput]} placeholder="City" defaultValue="New York" />
              <TextInput style={[styles.input, styles.halfInput]} placeholder="State" defaultValue="NY" />
            </View>
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.halfInput]} placeholder="Postal Code" defaultValue="10001" />
              <TextInput style={[styles.input, styles.halfInput]} placeholder="Country" defaultValue="United States" />
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
            <TextInput style={styles.input} placeholder="Card Number" defaultValue="**** **** **** 4242" />
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.halfInput]} placeholder="Expiry Date" defaultValue="12/25" />
              <TextInput style={[styles.input, styles.halfInput]} placeholder="CVV" defaultValue="***" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>
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
