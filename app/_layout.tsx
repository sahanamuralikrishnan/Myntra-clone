
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { ThemeProvider as AppThemeProvider } from "../context/ThemeContext";
// import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { BagProvider } from '../context/BagContext';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../context/AuthContext';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
// import { Tabs } from "expo-router";

export const unstable_settings = {
  anchor: '(tabs)',
};

// When the user taps a notification, open the screen it is about.
// Phones only: push notifications don't exist on web.
function NotificationTapHandler() {
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!response) return;
    const data = response.notification.request.content.data as any;

    if (data?.screen === 'orders') router.push('/orders' as any);
    else if (data?.screen === 'product' && data.productId) router.push(`/product/${data.productId}` as any);
    else if (data?.screen === 'bag') router.push('/bag' as any);

    // Forget this tap so it doesn't open again the next time the app reloads
    Notifications.clearLastNotificationResponse();
  }, [response]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <BagProvider>
    <AuthProvider>
    <AppThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)"  options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }}/>
        {/* <Stack.Screen name="(auth)" /> */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
      {Platform.OS !== 'web' && <NotificationTapHandler />}
    </AppThemeProvider>
    </AuthProvider>
    </BagProvider>

  );
}