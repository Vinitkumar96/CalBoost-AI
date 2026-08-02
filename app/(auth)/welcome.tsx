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
      <View className="flex-1 px-5 pb-5 pt-4">
        <View className="flex-row items-center justify-center gap-2">
          <Image source={require('@/assets/images/logo-black.png')} className="h-10 w-10" contentFit="contain" />
          <Text className="text-h1 font-bold text-ink">CalBoost AI</Text>
        </View>

        <Image
          source={require('@/assets/images/mobile-image.png')}
          className="my-4 w-full flex-1"
          contentFit="contain"
          accessibilityLabel="Scanning a meal with the CalBoost camera"
        />

        <View className="items-center gap-4">
          <Text className="text-center text-display font-bold text-ink">Calorie tracking{'\n'}made easy</Text>

          <Button label="Get Started" onPress={() => openSheet('sign-up')} />

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
