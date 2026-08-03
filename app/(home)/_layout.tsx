import { useAuth } from '@clerk/expo';
import { useQuery } from 'convex/react';
import { Redirect, Stack } from 'expo-router';

import { api } from '@/convex/_generated/api';
import { useOnboardingHandoff } from '@/stores/onboardingHandoff';

/**
 * Gate for everything behind auth. `/` resolves here, so this is the app's entry decision.
 *
 * The order of the checks is the whole design. Each one is a "not yet" that must be answered
 * before the next question is even meaningful, and every early `null` is a frame the user
 * spends on the splash rather than on a screen they will be bounced off.
 */
export default function HomeLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isFlushing } = useOnboardingHandoff();
  const user = useQuery(api.users.current);

  // Clerk needs a moment to restore the session from the token cache; skipping this flashes
  // the welcome screen at every cold start.
  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/welcome" />;

  // The handoff is mid-write. Redirecting now would race it and send a user who just finished
  // onboarding back to question one.
  if (isFlushing) return null;

  // `undefined` is Convex for "still loading", distinct from `null` for "no row".
  if (user === undefined) return null;

  // No row, or a row with no plan: they never finished. Entitlement deliberately does not
  // appear in this gate — a lapsed subscriber keeps read access to their own data and sees
  // an inline unlock prompt instead (plan.md §8.20).
  if (!user?.onboardedAt) return <Redirect href="/(onboarding)/gender" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
