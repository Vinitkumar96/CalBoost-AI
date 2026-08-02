import { useAuth, useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';

/**
 * Placeholder for the signed-in app. Onboarding and the 4-tab shell from the spec
 * replace this; for now it proves the session is live and lets you sign back out.
 */
export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/welcome');
  };

  return (
    // Insets are runtime device measurements, so they stay on `style`; the design's own
    // padding lives on the inner view to avoid fighting these values.
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1 px-5 pb-5 pt-6">
        <View className="flex-1 items-center justify-center gap-2">
          <Text className="text-h1 font-bold text-ink">You’re signed in</Text>
          <Text className="text-body text-ink-muted">{user?.primaryEmailAddress?.emailAddress ?? user?.id}</Text>
        </View>

        <Button label="Sign out" onPress={handleSignOut} variant="secondary" />
      </View>
    </View>
  );
}
