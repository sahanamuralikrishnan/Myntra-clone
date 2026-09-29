import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft, Plus, Trash2, CreditCard } from "lucide-react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/utils/api";

// Guesses the card network from its number, using only the leading digits
// (this is the standard, public numbering scheme — not sensitive data).
function detectCardBrand(number: string): string {
  if (/^4/.test(number)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(number)) return "Mastercard";
  if (/^3[47]/.test(number)) return "Amex";
  if (/^6(?:011|5)/.test(number)) return "Discover";
  return "Card";
}

export default function Payments() {
  const router = useRouter();
  const { user } = useAuth();
  const [methods, setMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form fields. cardNumber never gets sent anywhere — it only ever lives
  // here, long enough to compute the brand + last 4 digits, then it's gone.
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState(""); // typed as "MM/YY"
  const [cardholderName, setCardholderName] = useState("");

  const fetchMethods = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/payment-methods/${user._id}`);
      setMethods(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMethods();
    }, [user]),
  );

  const resetForm = () => {
    setCardNumber("");
    setExpiry("");
    setCardholderName("");
  };

  const handleSave = async () => {
    if (!user) return;

    const digitsOnly = cardNumber.replace(/\s/g, "");
    const [monthStr, yearStr] = expiry.split("/").map((s) => s.trim());
    const month = Number(monthStr);
    const year = Number(yearStr);

    if (digitsOnly.length < 12 || !cardholderName || !monthStr || !yearStr) {
      Alert.alert("Missing details", "Please fill in the card number, expiry (MM/YY) and name.");
      return;
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      Alert.alert("Invalid expiry", "Expiry month must be between 01 and 12.");
      return;
    }

    // Derive only the safe fields — the full number never leaves this function.
    const cardBrand = detectCardBrand(digitsOnly);
    const last4 = digitsOnly.slice(-4);
    const expiryYear = year < 100 ? 2000 + year : year;

    try {
      await axios.post(`${API_URL}/payment-methods`, {
        userId: user._id,
        cardBrand,
        last4,
        expiryMonth: month,
        expiryYear,
        cardholderName,
      });
      resetForm();
      setShowForm(false);
      fetchMethods();
    } catch (error) {
      console.error("Error saving payment method:", error);
      Alert.alert("Could not save card", "Please try again.");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Remove Card", "Are you sure you want to remove this card?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/payment-methods/${id}`);
            fetchMethods();
          } catch (error) {
            console.error("Error deleting payment method:", error);
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (id: string) => {
    try {
      await axios.post(`${API_URL}/payment-methods/${id}/set-default`);
      fetchMethods();
    } catch (error) {
      console.error("Error setting default payment method:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (showForm) {
              resetForm();
              setShowForm(false);
            } else {
              router.back();
            }
          }}
        >
          <ArrowLeft size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>{showForm ? "Add Card" : "Payment Methods"}</Text>
      </View>

      {showForm ? (
        <ScrollView
          contentContainerStyle={styles.formScroll}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="number-pad"
            value={cardNumber}
            onChangeText={setCardNumber}
            maxLength={19}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Expiry (MM/YY)"
              value={expiry}
              onChangeText={setExpiry}
              maxLength={5}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Cardholder Name"
              value={cardholderName}
              onChangeText={setCardholderName}
            />
          </View>

          <Text style={styles.securityNote}>
            Your full card number is used only to detect the card type and last 4
            digits, then discarded — it is never stored.
          </Text>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Card</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.listScroll}>
          {methods.length === 0 ? (
            <Text style={styles.emptyText}>No saved payment methods yet</Text>
          ) : (
            methods.map((method) => (
              <View key={method._id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardBrandRow}>
                    <CreditCard size={20} color="#ff3f6c" />
                    <Text style={styles.cardBrand}>{method.cardBrand}</Text>
                  </View>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardNumber}>•••• •••• •••• {method.last4}</Text>
                <Text style={styles.cardText}>
                  {method.cardholderName} · Expires{" "}
                  {String(method.expiryMonth).padStart(2, "0")}/
                  {String(method.expiryYear).slice(-2)}
                </Text>

                <View style={styles.cardActions}>
                  {!method.isDefault && (
                    <TouchableOpacity onPress={() => handleSetDefault(method._id)}>
                      <Text style={styles.actionLink}>Set as Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => handleDelete(method._id)}>
                    <Trash2 size={18} color="#555" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
            <Plus size={20} color="#ff3f6c" />
            <Text style={styles.addButtonText}>Add New Card</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    marginTop: 40,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#222" },
  listScroll: { padding: 16, paddingBottom: 40 },
  formScroll: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardBrandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardBrand: { fontSize: 15, fontWeight: "700", color: "#222" },
  defaultBadge: {
    backgroundColor: "#ff3f6c",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  defaultBadgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  cardNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    letterSpacing: 1,
  },
  cardText: { fontSize: 13, color: "#666", marginTop: 4 },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 10,
  },
  actionLink: { color: "#ff3f6c", fontSize: 13, fontWeight: "600", flex: 1 },
  emptyText: { textAlign: "center", marginTop: 40, color: "#666" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#ff3f6c",
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 8,
  },
  addButtonText: { color: "#ff3f6c", fontSize: 15, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { flex: 1, marginRight: 8 },
  securityNote: {
    fontSize: 12,
    color: "#888",
    marginBottom: 16,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: "#ff3f6c",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
