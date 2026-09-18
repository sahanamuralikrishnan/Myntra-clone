import { useRouter } from "expo-router";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronRight,
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  User,
} from "lucide-react-native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme, setTheme } = themeContext;
  const menuItems = [
    { icon: Package, label: "Orders", route: "/orders" },
    { icon: Heart, label: "Wishlist", route: "/wishlist" },
    { icon: CreditCard, label: "Payment Methods", route: "/payments" },
    { icon: MapPin, label: "Addresses", route: "/addresses" },
    { icon: Settings, label: "Payment Settings", route: "/settings" },
  ];
  const handleLogout = () => {
    logout();
    router.replace("/");
  };
   if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.userIcon}>👤</Text>
          <Text style={styles.emptyTitle}>
            Please login to view your profile
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
       <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>

  <ScrollView
  style={styles.content}
  contentContainerStyle={{ alignItems: "center" }}
>
  <View style={styles.userInfo}>
    {/* Avatar Circle */}
    <View style={styles.avatar}>
      <User size={32} color="#fff" />
    </View>

    {/* User Details BELOW avatar */}
    <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: theme.text }]}>{user?.name}</Text>
      <Text style={[styles.email, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">
        {user?.email}
      </Text>
    </View>
  </View>
        {menuItems.map((item) => (
                    <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, { backgroundColor: theme.card }]}
                        onPress={() => router.push(item.route as any)}
          >
            <View style={styles.menuItemLeft}>
              <item.icon size={24} color={theme.text} />
              <Text style={[styles.menuItemLabel, { color: theme.text }]}>{item.label}</Text>
            </View>
            <ChevronRight size={24} color={theme.text} />
          </TouchableOpacity>
        ))}
                      <View style={[styles.menuItem, { backgroundColor: theme.card }]}>
          <Text style={[styles.menuItemLabel, { color: theme.text }]}>Theme</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["light", "dark", "festive"] as const).map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setTheme(option)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  backgroundColor: option === "light" ? "#eee" : option === "dark" ? "#333" : "#ffe4f0",
                }}
              >
                <Text style={{ color: option === "dark" ? "#fff" : "#333", fontSize: 12 }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color="#ff3f6c" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // light background for mobile
    
  },
  header: {
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // subtle divider
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    // textAlign: "center",
    color: "#333",
    marginTop: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
     flexGrow: 1,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userInfo: {
     flexDirection: "row",      // places avatar left, details right
  alignItems: "center",      // vertically aligned
  paddingHorizontal: 16,
  marginTop: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ff3f6c",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  userDetails: {
     alignItems: "center",
    marginTop: 8,
  },
  userName: {
   fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    maxWidth: "90%", // keeps text within screen width
    textAlign: "center", // centers under name
  },
  userIcon: {
     fontSize: 64,
    marginBottom: 16,
    color: "#007AFF",           // blue icon to match tab highlight
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 12,
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    width: "80%", // mobile-friendly width
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  menuItem: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 12,
    alignSelf: "center", // keeps items centered on mobile
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
       marginBottom: 30,  
    width: "90%",
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: "#ff3f6c",     // pink border
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",   // centers icon + text
    alignItems: "center",
    alignSelf: "center",     
  },
  logoutButtonText: {
     color: "#ff3f6c",           // pink text
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft :8
  },
});
