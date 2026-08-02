import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { Button } from '@/components/ui/Button';

type StepScreenProps = {
  /** 1-based index of this screen in the flow. */
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Omit on screens whose children carry the actions, and no CTA is docked. */
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  /**
   * Opt-in, because a scrolling parent would fight the ruler picker's own vertical scroll.
   * Only screens whose answer zone can outgrow the viewport turn this on.
   */
  scrollable?: boolean;
};

/**
 * The shared chrome for every onboarding question: back arrow, progress, headline, helper
 * line, the answer zone, and a bottom-docked CTA. Screens supply only their input.
 */
export function StepScreen({
  step,
  title,
  subtitle,
  children,
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
  scrollable = false,
}: StepScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(auth)/welcome'));

  const answerZone = scrollable ? (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-4"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1">{children}</View>
  );

  return (
    // Insets are runtime device measurements, so they stay on `style`; the design's own
    // padding lives on the inner view to avoid fighting these values.
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1 px-5 pb-5 pt-3">
        {/* The bar deliberately stops short of the right edge, as in the design. */}
        <View className="h-10 flex-row items-center gap-5 pr-12">
          <Pressable onPress={back} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} className="text-ink" />
          </Pressable>

          <ProgressBar step={step} />
        </View>

        <Text className="mt-6 text-h1 font-bold text-ink">{title}</Text>
        {subtitle ? <Text className="mt-2 text-body text-ink-muted">{subtitle}</Text> : null}

        {answerZone}

        {onNext ? <Button label={nextLabel} onPress={onNext} disabled={nextDisabled} /> : null}
      </View>
    </View>
  );
}
