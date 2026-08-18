import { useRouter } from "expo-router";
import { useState } from "react";
import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

type LoginProps = {
  onLogin: () => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      onLogin();
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        }}
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
      <View style={styles.inputGroup}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color="#666" />
            ) : (
              <Eye size={20} color="#666" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupLink}
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.signupText}>Dont have an account ?Signup</Text>
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
    height: 150,                   // banner height
    resizeMode: "contain",         // scale image properly
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
    width: "60%",                   // input width
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",     // light background for inputs
  },
  button: {
    width: "30%",                   // button width
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
  passwordContainer: {
    flexDirection: "row",           // input + icon side by side
    alignItems: "center",           // vertically center
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    width:"60%",
  },
  eyeIcon: {
    paddingHorizontal: 10,          // spacing around the icon
  },
  // inputGroup: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   padding: 12,
  //   borderRadius: 8,
  //   marginBottom: 15,
  //   backgroundColor: "#fff",
  //   width: "60%",
  // },
  passwordInput: {
    flex: 1,                        // take full width except icon
    padding: 12,
  },
  signupLink: {
    marginTop: 20,                  // spacing above the link
    alignItems: "center",           // center the text horizontally
  },
  signupText: {
    color: "#6200ee",               // purple accent color
    fontSize: 14,                   // slightly smaller than title/subtitle
    fontWeight: "500",              // medium weight for emphasis
    textAlign: "center",            // center align text
  },
});
