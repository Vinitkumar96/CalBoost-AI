import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/cn';

/**
 * One of the two plan choices.
 *
 * The badge sits half outside the card's top edge, so the card needs headroom above it —
 * hence the wrapper's padding rather than a margin on the card itself.
 */

type PlanCardProps = {
  title: string;
  /** Always the store's localized `priceString`, never a literal. */
  price: string;
  /** The `/mo` or `/yr` suffix, kept separate so it can be set smaller than the price. */
  unit: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  /** e.g. "3 DAYS FREE" — omitted when the store won't grant the trial. */
  badge?: string;
  /** e.g. "Best Value · Save 77%". */
  note?: string;
};

export function PlanCard({
  title,
  price,
  unit,
  selected,
  onPress,
  disabled = false,
  badge,
  note,
}: PlanCardProps) {
  return (
    <View className="flex-1 pt-3">
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityLabel={`${title}, ${price} ${unit}`}
        accessibilityHint={note}
        accessibilityState={{ selected, disabled }}
        className={cn(
          'rounded-xl px-4 py-4 active:opacity-85',
          // Border width is identical in both states so selecting never nudges the layout.
          selected ? 'border-2 border-ink' : 'border-2 border-border',
          disabled && 'opacity-50',
        )}
      >
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 text-h3 font-semibold text-ink">{title}</Text>

          {selected ? (
            <View className="h-7 w-7 items-center justify-center rounded-pill bg-ink">
              <Ionicons name="checkmark" size={18} className="text-ink-inverse" />
            </View>
          ) : (
            <View className="h-7 w-7 rounded-pill border-2 border-border" />
          )}
        </View>

        <View className="mt-3 flex-row items-baseline">
          <Text className="text-h2 font-bold text-ink">{price}</Text>
          <Text className="ml-1 text-small text-ink-muted">{unit}</Text>
        </View>

        {note ? (
          <View className="mt-3 self-start rounded-pill bg-surface px-3 py-1">
            <Text className="text-caption font-semibold text-ink">{note}</Text>
          </View>
        ) : null}
      </Pressable>

      {badge ? (
        <View className="absolute left-0 right-0 top-0 items-center">
          <View className="rounded-pill bg-ink px-3 py-1">
            <Text className="text-caption font-bold text-ink-inverse">{badge}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
