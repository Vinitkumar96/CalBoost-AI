import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

/**
 * The paywall sits behind auth: the purchase has to attach to a known user, or the
 * entitlement has nowhere to land.
 *
 * Swipe-back is off because the flow's own back arrows already handle it, and a half-completed
 * gesture on the plan screen mid-purchase is a way to lose a transaction.
 */
export default function PaywallLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/welcome" />;

  return <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />;
}
