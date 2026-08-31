import * as SecureStore from "expo-secure-store";
import Reacf from "react";
import { Platform } from "react-native";

export const saveuserdata = async (name: string, email: string) => {
  await SecureStore.setItemAsync("userName", name);
  await SecureStore.setItemAsync("userEmail", email);
};

export const getuserdata = async () => {
  const name = await SecureStore.getItemAsync("userName");
  const email = await SecureStore.getItemAsync("userEmail");
  return { name, email };
};

export const clearuserdata = async () => {
  await SecureStore.deleteItemAsync("userName");
  await SecureStore.deleteItemAsync("userEmail");
};
