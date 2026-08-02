import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import type { ActivityLevel, Gender, GymExperience, Pace } from '@/stores/onboarding';

/**
 * The answer copy for the single-select steps, kept here rather than in the screens because
 * the result screen echoes the same labels back — two copies would drift.
 */

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type ChoiceOption<T> = {
  value: T;
  label: string;
  /** The plain-language example under the label. */
  description: string;
  icon: IconName;
};

export const GENDER_LABEL: Record<Gender, string> = {
  male: 'Male',
  female: 'Female',
};

export const ACTIVITY_OPTIONS: ChoiceOption<ActivityLevel>[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise', icon: 'sofa-outline' },
  { value: 'light', label: 'Lightly active', description: '1–3 days per week', icon: 'walk' },
  { value: 'moderate', label: 'Moderately active', description: '3–5 days per week', icon: 'dumbbell' },
  { value: 'very', label: 'Very active', description: '6–7 days per week', icon: 'run-fast' },
  { value: 'extra', label: 'Extra active', description: 'Very intense daily activity or physical job', icon: 'fire' },
];

export const EXPERIENCE_OPTIONS: ChoiceOption<GymExperience>[] = [
  { value: 'beginner', label: 'Beginner', description: 'New to training', icon: 'account-outline' },
  { value: 'intermediate', label: 'Intermediate', description: 'Have some experience', icon: 'dumbbell' },
  { value: 'advanced', label: 'Advanced', description: 'Trained consistently', icon: 'arm-flex-outline' },
  { value: 'expert', label: 'Expert', description: 'Years of experience', icon: 'trophy-outline' },
];

export const PACE_COPY: Record<Pace, { title: string; description: string; label: string; icon: IconName }> = {
  lean: {
    title: 'Lean Bulk',
    description: 'Slow and steady — minimal fat gain.',
    label: 'Lean',
    icon: 'leaf',
  },
  moderate: {
    title: 'Moderate Bulk',
    description: 'Balanced pace — solid gains, a bit of fat.',
    label: 'Moderate',
    icon: 'fire',
  },
  aggressive: {
    title: 'Aggressive Bulk',
    description: 'Fastest gains — expect some fat with them.',
    label: 'Aggressive',
    icon: 'lightning-bolt',
  },
};

/** Falls back to an em dash so a missing answer never renders as `undefined`. */
export function labelOf<T>(options: ChoiceOption<T>[], value: T | null) {
  return options.find((option) => option.value === value)?.label ?? '—';
}
