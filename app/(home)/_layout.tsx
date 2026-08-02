import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

/**
 * Gate for everything behind auth. `/` resolves here, so this is the app's entry decision.
 *
 * `isLoaded` is checked before `isSignedIn` — Clerk needs a moment to restore the session
 * from the token cache, and skipping it flashes the welcome screen at every cold start.
 *
 * The onboarding branch from the spec (§7) plugs in here once Convex lands:
 * signed in && !user.onboardedAt → <Redirect href="/onboarding/gender" />.
 */
export default function HomeLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/welcome" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
