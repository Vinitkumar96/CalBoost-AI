import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { NutritionPlan } from '@/lib/nutrition';

export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';

export type GymExperience = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/** How fast the user wants to gain. Ordered slowest → fastest; the slider relies on that. */
export const PACES = ['lean', 'moderate', 'aggressive'] as const;

export type Pace = (typeof PACES)[number];

/**
 * Nothing here is written to the server. The whole flow is a client-side draft so that a
 * drop-off at any step costs a network round-trip of exactly zero and creates no orphan
 * records — one mutation fires at the end of the flow instead.
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

/** The audience median, so every screen opens on a plausible answer rather than an empty one. */
const DEFAULTS: OnboardingDraft = {
  gender: null,
  heightCm: 170,
  weightKg: 60,
  targetWeightKg: 68,
  activity: null,
  experience: null,
  // A slider always has a position, so unlike the card steps this one ships pre-answered —
  // on the middle, least-committal pace.
  pace: 'moderate',
  plan: null,
};

/** A bulk the user hasn't opined on yet: current weight plus a realistic first target. */
const DEFAULT_GAIN_KG = 8;

type OnboardingContextValue = OnboardingDraft & {
  setGender: (gender: Gender) => void;
  setHeightCm: (heightCm: number) => void;
  setWeightKg: (weightKg: number) => void;
  setTargetWeightKg: (targetWeightKg: number) => void;
  setActivity: (activity: ActivityLevel) => void;
  setExperience: (experience: GymExperience) => void;
  setPace: (pace: Pace) => void;
  setPlan: (plan: NutritionPlan) => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(DEFAULTS);
  // Until the user scrubs the target ruler themselves, the target trails their current
  // weight. Without this, going back to fix a current weight of 60→75 would silently leave
  // a target of 68 — i.e. a cut, in an app that only does bulks.
  const [targetTouched, setTargetTouched] = useState(false);

  const setGender = useCallback((gender: Gender) => setDraft((prev) => ({ ...prev, gender })), []);

  const setHeightCm = useCallback((heightCm: number) => setDraft((prev) => ({ ...prev, heightCm })), []);

  const setWeightKg = useCallback(
    (weightKg: number) =>
      setDraft((prev) => ({
        ...prev,
        weightKg,
        targetWeightKg: targetTouched ? prev.targetWeightKg : weightKg + DEFAULT_GAIN_KG,
      })),
    [targetTouched],
  );

  const setTargetWeightKg = useCallback((targetWeightKg: number) => {
    setTargetTouched(true);
    setDraft((prev) => ({ ...prev, targetWeightKg }));
  }, []);

  const setActivity = useCallback((activity: ActivityLevel) => setDraft((prev) => ({ ...prev, activity })), []);

  const setExperience = useCallback(
    (experience: GymExperience) => setDraft((prev) => ({ ...prev, experience })),
    [],
  );

  const setPace = useCallback((pace: Pace) => setDraft((prev) => ({ ...prev, pace })), []);

  const setPlan = useCallback((plan: NutritionPlan) => setDraft((prev) => ({ ...prev, plan })), []);

  const value = useMemo(
    () => ({
      ...draft,
      setGender,
      setHeightCm,
      setWeightKg,
      setTargetWeightKg,
      setActivity,
      setExperience,
      setPace,
      setPlan,
    }),
    [draft, setGender, setHeightCm, setWeightKg, setTargetWeightKg, setActivity, setExperience, setPace, setPlan],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboardingDraft() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboardingDraft must be used inside an OnboardingProvider');
  }

  return context;
}
