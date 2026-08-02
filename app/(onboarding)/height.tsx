import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { RulerPicker } from '@/components/onboarding/RulerPicker';
import { StepScreen } from '@/components/onboarding/StepScreen';
import { useOnboardingDraft } from '@/stores/onboarding';

export default function HeightStep() {
  const router = useRouter();
  const { heightCm, setHeightCm } = useOnboardingDraft();

  return (
    <StepScreen
      step={2}
      title={'What’s your\nheight?'}
      subtitle="We’ll use this to calculate your calorie needs."
      onNext={() => router.push('/(onboarding)/weight')}
    >
      <View className="mt-10">
        <RulerPicker
          value={heightCm}
          onChange={setHeightCm}
          min={120}
          max={220}
          step={1}
          unit="cm"
          accessibilityLabel="Height in centimetres"
        />
      </View>
    </StepScreen>
  );
}
