import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConfettiBurst } from '@/components/onboarding/ConfettiBurst';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import {
  ACTIVITY_OPTIONS,
  EXPERIENCE_OPTIONS,
  GENDER_LABEL,
  PACE_COPY,
  labelOf,
} from '@/constants/onboarding';
import { useOnboardingDraft } from '@/stores/onboarding';

/** Hermes ships without a guaranteed `Intl`, so group the thousands by hand. */
const groupThousands = (value: number) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

type MacroProps = {
  value: number;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  /** The one place in the app where color carries meaning rather than emphasis. */
  tone: string;
};

function Macro({ value, label, icon, tone }: MacroProps) {
  return (
    <View className="flex-1 items-center">
      <MaterialCommunityIcons name={icon} size={28} className={tone} />
      <Text className="mt-3 text-h3 font-bold text-ink">{value}g</Text>
      <Text className="mt-1 text-small text-ink-muted">{label}</Text>
    </View>
  );
}

type NutrientProps = {
  value: string;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

/** Deliberately quieter than `Macro` — these are secondary targets, not the headline. */
function Nutrient({ value, label, icon }: NutrientProps) {
  return (
    <View className="flex-1 items-center">
      <MaterialCommunityIcons name={icon} size={18} className="text-ink-muted" />
      <Text className="mt-2 text-body font-semibold text-ink">{value}</Text>
      <Text className="mt-0.5 text-caption text-ink-muted">{label}</Text>
    </View>
  );
}

function DetailRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View className={cn('flex-row items-center justify-between py-4', !last && 'border-b border-border')}>
      <Text className="text-small text-ink-muted">{label}</Text>
      <Text className="text-small font-semibold text-ink">{value}</Text>
    </View>
  );
}

export default function ResultStep() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { plan, gender, heightCm, weightKg, targetWeightKg, activity, experience, pace } = useOnboardingDraft();
  // Collapsed by default: calories and the three macros are the headline, and these five
  // numbers competing at once is exactly the "two numbers, not twelve" failure.
  const [showDetails, setShowDetails] = useState(false);

  // The plan is built on the generating step and the draft is in-memory only, so a reload
  // lands here with nothing to show. Restarting beats rendering numbers we didn't compute.
  if (plan === null) return <Redirect href="/(onboarding)/gender" />;

  return (
    // Insets are runtime device measurements, so they stay on `style`; the design's own
    // padding lives on the inner view to avoid fighting these values.
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1 px-5 pb-5 pt-3">
        <ScrollView contentContainerClassName="pb-6" showsVerticalScrollIndicator={false}>
          <View className="h-52 items-center justify-center">
            <ConfettiBurst />
            <View className="h-40 w-40 items-center justify-center rounded-pill bg-surface">
              <Image
                source={require('@/assets/images/logo-black.png')}
                className="h-24 w-24"
                contentFit="contain"
                accessibilityLabel="Illustration of someone eating a meal"
              />
            </View>
          </View>

          <Text className="mt-2 text-center text-h2 font-bold text-ink">Your daily calorie target</Text>
          <Text className="mt-3 text-center text-body text-ink-muted">
            Based on your info, here’s your personalized target to reach your goal.
          </Text>

          <Text className="mt-8 text-center text-metric font-bold text-ink">{groupThousands(plan.calories)}</Text>
          <Text className="mt-1 text-center text-h3 text-ink-muted">Calories / day</Text>

          <View className="mt-8 rounded-lg border border-border px-3 pt-6">
            <View className="flex-row">
              <Macro value={plan.proteinGrams} label="Protein" icon="food-drumstick" tone="text-macro-protein" />
              <Macro value={plan.carbGrams} label="Carbs" icon="barley" tone="text-macro-carbs" />
              <Macro value={plan.fatGrams} label="Fat" icon="water" tone="text-macro-fat" />
            </View>

            <Pressable
              onPress={() => setShowDetails((open) => !open)}
              hitSlop={8}
              className="mt-5 flex-row items-center justify-center gap-1 border-t border-border py-4 active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel={showDetails ? 'Hide more nutrients' : 'Show more nutrients'}
              accessibilityState={{ expanded: showDetails }}
            >
              <Text className="text-small font-semibold text-ink-muted">
                {showDetails ? 'Hide details' : 'More nutrients'}
              </Text>
              <MaterialCommunityIcons
                name={showDetails ? 'chevron-up' : 'chevron-down'}
                size={18}
                className="text-ink-muted"
              />
            </Pressable>

            {showDetails ? (
              <View className="flex-row pb-6">
                <Nutrient value={`${plan.fiberGrams}g`} label="Fiber" icon="leaf" />
                <Nutrient value={`${plan.sugarGrams}g`} label="Sugar" icon="cube-outline" />
                <Nutrient value={`${groupThousands(plan.sodiumMg)}mg`} label="Sodium" icon="shaker-outline" />
              </View>
            ) : null}
          </View>

          <View className="mt-6 rounded-lg border border-border px-5 pb-4 pt-6">
            <Text className="text-body font-bold text-ink">Your details</Text>

            <View className="mt-2">
              <DetailRow label="Gender" value={gender ? GENDER_LABEL[gender] : '—'} />
              <DetailRow label="Height" value={`${heightCm} cm`} />
              <DetailRow label="Current weight" value={`${weightKg.toFixed(1)} kg`} />
              <DetailRow label="Goal weight" value={`${targetWeightKg.toFixed(1)} kg`} />
              <DetailRow label="To gain" value={`+${(targetWeightKg - weightKg).toFixed(1)} kg`} />
              <DetailRow label="Activity" value={labelOf(ACTIVITY_OPTIONS, activity)} />
              <DetailRow label="Gym experience" value={labelOf(EXPERIENCE_OPTIONS, experience)} />
              <DetailRow label="Pace" value={PACE_COPY[pace].title} last />
            </View>
          </View>
{/* 
          <View className="mt-6 flex-row rounded-lg bg-info p-4">
            <View className="h-7 w-7 items-center justify-center rounded-pill bg-info-ink/15">
              <MaterialCommunityIcons name="star-four-points" size={16} className="text-info-ink" />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-body font-semibold text-ink">This is just the beginning!</Text>
              <Text className="mt-1 text-small text-ink-muted">
                Unlock your personalized plan, AI insights and advanced tracking.
              </Text>
            </View>
          </View> */}
        </ScrollView>

        <Button label="Continue" onPress={() => router.push('/(onboarding)/plan')} />
      </View>
    </View>
  );
}
