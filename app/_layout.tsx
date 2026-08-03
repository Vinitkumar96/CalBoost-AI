import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '@/global.css';
// Registers `className` on the third-party components the app styles with NativeWind.
import '@/lib/nativewind';
import { convex } from '@/lib/convex';
import { useRevenueCatIdentity } from '@/lib/revenuecat';
import { OnboardingHandoffProvider } from '@/stores/onboardingHandoff';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env file');
}

// Hold the native splash until Clerk has restored the session, so a returning user
// never sees the welcome screen flash before landing on their own data.
void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoaded } = useAuth();

  // Aliases the RevenueCat app user id to the Clerk id. Mounted this high because the
  // subscription has to follow the user everywhere, not just on the paywall.
  useRevenueCatIdentity();

  useEffect(() => {
    if (isLoaded) void SplashScreen.hideAsync();
  }, [isLoaded]);

  if (!isLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    // Convex sits inside Clerk because it reads the session token from it, and the handoff
    // provider sits inside Convex because it fires a mutation.
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <GestureHandlerRootView className="flex-1">
          <StatusBar style="dark" />
          <OnboardingHandoffProvider>
            <RootNavigator />
          </OnboardingHandoffProvider>
        </GestureHandlerRootView>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
