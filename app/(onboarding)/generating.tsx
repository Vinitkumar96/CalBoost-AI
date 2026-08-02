import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientBar } from '@/components/onboarding/GradientBar';
import { Button } from '@/components/ui/Button';
import { calculatePlan } from '@/lib/nutrition';
import { MissingApiKeyError, generatePlanWithAI } from '@/lib/openai';
import { useOnboardingDraft } from '@/stores/onboarding';

/** Shown in order as the bar fills, so the wait reads as work rather than a spinner. */
const STATUSES = [
  'Analyzing your body metrics…',
  'Estimating your metabolic age…',
  'Calculating your daily calories…',
  'Balancing your macros…',
  'Finalizing your plan…',
];

/** Each row ticks once the bar passes its mark. */
const CHECKLIST = [
  { label: 'Calories', at: 18 },
  { label: 'Carbs', at: 36 },
  { label: 'Protein', at: 54 },
  { label: 'Fats', at: 72 },
  { label: 'Health Score', at: 90 },
];

/**
 * The bar creeps here while the request is in flight and only completes once the plan is
 * back — it must never imply the plan is ready before it is.
 */
const CREEP_CEILING = 92;

/**
 * The request usually returns in a second or two, which would flash the whole screen past
 * before the checklist has ticked. The bar is paced to fill over `MINIMUM_RUN_MS`, and a
 * fast response waits out the remainder rather than cutting the animation short.
 */
const MINIMUM_RUN_MS = 5_000;
const CREEP_INTERVAL_MS = Math.round(MINIMUM_RUN_MS / CREEP_CEILING);

/** A beat on 100% so the bar visibly completes instead of cutting away mid-fill. */
const COMPLETION_HOLD_MS = 450;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function GeneratingStep() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const draft = useOnboardingDraft();
  const { gender, heightCm, weightKg, targetWeightKg, activity, experience, pace, setPlan } = draft;

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Guards the request against a second run from React's development double-invoke.
  const requested = useRef(false);

  const answersMissing = gender === null || activity === null || experience === null;

  useEffect(() => {
    if (answersMissing) return;

    const timer = setInterval(() => {
      setProgress((current) => (current >= CREEP_CEILING ? current : current + 1));
    }, CREEP_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [answersMissing, attempt]);

  useEffect(() => {
    if (answersMissing || requested.current) return;
    requested.current = true;

    let cancelled = false;
    const startedAt = Date.now();

    const run = async () => {
      try {
        const plan = await generatePlanWithAI({
          gender,
          heightCm,
          weightKg,
          targetWeightKg,
          activity,
          experience,
          pace,
        });

        if (cancelled) return;

        setPlan(plan);

        // Let the bar finish filling before completing it, so a two-second response still
        // shows the full animation rather than jumping from 30% to done.
        await sleep(Math.max(0, MINIMUM_RUN_MS - (Date.now() - startedAt)));
        if (cancelled) return;

        setProgress(100);

        await sleep(COMPLETION_HOLD_MS);
        if (cancelled) return;

        router.replace('/(onboarding)/result');
      } catch (caught) {
        if (cancelled) return;

        setError(
          caught instanceof MissingApiKeyError
            ? 'No OpenAI key is configured yet, so we can’t build your plan.'
            : 'We couldn’t reach our servers to build your plan.',
        );
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [
    answersMissing,
    attempt,
    gender,
    heightCm,
    weightKg,
    targetWeightKg,
    activity,
    experience,
    pace,
    setPlan,
    router,
  ]);

  // The draft is in-memory only, so a reload lands here with nothing to send.
  if (answersMissing) return <Redirect href="/(onboarding)/gender" />;

  const retry = () => {
    requested.current = false;
    setError(null);
    setProgress(0);
    setAttempt((count) => count + 1);
  };

  /** No dead ends: the local formulas from `plan.md` stand in when the request won't go through. */
  const useLocalEstimate = () => {
    setPlan(calculatePlan({ gender, heightCm, weightKg, activity, experience, pace }));
    router.replace('/(onboarding)/result');
  };

  const status = STATUSES[Math.min(STATUSES.length - 1, Math.floor((progress / 100) * STATUSES.length))];

  return (
    // Insets are runtime device measurements, so they stay on `style`; the design's own
    // padding lives on the inner view to avoid fighting these values.
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1 px-5 pb-5 pt-3">
        <View className="flex-1 justify-center">
          <Text className="text-center text-metric font-bold text-ink">{Math.round(progress)}%</Text>

          <Text className="mt-2 text-center text-h1 font-bold text-ink">
            {error ? 'Something went wrong' : 'We’re setting everything up for you'}
          </Text>

          <View className="mt-8">
            <GradientBar progress={progress} />
          </View>

          <Text className="mt-6 text-center text-body text-ink-muted" accessibilityLiveRegion="polite">
            {error ?? status}
          </Text>

          <View className="mt-12">
            <Text className="text-body font-bold text-ink">Daily recommendation for</Text>

            <View className="mt-4 gap-3">
              {CHECKLIST.map((item) => {
                const done = !error && progress >= item.at;

                return (
                  <View key={item.label} className="h-7 flex-row items-center">
                    <Text className="flex-1 text-body text-ink">• {item.label}</Text>

                    {done ? (
                      <View className="h-7 w-7 items-center justify-center rounded-pill bg-ink">
                        <MaterialCommunityIcons name="check" size={16} className="text-ink-inverse" />
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {error ? (
          <View className="gap-3">
            <Button label="Try again" onPress={retry} />
            <Button label="Use our estimate instead" onPress={useLocalEstimate} variant="secondary" />
          </View>
        ) : null}
      </View>
    </View>
  );
}
