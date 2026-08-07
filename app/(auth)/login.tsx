import { useRouter } from "expo-router";
import { useState } from "react";
import React from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (email && password) {
      global.isAuthenticated = true;
      router.replace("/");
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" }} 
        style={styles.image}
      />
      <Text style={styles.title}>WELCOME TO MYNTRA</Text>
      <Text style={styles.subtitle}>LOGIN CONTINUE TO SHOPPING</Text>

      <TextInput 
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff",       // full screen white background
    justifyContent: "center",      // center vertically
    alignItems: "center",          // center horizontally
    paddingHorizontal: 20,         // side padding
  },
  image: { 
    width: "250%", 
    height: 150,                   // bigger banner
    resizeMode: "contain",           // scale image properly
    marginBottom: 20, 
    borderRadius: 8,               // rounded corners
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 8, 
    color: "#333", 
  },
  subtitle: { 
    fontSize: 16, 
    textAlign: "center", 
    marginBottom: 20, 
    color: "#666", 
  },
  input: { 
    width: "60%",                 // stretch across screen
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 12, 
    backgroundColor: "#f9f9f9",    // light background for inputs
  },
  button: { 
    width: "30%",                 // full width button
    backgroundColor: "#6200ee", 
    paddingVertical: 15, 
    borderRadius: 10, 
    marginTop: 10, 
  },
  buttonText: { 
    color: "#fff", 
    textAlign: "center", 
    fontWeight: "bold", 
    fontSize: 15, 
  },
});

