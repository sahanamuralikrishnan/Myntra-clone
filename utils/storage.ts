import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveuserdata = async (name: string, email: string) => {
  await AsyncStorage.setItem("userName", String(name));
  await AsyncStorage.setItem("userEmail", String(email));
};

export const getuserdata = async () => {
  const name = await AsyncStorage.getItem("userName");
  const email = await AsyncStorage.getItem("userEmail");
  return { name: name ?? "", email: email ?? "" };
};

export const clearuserdata = async () => {
  await AsyncStorage.removeItem("userName");
  await AsyncStorage.removeItem("userEmail");
};
;






























// import * as SecureStore from "expo-secure-store";
// import { Platform } from "react-native";

// const getStorageValue = async (key: string) => {
//   if (Platform.OS === "web") {
//     return localStorage.getItem(key);
//   }

//   return SecureStore.getItemAsync(key);
// };

// const setStorageValue = async (key: string, value: string) => {
//   if (Platform.OS === "web") {
//     localStorage.setItem(key, value);
//     return;
//   }

//   await SecureStore.setItemAsync(key, value);
// };

// const removeStorageValue = async (key: string) => {
//   if (Platform.OS === "web") {
//     localStorage.removeItem(key);
//     return;
//   }

//   await SecureStore.deleteItemAsync(key);
// };



