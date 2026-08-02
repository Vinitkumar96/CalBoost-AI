import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { RulerPicker } from '@/components/onboarding/RulerPicker';
import { StepScreen } from '@/components/onboarding/StepScreen';
import { useOnboardingDraft } from '@/stores/onboarding';

export default function TargetStep() {
  const router = useRouter();
  const { weightKg, targetWeightKg, setTargetWeightKg } = useOnboardingDraft();

  // CalBoost only does bulks, so a target at or below the current weight is not a goal we
  // can build a plan for — say so plainly rather than silently computing a deficit.
  const isCut = targetWeightKg <= weightKg;

  return (
    <StepScreen
      step={4}
      title={'What’s your\ngoal weight?'}
      subtitle="Where do you want to be?"
      onNext={() => router.push('/(onboarding)/activity')}
      nextDisabled={isCut}
    >
      <View className="mt-10">
        <RulerPicker
          value={targetWeightKg}
          onChange={setTargetWeightKg}
          min={30}
          max={200}
          step={0.5}
          unit="kg"
          decimals={1}
          accessibilityLabel="Goal weight in kilograms"
        />

        {isCut ? (
          <Text className="mt-6 text-center text-caption text-danger" accessibilityLiveRegion="polite">
            CalBoost is built for gaining weight — set a goal above your current {weightKg.toFixed(1)} kg.
          </Text>
        ) : null}
      </View>
    </StepScreen>
  );
}
