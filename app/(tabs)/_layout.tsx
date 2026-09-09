import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[resolvedScheme].tint,
        headerShown: false,
      }}
    >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        />
        {/* Categories tab */}
        <Tabs.Screen
          name="categories"
          options={{
            tabBarLabel: "Categories",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" color={color} size={size} /> // ✅ Search icon
            ),
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            tabBarLabel: "Wishlist",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" color={color} size={size} /> // ✅ Heart icon
            ),
          }}
        />
        <Tabs.Screen
          name="bag"
          options={{
            tabBarLabel: "Bag",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bag" color={color} size={size} /> // ✅ Bag icon
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="checkout"
          options={{
            href: null, // 🚫 hides it from the tab bar
            tabBarStyle: { display: "none" }, // optional: hides bottom bar when on checkout
          }}
        />

        <Tabs.Screen
          name="orders"
          options={{
            href: null, // 🚫 hides it from the tab bar
            tabBarStyle: { display: "none" }, // optional: hides bottom bar when on checkout
          }}
        />
      </Tabs>
   
  );
}
