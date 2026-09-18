import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },   // Header background color
        headerTintColor: "#333",                    // Back button & text color
        headerTitleStyle: { fontWeight: "bold" },   // Title font style
      }}
    />
  );
}

