
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { ThemeProvider as AppThemeProvider } from "../context/ThemeContext";
// import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { BagProvider } from '../context/BagContext';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../context/AuthContext';
// import { Tabs } from "expo-router";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <BagProvider>
    <AppThemeProvider>
      <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)"  options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }}/>
        {/* <Stack.Screen name="(auth)" /> */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" /></AuthProvider>
    </AppThemeProvider>
    </BagProvider>
  );
}