import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { StepScreen } from '@/components/onboarding/StepScreen';
import { TOTAL_STEPS } from '@/components/onboarding/ProgressBar';
import { useOnboardingDraft } from '@/stores/onboarding';

type Feature = {
  label: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const FEATURES: Feature[] = [
  { label: 'Calorie Tracking', description: 'Track effortlessly and stay on target', icon: 'target' },
  { label: 'AI Food Scanner', description: 'Scan meals and get instant nutrition', icon: 'line-scan' },
  { label: 'High Calorie Recipes', description: 'Easy, delicious meals to fuel gains', icon: 'chef-hat' },
  { label: 'Progress Tracking', description: 'Monitor your progress and stay motivated', icon: 'chart-line' },
  { label: 'Smart Reminders', description: 'Daily reminders to keep you consistent', icon: 'bell-outline' },
];

export default function PlanPreviewStep() {
  const router = useRouter();
  const { targetWeightKg } = useOnboardingDraft();

  return (
    <StepScreen
      // Every question is answered by the time this screen shows, so the bar reads as full.
      step={TOTAL_STEPS}
      title={'Here’s what your\nplan includes'}
      subtitle={`Your personalized plan to help you reach ${targetWeightKg.toFixed(1)} kg.`}
      nextLabel="Continue"
      onNext={() => router.push('/(onboarding)/save')}
      scrollable
    >
      <View className="mt-6 gap-3">
        {FEATURES.map((feature) => (
          <View key={feature.label} className="flex-row items-center rounded-lg border border-border px-4 py-4">
            <MaterialCommunityIcons name={feature.icon} size={26} className="text-ink" />

            <View className="ml-4 flex-1">
              <Text className="text-body font-semibold text-ink">{feature.label}</Text>
              <Text className="mt-0.5 text-small text-ink-muted">{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </StepScreen>
  );
}
