import { Stack } from 'expo-router';

import { OnboardingProvider } from '@/stores/onboarding';

/**
 * Gender anchors the flow. Without this, landing directly on a deeper step (a dev-client
 * reload on `/onboarding/weight`, a deep link) mounts that screen as the *only* route, so
 * the back arrow has nothing to return to.
 */
export const unstable_settings = {
  initialRouteName: 'gender',
};

export default function OnboardingLayout() {
  return (
    // The draft lives at the layout so every step reads and writes the same answers, and
    // the whole thing is discarded the moment the user leaves the flow.
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </OnboardingProvider>
  );
}
