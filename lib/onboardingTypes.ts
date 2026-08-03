/**
 * The onboarding answer types, extracted from the store so that code outside React can use
 * them. Convex bundles whatever a function imports, and `stores/onboarding.tsx` imports React
 * — so `convex/onboarding.ts` reaches the plan math through here instead.
 *
 * Nothing in this file may import React, React Native, or anything with an `@/` alias:
 * `convex/tsconfig.json` carries no path aliases.
 */

import type { NutritionPlan } from './nutrition';

export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';

export type GymExperience = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/** How fast the user wants to gain. Ordered slowest → fastest; the slider relies on that. */
export const PACES = ['lean', 'moderate', 'aggressive'] as const;

export type Pace = (typeof PACES)[number];

/**
 * Nothing here is written to the server as it is collected. The whole flow is a client-side
 * draft so that a drop-off at any step costs a network round-trip of exactly zero and creates
 * no orphan records — one mutation fires at the end of the flow instead.
 */
export type OnboardingDraft = {
  gender: Gender | null;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activity: ActivityLevel | null;
  experience: GymExperience | null;
  pace: Pace;
  /** Filled in by the generating step; null until the plan comes back. */
  plan: NutritionPlan | null;
};

/**
 * A draft with every question answered — the only shape the server will accept. Narrowing to
 * this is what stops a half-finished draft from being submitted.
 */
export type CompleteOnboardingDraft = Omit<OnboardingDraft, 'gender' | 'activity' | 'experience'> & {
  gender: Gender;
  activity: ActivityLevel;
  experience: GymExperience;
};

export function isCompleteDraft(draft: OnboardingDraft): draft is CompleteOnboardingDraft {
  return draft.gender !== null && draft.activity !== null && draft.experience !== null;
}
