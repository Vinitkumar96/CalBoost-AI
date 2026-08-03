import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { NutritionPlan } from '@/lib/nutrition';
import type {
  ActivityLevel,
  Gender,
  GymExperience,
  OnboardingDraft,
  Pace,
} from '@/lib/onboardingTypes';

// The types moved to `lib/onboardingTypes.ts` so Convex functions can reach them without
// pulling React into the bundle. Re-exported here because every step screen imports them
// from this module.
export type { ActivityLevel, Gender, GymExperience, OnboardingDraft, Pace };
export { PACES } from '@/lib/onboardingTypes';

/**
 * Where the draft waits out the auth round-trip.
 *
 * The provider below only lives inside the `(onboarding)` group, so both the email path
 * (which pushes into `(auth)`) and the social path (which replaces the route on success)
 * unmount it mid-flow. Without a copy on disk the answers would be gone by the time there
 * is a session to attach them to. `stores/onboardingHandoff.tsx` reads it back.
 *
 * SecureStore rather than AsyncStorage only because it is already a dependency — Clerk's
 * token cache uses it. The draft is ~200 bytes, far inside the 2 KB soft limit.
 */
export const PENDING_DRAFT_KEY = 'calboost.onboarding.pending';

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

export function readPendingDraft(): Promise<OnboardingDraft | null> {
  return SecureStore.getItemAsync(PENDING_DRAFT_KEY)
    .then((raw) => (raw ? (JSON.parse(raw) as OnboardingDraft) : null))
    .catch(() => null);
}

export function clearPendingDraft(): Promise<void> {
  return SecureStore.deleteItemAsync(PENDING_DRAFT_KEY).catch(() => undefined);
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(DEFAULTS);
  // Until the user scrubs the target ruler themselves, the target trails their current
  // weight. Without this, going back to fix a current weight of 60→75 would silently leave
  // a target of 68 — i.e. a cut, in an app that only does bulks.
  const [targetTouched, setTargetTouched] = useState(false);

  // Mirrored on every change rather than only at the end: the user can leave for `(auth)`
  // from the save step, and by then this provider is already unmounting. Fire-and-forget —
  // a failed write costs the handoff, not the session, and the flow must not block on disk.
  useEffect(() => {
    if (draft.plan === null) return;
    void SecureStore.setItemAsync(PENDING_DRAFT_KEY, JSON.stringify(draft)).catch(() => undefined);
  }, [draft]);

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
