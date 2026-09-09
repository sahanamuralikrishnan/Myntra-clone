import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";

export default function signup() {
  const { signup } = useAuth();
  const router = useRouter();
  const [isloading, setisloading] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // State for errors
  const [error, setError] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  //   // Handle input changes
  //   const handleChange = (field, value) => {
  //     setFormData({ ...formData, [field]: value });
  //   };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullname: "", email: "", password: "" };

    if (!formData.fullName.trim()) {
      newErrors.fullname = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  };

  // Handle signup
  const handlesignup = async () => {
    if (validateForm()) {
      try {
        setisloading(true);
        await signup(formData.fullName, formData.email, formData.password);
        router.replace("/(tabs)");
      } catch (error) {
        console.error("Signup error:", error);
        
      } finally {
        setisloading(false);
      }
      router.replace("/(tabs)");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Background image */}
      <Image
        source={{
          uri: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1206&h=800",
        }}
        style={styles.backgroundImage}
      />

      {/* Form container */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join Myntra and discover amazing fashion
        </Text>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, error.fullname && styles.inputError]}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) =>
              setFormData({ ...formData, fullName: text })
            }
          />
          {error.fullname ? (
            <Text style={styles.errorText}>{error.fullname}</Text>
          ) : null}
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, error.email && styles.inputError]}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error.email ? (
            <Text style={styles.errorText}>{error.email}</Text>
          ) : null}
        </View>

        {/* Password with toggle */}
        <View style={styles.inputGroup}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
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
          {error.password ? (
            <Text style={styles.errorText}>{error.password}</Text>
          ) : null}
        </View>
        {/* Signup button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handlesignup}
          disabled={isloading}
        >
          {isloading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Signup</Text>
          )}
        </TouchableOpacity>

        {/* Back to login link */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.signupText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  backgroundImage: { position: "absolute", width: "100%", height: "100%" },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    margin: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  inputGroup: { marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "red" },
  errorText: { color: "red", marginTop: 5 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  passwordInput: { flex: 1, padding: 12 },
  eyeIcon: { paddingHorizontal: 10 },
  button: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  loginLink: { marginTop: 20 },
  signupText: { textAlign: "center", color: "#6200ee" },
});
