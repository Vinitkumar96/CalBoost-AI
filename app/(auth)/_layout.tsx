import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

/**
 * Welcome is the anchor of the auth stack. Without this, landing directly on a deeper
 * screen (a web reload on `/verify`, a deep link, restored dev-client state) mounts that
 * screen as the *only* route, so there is no welcome underneath to go back to.
 */
export const unstable_settings = {
  initialRouteName: 'welcome',
};

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/(home)" />;

  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
