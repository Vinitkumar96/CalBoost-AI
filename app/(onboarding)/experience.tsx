import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ChoiceCard } from '@/components/onboarding/ChoiceCard';
import { StepScreen } from '@/components/onboarding/StepScreen';
import { EXPERIENCE_OPTIONS } from '@/constants/onboarding';
import { useOnboardingDraft } from '@/stores/onboarding';

export default function ExperienceStep() {
  const router = useRouter();
  const { experience, setExperience } = useOnboardingDraft();

  return (
    <StepScreen
      step={6}
      title={'What’s your gym\nexperience?'}
      subtitle="This helps us tailor your plan to you."
      onNext={() => router.push('/(onboarding)/goal')}
      nextDisabled={experience === null}
      scrollable
    >
      <View className="mt-6 gap-3" accessibilityRole="radiogroup">
        {EXPERIENCE_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            selected={experience === option.value}
            onPress={() => setExperience(option.value)}
          />
        ))}
      </View>
    </StepScreen>
  );
}
