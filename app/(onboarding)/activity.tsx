import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ChoiceCard } from '@/components/onboarding/ChoiceCard';
import { StepScreen } from '@/components/onboarding/StepScreen';
import { ACTIVITY_OPTIONS } from '@/constants/onboarding';
import { useOnboardingDraft } from '@/stores/onboarding';

export default function ActivityStep() {
  const router = useRouter();
  const { activity, setActivity } = useOnboardingDraft();

  return (
    <StepScreen
      step={5}
      title={'How active are you\nduring the day?'}
      subtitle="This helps us estimate your daily calorie needs."
      onNext={() => router.push('/(onboarding)/experience')}
      nextDisabled={activity === null}
      scrollable
    >
      <View className="mt-6 gap-3" accessibilityRole="radiogroup">
        {ACTIVITY_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            selected={activity === option.value}
            onPress={() => setActivity(option.value)}
          />
        ))}
      </View>
    </StepScreen>
  );
}
