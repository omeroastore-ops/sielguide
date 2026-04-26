import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProviders } from "@/contexts/AppProviders";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#06111F" },
        animation: "fade",
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="ai" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
      <Stack.Screen name="ai-history" />
      <Stack.Screen name="place/[id]" />
      <Stack.Screen name="route/[id]" />
      <Stack.Screen name="events/index" />
      <Stack.Screen name="events/[id]" />
      <Stack.Screen name="plan-day" options={{ presentation: "modal" }} />
      <Stack.Screen name="qr-menu" options={{ presentation: "modal" }} />
      <Stack.Screen name="qr-code" />
      <Stack.Screen name="my-reviews" />
      <Stack.Screen name="menu" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="language" />
      <Stack.Screen name="auth/login" options={{ presentation: "modal" }} />
      <Stack.Screen name="auth/register" options={{ presentation: "modal" }} />
      <Stack.Screen name="settings" />
      <Stack.Screen name="business" />
      <Stack.Screen name="legal/impressum" />
      <Stack.Screen name="legal/datenschutz" />
      <Stack.Screen name="legal/agb" />
      <Stack.Screen name="legal/kontakt" />
      <Stack.Screen name="legal/konto-loeschen" />
      <Stack.Screen name="legal/cookies" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppProviders>
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#06111F" }}>
              <KeyboardProvider>
                <View style={{ flex: 1, backgroundColor: "#06111F" }}>
                  <StatusBar style="light" />
                  <RootLayoutNav />
                </View>
              </KeyboardProvider>
            </GestureHandlerRootView>
          </AppProviders>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
