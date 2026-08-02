import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { OptionCard } from '@/components/onboarding/OptionCard';
import { StepScreen } from '@/components/onboarding/StepScreen';
import { useOnboardingDraft } from '@/stores/onboarding';

export default function GenderStep() {
  const router = useRouter();
  const { gender, setGender } = useOnboardingDraft();

  return (
    <StepScreen
      step={1}
      title={'Let’s get to know\nyou better'}
      subtitle="This helps us personalize your plan and recommendations."
      onNext={() => router.push('/(onboarding)/height')}
      nextDisabled={gender === null}
    >
      <View className="mt-8 gap-4" accessibilityRole="radiogroup">
        <OptionCard label="Male" icon="male" selected={gender === 'male'} onPress={() => setGender('male')} />
        <OptionCard label="Female" icon="female" selected={gender === 'female'} onPress={() => setGender('female')} />
      </View>
    </StepScreen>
  );
}
