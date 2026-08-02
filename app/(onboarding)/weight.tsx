import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { RulerPicker } from '@/components/onboarding/RulerPicker';
import { StepScreen } from '@/components/onboarding/StepScreen';
import { useOnboardingDraft } from '@/stores/onboarding';

export default function WeightStep() {
  const router = useRouter();
  const { weightKg, setWeightKg } = useOnboardingDraft();

  return (
    <StepScreen
      step={3}
      title={'What’s your\ncurrent weight?'}
      subtitle="This helps us understand your starting point."
      onNext={() => router.push('/(onboarding)/target')}
    >
      <View className="mt-10">
        <RulerPicker
          value={weightKg}
          onChange={setWeightKg}
          min={30}
          max={200}
          step={0.5}
          unit="kg"
          decimals={1}
          accessibilityLabel="Current weight in kilograms"
        />
      </View>
    </StepScreen>
  );
}
