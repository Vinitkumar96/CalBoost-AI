import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { cn } from '@/lib/cn';

/**
 * The connected version of the trial explainer, for the plan screen.
 *
 * The joining line is the point: three separate rows read as a list of terms, while a line
 * running through them reads as a path the user is already on. The last node is filled
 * because it is the one that costs money — it should be the thing the eye lands on.
 */

type Step = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description: string;
};

export function TrialTimeline({ steps }: { steps: Step[] }) {
  return (
    <View className="mt-8">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <View key={step.title} className="flex-row">
            <View className="w-12 items-center">
              <View
                className={cn(
                  'h-11 w-11 items-center justify-center rounded-pill',
                  isLast ? 'bg-ink' : 'bg-accent',
                )}
              >
                <MaterialCommunityIcons
                  name={step.icon}
                  size={20}
                  className={isLast ? 'text-ink-inverse' : 'text-ink'}
                />
              </View>

              {/* Stretches to whatever height the neighbouring copy needs. */}
              {!isLast ? <View className="w-1 flex-1 bg-accent" /> : null}
            </View>

            <View className={cn('ml-4 flex-1', !isLast && 'pb-6')}>
              <Text className="text-h3 font-semibold text-ink">{step.title}</Text>
              <Text className="mt-1 text-small text-ink-muted">{step.description}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
