import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { TOTAL_STEPS } from '@/components/onboarding/ProgressBar';
import { StepScreen } from '@/components/onboarding/StepScreen';
import { Button } from '@/components/ui/Button';
import { useSocialAuth } from '@/hooks/useSocialAuth';

/**
 * The end of onboarding: the plan exists but lives only in memory, so this is where the
 * user creates the account that will hold it.
 */
export default function SaveProgressStep() {
  const router = useRouter();
  const { signInWithApple, signInWithGoogle, pending, error } = useSocialAuth();

  return (
    // Every question is answered by now, so the bar reads as complete.
    <StepScreen step={TOTAL_STEPS} title="Save your progress">
      <View className="flex-1 justify-center gap-3">
        {error ? (
          <Text className="mb-2 text-center text-caption text-danger" accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}

        <Button
          label="Sign in with Apple"
          onPress={signInWithApple}
          loading={pending === 'apple'}
          disabled={pending !== null && pending !== 'apple'}
          icon={<Ionicons name="logo-apple" size={20} className="text-ink-inverse" />}
        />
        <Button
          label="Sign in with Google"
          onPress={signInWithGoogle}
          variant="secondary"
          loading={pending === 'google'}
          disabled={pending !== null && pending !== 'google'}
          icon={<Ionicons name="logo-google" size={20} className="text-google" />}
        />
        <Button
          label="Continue with email"
          onPress={() => router.push('/(auth)/sign-up')}
          variant="secondary"
          disabled={pending !== null}
          icon={<Ionicons name="mail-outline" size={20} className="text-ink" />}
        />
      </View>
    </StepScreen>
  );
}
