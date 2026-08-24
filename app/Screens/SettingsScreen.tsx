import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {  ThemeContext } from "@/app/context/ThemeContext";


export default function SettingsScreen () {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const {theme , setTheme} = themeContext

return (
  <View style={[styles.container, { backgroundColor: theme.background }]}>
    <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
    <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>

<TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={() => setTheme("light")}>
        <Text style={{ color: theme.text }}>🌞 Light Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={() => setTheme("dark")}>
        <Text style={{ color: theme.text }}>🌙 Dark Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.option, { backgroundColor: theme.card }]} onPress={() => setTheme("festive")}>
        <Text style={{ color: theme.text }}>🌸 Festive Mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  option: { padding: 12, borderRadius: 8, marginBottom: 12 },
});