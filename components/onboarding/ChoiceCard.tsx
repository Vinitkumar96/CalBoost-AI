import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/cn';

type ChoiceCardProps = {
  label: string;
  /** The plain-language example under the label — "3–5 days per week". */
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  selected: boolean;
  onPress: () => void;
};

/**
 * A compact single-select row: glyph, label, supporting line. Unlike `OptionCard` there is
 * no empty radio — only the chosen row carries a mark, which keeps a list of five quiet.
 */
export function ChoiceCard({ label, description, icon, selected, onPress }: ChoiceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ selected }}
      className={cn(
        'flex-row items-center rounded-lg px-4 py-4 active:opacity-85',
        // The border width is on both states so selecting never shifts the row by a pixel.
        selected ? 'border-2 border-ink' : 'border-2 border-border',
      )}
    >
      <MaterialCommunityIcons name={icon} size={26} className="text-ink" />

      <View className="ml-4 flex-1">
        <Text className="text-body font-semibold text-ink">{label}</Text>
        <Text className="mt-0.5 text-small text-ink-muted">{description}</Text>
      </View>

      {selected ? (
        <View className="ml-3 h-7 w-7 items-center justify-center rounded-pill bg-ink">
          <MaterialCommunityIcons name="check" size={16} className="text-ink-inverse" />
        </View>
      ) : null}
    </Pressable>
  );
}
