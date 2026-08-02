import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { PaceSlider } from '@/components/onboarding/PaceSlider';
import { StepScreen } from '@/components/onboarding/StepScreen';
import { PACE_COPY } from '@/constants/onboarding';
import { cn } from '@/lib/cn';
import { PACE_WEEKLY_GAIN_KG } from '@/lib/nutrition';
import { PACES, useOnboardingDraft } from '@/stores/onboarding';

export default function GoalStep() {
  const router = useRouter();
  const { pace, setPace } = useOnboardingDraft();

  const selected = PACE_COPY[pace];

  return (
    <StepScreen
      step={7}
      title="What’s your goal?"
      subtitle={'Slide to set your bulking pace.\nYou can change this anytime.'}
      onNext={() => router.push('/(onboarding)/generating')}
    >
      <View className="flex-1 justify-center">
        <View className="items-center">
          <View className="h-20 w-20 items-center justify-center rounded-pill bg-surface">
            <MaterialCommunityIcons name={selected.icon} size={34} className="text-ink" />
          </View>

          {/* "Aggressive Bulk" is the longest name and wraps on narrow screens, which would
              push the slider down as the user scrubs. Both text blocks are therefore pinned
              to a fixed height so the layout is identical at every pace. */}
          <Text className="mt-5 w-full text-center text-h2 font-bold text-ink" numberOfLines={1}>
            {selected.title}
          </Text>
          <Text className="mt-2 text-small text-ink-muted">+{PACE_WEEKLY_GAIN_KG[pace]} kg / week</Text>

          <View className="mt-4 h-10 w-full justify-center">
            <Text className="text-center text-small text-ink-muted" numberOfLines={2}>
              {selected.description}
            </Text>
          </View>
        </View>

        <View className="mt-10">
          <PaceSlider
            stops={PACES.length}
            index={PACES.indexOf(pace)}
            onChange={(index) => setPace(PACES[index])}
            accessibilityLabel="Bulking pace"
          />

          {/* Tapping a label is the same choice as sliding to it — the slider is the hint,
              not the only way in. */}
          <View className="mt-3 flex-row">
            {PACES.map((option, index) => (
              <Pressable
                key={option}
                onPress={() => setPace(option)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`${PACE_COPY[option].title} pace`}
                accessibilityState={{ selected: pace === option }}
                className={cn(
                  'flex-1 flex-row items-center gap-1',
                  index === 0 && 'justify-start',
                  index === PACES.length - 1 && 'justify-end',
                  index !== 0 && index !== PACES.length - 1 && 'justify-center',
                )}
              >
                <MaterialCommunityIcons
                  name={PACE_COPY[option].icon}
                  size={14}
                  className={pace === option ? 'text-ink' : 'text-ink-muted'}
                />
                <Text
                  className={cn(
                    'text-caption',
                    pace === option ? 'font-semibold text-ink' : 'text-ink-muted',
                  )}
                >
                  {PACE_COPY[option].label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </StepScreen>
  );
}
