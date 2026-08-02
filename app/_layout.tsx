import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '@/global.css';
// Registers `className` on the third-party components the app styles with NativeWind.
import '@/lib/nativewind';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env file');
}

// Hold the native splash until Clerk has restored the session, so a returning user
// never sees the welcome screen flash before landing on their own data.
void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) void SplashScreen.hideAsync();
  }, [isLoaded]);

  if (!isLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <GestureHandlerRootView className="flex-1">
        <StatusBar style="dark" />
        <RootNavigator />
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
