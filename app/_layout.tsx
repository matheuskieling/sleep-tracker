import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { messaging } from "../src/config/firebase";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  // Handle notification tap → navigate to form screen
  useEffect(() => {
    if (loading || !user) return;

    function navigateToForm(formType: string | undefined) {
      if (formType === "morning" || formType === "noon" || formType === "evening") {
        router.push(`/form/${formType}` as any);
      }
    }

    // App was killed, opened by tapping notification
    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        // Delay to ensure auth redirect and router are fully settled
        setTimeout(() => {
          navigateToForm(remoteMessage.data?.formType);
        }, 1000);
      }
    });

    // App was in background, tapped notification
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      navigateToForm(remoteMessage.data?.formType);
    });

    return unsubscribe;
  }, [user, loading]);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </KeyboardProvider>
  );
}
