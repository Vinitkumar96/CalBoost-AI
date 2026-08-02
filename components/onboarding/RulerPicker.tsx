import { useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from 'react-native';

const TICK_HEIGHT = 18;
/** Fourteen ticks of context to scrub against — and short enough to fit an iPhone SE. */
const VIEWPORT_HEIGHT = TICK_HEIGHT * 14;
const PADDING = (VIEWPORT_HEIGHT - TICK_HEIGHT) / 2;

type RulerPickerProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  /** Distance between two ticks, in `unit`s. */
  step: number;
  unit: string;
  /** Decimals in the hero readout — 0 for `175`, 1 for `64.0`. */
  decimals?: number;
  accessibilityLabel: string;
};

/**
 * A vertical ruler the user scrubs. The strip itself is unlabelled — the reading at the top
 * is the single source of truth — and values run high-to-low, matching a physical tape.
 */
export function RulerPicker({
  value,
  onChange,
  min,
  max,
  step,
  unit,
  decimals = 0,
  accessibilityLabel,
}: RulerPickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  // The value the ruler was opened on. Scrolling to it is a one-shot; using the live
  // `value` here would fight the user's finger on every scroll event.
  const initialValue = useRef(value).current;
  const didScrollToInitial = useRef(false);

  const tickCount = Math.round((max - min) / step) + 1;
  // Floating-point steps (0.5 kg) accumulate error over hundreds of ticks, so every value
  // that leaves this component is rounded back onto the step grid.
  const valueAt = (index: number) => Number((max - index * step).toFixed(decimals));
  const indexOf = (target: number) => Math.round((max - target) / step);

  const handleScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.min(tickCount - 1, Math.max(0, Math.round(nativeEvent.contentOffset.y / TICK_HEIGHT)));
    const next = valueAt(index);

    if (next === value) return;

    onChange(next);
  };

  return (
    <View className="items-center">
      <View className="flex-row items-end justify-center">
        <Text className="text-metric font-bold text-ink">{value.toFixed(decimals)}</Text>
        <Text className="mb-3 ml-2 text-h3 text-ink-muted">{unit}</Text>
      </View>

      <View className="mt-8 w-full" style={{ height: VIEWPORT_HEIGHT }}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={TICK_HEIGHT}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={handleScroll}
          // Keyed off content size, not layout: `scrollTo` is a no-op until the strip has
          // been measured, which would leave the ruler parked at `max`.
          onContentSizeChange={() => {
            if (didScrollToInitial.current) return;
            didScrollToInitial.current = true;
            scrollRef.current?.scrollTo({ y: indexOf(initialValue) * TICK_HEIGHT, animated: false });
          }}
          contentContainerStyle={{ paddingVertical: PADDING }}
          accessibilityLabel={accessibilityLabel}
          accessibilityValue={{ min, max, now: value, text: `${value.toFixed(decimals)} ${unit}` }}
        >
          {Array.from({ length: tickCount }, (_, index) => (
            <View key={index} className="flex-row items-center justify-center" style={{ height: TICK_HEIGHT }}>
              <View className="h-0.5 w-6 rounded-pill bg-border" />
            </View>
          ))}
        </ScrollView>

        {/* The reading line is chrome, not content — it must never eat a scroll gesture. */}
        <View
          pointerEvents="none"
          className="absolute inset-x-0 items-center justify-center"
          style={{ top: PADDING, height: TICK_HEIGHT }}
        >
          <View className="h-0.5 w-48 bg-ink" />
          <View className="absolute h-6 w-6 rounded-pill bg-ink" />
        </View>
      </View>
    </View>
  );
}
