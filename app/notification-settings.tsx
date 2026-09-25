import React, { useCallback, useContext, useState } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeContext";
import { API_URL } from "@/utils/api";

type Preferences = Record<string, boolean>;

type Log = {
  _id: string;
  title: string;
  body: string;
  category: string;
  status: "sent" | "delivered" | "failed";
  createdAt: string;
};

// Every category the user can turn on or off
const CATEGORIES = [
  { key: "order", label: "Order confirmations", hint: "When your order is placed" },
  { key: "payment", label: "Payment updates", hint: "Payment received or due" },
  { key: "shipping", label: "Shipping progress", hint: "Shipped and in transit" },
  { key: "delivery", label: "Delivery status", hint: "Out for delivery and delivered" },
  { key: "price_drop", label: "Wishlist price drops", hint: "When a wishlist item gets cheaper" },
  { key: "back_in_stock", label: "Back in stock", hint: "When a wishlist item is available again" },
  { key: "promotion", label: "Offers & promotions", hint: "Sales and special deals" },
  { key: "abandoned_cart", label: "Bag reminders", hint: "Items left in your bag" },
];

const STATUS_COLORS = { sent: "#f0a500", delivered: "#1a9e5c", failed: "#d93025" };

export default function NotificationSettings() {
  const router = useRouter();
  const { user, token } = useAuth();
  const themeContext = useContext(ThemeContext);
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    if (!user || !token) return;
    try {
      setLoading(true);
      const [p, l] = await Promise.all([
        axios.get(`${API_URL}/notifications/preferences/${user._id}`, { headers }),
        axios.get(`${API_URL}/notifications/logs/${user._id}`, { headers }),
      ]);
      setPrefs(p.data);
      setLogs(l.data.slice(0, 10));
    } catch (error) {
      console.log("Error loading notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reload every time the screen is opened
  useFocusEffect(
    useCallback(() => {
      load();
    }, [user, token])
  );

  const toggle = async (key: string, value: boolean) => {
    if (!user || !prefs) return;
    const previous = prefs;
    setPrefs({ ...prefs, [key]: value }); // update the switch right away
    try {
      const res = await axios.put(
        `${API_URL}/notifications/preferences/${user._id}`,
        { [key]: value },
        { headers }
      );
      setPrefs(res.data);
    } catch (error) {
      setPrefs(previous); // saving failed: put the switch back
      Alert.alert("Could not save", "Please check your connection and try again.");
    }
  };

  if (!themeContext) return null;
  const { theme } = themeContext;

  if (!user) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Please log in to manage notifications</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
      </View>

      {loading && !prefs ? (
        <ActivityIndicator size="large" color="#ff3f6c" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notify me about</Text>
          {CATEGORIES.map((c) => (
            <View key={c.key} style={[styles.row, { backgroundColor: theme.card }]}>
              <View style={styles.rowText}>
                <Text style={[styles.label, { color: theme.text }]}>{c.label}</Text>
                <Text style={styles.hint}>{c.hint}</Text>
              </View>
              <Switch
                value={prefs?.[c.key] !== false}
                onValueChange={(v) => toggle(c.key, v)}
                trackColor={{ true: "#ff3f6c", false: "#ccc" }}
              />
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>
            Recent notifications
          </Text>
          {logs.length === 0 ? (
            <Text style={styles.hint}>No notifications yet</Text>
          ) : (
            logs.map((log) => (
              <View key={log._id} style={[styles.logRow, { backgroundColor: theme.card }]}>
                <View style={styles.rowText}>
                  <Text style={[styles.label, { color: theme.text }]}>{log.title}</Text>
                  <Text style={styles.hint}>{log.body}</Text>
                  <Text style={styles.time}>{new Date(log.createdAt).toLocaleString()}</Text>
                </View>
                <Text style={[styles.status, { color: STATUS_COLORS[log.status] }]}>
                  {log.status}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  logRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowText: { flex: 1, marginRight: 12 },
  label: { fontSize: 15, fontWeight: "600" },
  hint: { fontSize: 13, color: "#888", marginTop: 2 },
  time: { fontSize: 11, color: "#aaa", marginTop: 4 },
  status: { fontSize: 12, fontWeight: "700", textTransform: "uppercase" },
});
