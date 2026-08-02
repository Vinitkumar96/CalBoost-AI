import { View } from 'react-native';

import { cn } from '@/lib/cn';

/**
 * Every question screen in the flow: gender, height, weight, target, activity, experience,
 * goal. The result and plan-preview screens aren't questions, so they don't add a segment.
 */
export const TOTAL_STEPS = 7;

type ProgressBarProps = {
  /** 1-based index of the screen being shown. */
  step: number;
};

export function ProgressBar({ step }: ProgressBarProps) {
  return (
    <View
      className="flex-1 flex-row items-center gap-1.5"
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: TOTAL_STEPS, now: step }}
      accessibilityLabel={`Step ${step} of ${TOTAL_STEPS}`}
    >
      {Array.from({ length: TOTAL_STEPS }, (_, index) => (
        <View
          key={index}
          className={cn('h-1.5 flex-1 rounded-pill', index < step ? 'bg-ink' : 'bg-border')}
        />
      ))}
    </View>
  );
}
