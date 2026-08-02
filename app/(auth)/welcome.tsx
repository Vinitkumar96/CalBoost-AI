import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthSheet } from '@/components/auth/AuthSheet';
import { Button } from '@/components/ui/Button';

type Mode = 'sign-in' | 'sign-up';

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetMode, setSheetMode] = useState<Mode | null>(null);

  const openSheet = (mode: Mode) => setSheetMode(mode);
  const closeSheet = () => setSheetMode(null);

  const continueWithEmail = () => {
    const mode = sheetMode;
    closeSheet();
    router.push(mode === 'sign-in' ? '/(auth)/sign-in' : '/(auth)/sign-up');
  };

  return (
    // Insets are runtime device measurements, so they stay on `style`; the design's own
    // padding lives on the inner view to avoid fighting these values.
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1 px-5 pb-5 pt-8">
        <View className="flex-row items-center justify-center gap-2">
          <Image source={require('@/assets/images/logo-black.png')} className="h-10 w-10" contentFit="contain" />
          <Text className="text-h1 font-bold text-ink">CalBoost AI</Text>
        </View>

        <Image
          source={require('@/assets/images/mobile-image.png')}
          className="flex-1  w-full "
         contentFit="contain"
          accessibilityLabel="Scanning a meal with the CalBoost camera"
        />

        <View className="items-center gap-4">
          <Text className="text-center text-display font-bold text-ink">Calorie tracking{'\n'}made easy</Text>

          {/* New users answer the onboarding questions first and create their account at
              the end; only returning users go straight to the auth sheet. */}
          <Button label="Get Started" onPress={() => router.push('/(onboarding)/gender')} />

          <Pressable
            onPress={() => openSheet('sign-in')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Sign in to an existing account"
          >
            <Text className="text-body text-ink-muted">
              Already have an account? <Text className="font-semibold text-ink">Sign In</Text>
            </Text>
          </Pressable>
        </View>
      </View>

      <AuthSheet
        visible={sheetMode !== null}
        mode={sheetMode ?? 'sign-up'}
        onClose={closeSheet}
        onContinueWithEmail={continueWithEmail}
      />
    </View>
  );
}
