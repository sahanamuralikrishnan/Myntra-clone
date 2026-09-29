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
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/utils/api";

const emptyForm = {
  label: "Home",
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export default function Addresses() {
  const router = useRouter();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/address/${user._id}`);
      setAddresses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [user]),
  );

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (address: any) => {
    setForm({
      label: address.label || "Home",
      fullName: address.fullName || "",
      phone: address.phone || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "",
    });
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!user) return;
    const { fullName, phone, street, city, state, postalCode, country } = form;
    if (!fullName || !phone || !street || !city || !state || !postalCode || !country) {
      Alert.alert("Missing details", "Please fill in every field.");
      return;
    }
    try {
      if (editingId) {
        await axios.put(`${API_URL}/address/${editingId}`, form);
      } else {
        await axios.post(`${API_URL}/address`, { ...form, userId: user._id });
      }
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      Alert.alert("Could not save address", "Please try again.");
    }
  };

  const handleDelete = (addressId: string) => {
    Alert.alert("Delete Address", "Are you sure you want to delete this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/address/${addressId}`);
            fetchAddresses();
          } catch (error) {
            console.error("Error deleting address:", error);
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await axios.post(`${API_URL}/address/${addressId}/set-default`);
      fetchAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
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
        <TouchableOpacity onPress={() => (showForm ? setShowForm(false) : router.back())}>
          <ArrowLeft size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {showForm ? (editingId ? "Edit Address" : "Add Address") : "My Addresses"}
        </Text>
      </View>

      {showForm ? (
        <ScrollView
          contentContainerStyle={styles.formScroll}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.input}
            placeholder="Label (e.g. Home, Work)"
            value={form.label}
            onChangeText={(v) => setForm({ ...form, label: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={form.fullName}
            onChangeText={(v) => setForm({ ...form, fullName: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => setForm({ ...form, phone: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Street Address"
            value={form.street}
            onChangeText={(v) => setForm({ ...form, street: v })}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City"
              value={form.city}
              onChangeText={(v) => setForm({ ...form, city: v })}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="State"
              value={form.state}
              onChangeText={(v) => setForm({ ...form, state: v })}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Postal Code"
              keyboardType="number-pad"
              value={form.postalCode}
              onChangeText={(v) => setForm({ ...form, postalCode: v })}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Country"
              value={form.country}
              onChangeText={(v) => setForm({ ...form, country: v })}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Address</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.listScroll}>
          {addresses.length === 0 ? (
            <Text style={styles.emptyText}>No saved addresses yet</Text>
          ) : (
            addresses.map((address) => (
              <View key={address._id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardLabel}>{address.label}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardName}>{address.fullName}</Text>
                <Text style={styles.cardText}>{address.phone}</Text>
                <Text style={styles.cardText}>
                  {[address.street, address.city, address.state, address.postalCode, address.country]
                    .filter(Boolean)
                    .join(", ")}
                </Text>

                <View style={styles.cardActions}>
                  {!address.isDefault && (
                    <TouchableOpacity onPress={() => handleSetDefault(address._id)}>
                      <Text style={styles.actionLink}>Set as Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => openEditForm(address)}>
                    <Pencil size={18} color="#555" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(address._id)}>
                    <Trash2 size={18} color="#555" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <TouchableOpacity style={styles.addButton} onPress={openAddForm}>
            <Plus size={20} color="#ff3f6c" />
            <Text style={styles.addButtonText}>Add New Address</Text>
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardLabel: { fontSize: 15, fontWeight: "700", color: "#222" },
  defaultBadge: {
    backgroundColor: "#ff3f6c",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  defaultBadgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  cardName: { fontSize: 14, fontWeight: "600", color: "#333", marginTop: 4 },
  cardText: { fontSize: 13, color: "#666", marginTop: 2 },
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
  saveButton: {
    backgroundColor: "#ff3f6c",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
