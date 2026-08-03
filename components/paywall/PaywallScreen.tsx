import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * The shared chrome for the three paywall screens: an escape in the top-left, a scrolling
 * body, and a docked action zone that never scrolls out of reach.
 *
 * Not `StepScreen` — that one carries the onboarding progress bar, and the progress bar is
 * finished by the time the paywall shows. Showing it here would imply the purchase is one of
 * the questions.
 */

type PaywallScreenProps = {
  title: React.ReactNode;
  subtitle?: string;
  /** `close` renders an ✕ that leaves the paywall; `back` returns to the previous screen. */
  escape: 'close' | 'back';
  children: React.ReactNode;
  /** The docked zone: reassurance line, CTA, disclosure, footer. */
  actions: React.ReactNode;
};

export function PaywallScreen({ title, subtitle, escape, children, actions }: PaywallScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Home rather than `back`: dismissing the paywall should not walk the user back through
  // onboarding they have already completed.
  const onEscape = () => (escape === 'close' ? router.replace('/') : router.back());

  return (
    // Insets are runtime device measurements, so they stay on `style`; the design's own
    // padding lives on the inner view to avoid fighting these values.
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1 px-5 pb-4 pt-3">
        {/*
          Always present, always immediately tappable, never on a timer. A paywall with no way
          out is the single most reliable way to fail App Review (Guideline 3.1.1) — and the
          mock omits it on the first screen, which is the one deviation made here on purpose.
        */}
        <View className="h-10 justify-center">
          <Pressable
            onPress={onEscape}
            hitSlop={16}
            accessibilityRole="button"
            accessibilityLabel={escape === 'close' ? 'Close' : 'Go back'}
            className="w-10 active:opacity-60"
          >
            <Ionicons name={escape === 'close' ? 'close' : 'chevron-back'} size={26} className="text-ink" />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-4"
          showsVerticalScrollIndicator={false}
        >
          <Text className="mt-2 text-center text-h1 font-bold text-ink">{title}</Text>
          {subtitle ? (
            <Text className="mt-3 text-center text-body text-ink-muted">{subtitle}</Text>
          ) : null}

          {children}
        </ScrollView>

        <View className="pt-2">{actions}</View>
      </View>
    </View>
  );
}
