import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/cn';

type OptionCardProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  selected: boolean;
  onPress: () => void;
};

/** A large single-select card: glyph, label, and a radio that fills in when chosen. */
export function OptionCard({ label, icon, selected, onPress }: OptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      className={cn(
        'min-h-24 flex-row items-center rounded-xl px-5 active:opacity-85',
        // The selected card carries its emphasis in a 2px ink border; the border width is
        // on both states so selecting never shifts the card's content by a pixel.
        selected ? 'border-2 border-ink' : 'border-2 border-border',
      )}
    >
      <Ionicons name={icon} size={36} className="text-ink" />

      <Text className="ml-5 flex-1 text-h3 font-semibold text-ink">{label}</Text>

      {selected ? (
        <View className="h-7 w-7 items-center justify-center rounded-pill bg-ink">
          <Ionicons name="checkmark" size={18} className="text-ink-inverse" />
        </View>
      ) : (
        <View className="h-7 w-7 rounded-pill border-2 border-border" />
      )}
    </Pressable>
  );
}
