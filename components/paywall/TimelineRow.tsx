import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { cn } from '@/lib/cn';

/**
 * One step of the trial explainer: icon, what happens, when.
 *
 * Spelling out the billing date rather than burying it is not just compliance — being
 * explicit about the charge measurably raises conversion and cuts refund requests, because
 * nobody feels tricked three days later.
 */

type TimelineRowProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description: string;
  /** Hairline between rows, omitted on the last one. */
  last?: boolean;
};

export function TimelineRow({ icon, title, description, last = false }: TimelineRowProps) {
  return (
    <View className={cn('flex-row items-start py-4', !last && 'border-b border-border')}>
      <View className="h-11 w-11 items-center justify-center rounded-md bg-surface">
        <MaterialCommunityIcons name={icon} size={22} className="text-ink" />
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-h3 font-semibold text-ink">{title}</Text>
        <Text className="mt-1 text-small text-ink-muted">{description}</Text>
      </View>
    </View>
  );
}
