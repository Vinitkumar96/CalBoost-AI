import { useAuth } from '@clerk/expo';
import { useConvexAuth, useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { api } from '@/convex/_generated/api';
import { isCompleteDraft } from '@/lib/onboardingTypes';
import { clearPendingDraft, readPendingDraft } from '@/stores/onboarding';

/**
 * Carries the onboarding draft across the sign-in boundary.
 *
 * The draft is collected by a provider that only lives inside the `(onboarding)` group, and
 * every route out of the save step unmounts it: the email path pushes into `(auth)`, and the
 * social path replaces the route the moment `setActive` resolves. So the draft is written to
 * disk as it is filled in (see `stores/onboarding.tsx`) and picked up here — one place that
 * catches all three auth paths, rather than three copies of the same logic.
 */

type HandoffValue = {
  /** True from the moment a pending draft is found until the user lands on the paywall. */
  isFlushing: boolean;
};

const OnboardingHandoffContext = createContext<HandoffValue>({ isFlushing: false });

export function OnboardingHandoffProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  // Clerk being signed in is not enough: the mutation needs Convex to have exchanged the
  // Clerk token, or it throws "Not signed in" on a session that is perfectly valid.
  const { isAuthenticated } = useConvexAuth();
  const completeOnboarding = useMutation(api.onboarding.complete);
  const ensureUser = useMutation(api.users.ensureCurrent);

  // Starts true and is cleared once the handoff resolves either way. Optimistic on purpose:
  // `users.current` can return `null` — "no row yet" — while the mutation that creates the row
  // is still in flight, and the `(home)` gate reads that as "never onboarded" and bounces the
  // user back to question one. Blocking from the first render closes that window.
  const [isFlushing, setIsFlushing] = useState(true);
  // The effect below depends on values that change during its own run, so without a latch it
  // would fire a second mutation before the first cleared the key.
  const hasRun = useRef(false);

  useEffect(() => {
    // Still restoring the session — keep blocking rather than guessing.
    if (!isLoaded) return;

    // A signed-out visitor has nothing to hand off, and leaving the latch set would keep the
    // gate blocked forever on the welcome screen.
    if (!isSignedIn) {
      setIsFlushing(false);
      return;
    }

    // Clerk is signed in but Convex hasn't exchanged the token yet. Keep blocking: releasing
    // here is exactly the window in which `users.current` answers `null` for a user whose row
    // is about to be written.
    if (!isAuthenticated || hasRun.current) return;
    hasRun.current = true;

    let cancelled = false;

    void (async () => {
      const draft = await readPendingDraft();

      // No draft is the normal case for a returning user signing in on a new device. They
      // still need a row — the plan comes from whatever they saved last time.
      if (draft === null || !isCompleteDraft(draft)) {
        await ensureUser().catch((error: unknown) => {
          if (__DEV__) console.error('Failed to create the user row:', error);
        });
        setIsFlushing(false);
        return;
      }

      try {
        await completeOnboarding({
          gender: draft.gender,
          heightCm: draft.heightCm,
          weightKg: draft.weightKg,
          targetWeightKg: draft.targetWeightKg,
          activity: draft.activity,
          experience: draft.experience,
          pace: draft.pace,
        });
        await clearPendingDraft();

        if (!cancelled) router.replace('/(paywall)/intro');
      } catch (error) {
        // The draft stays on disk, so the next launch retries rather than losing the answers.
        // Falling through leaves the `(home)` gate to send them back through onboarding,
        // which is the honest outcome — nothing was saved.
        if (__DEV__) console.error('Failed to save onboarding:', error);
        hasRun.current = false;
      } finally {
        // Unconditional: a latch left set by a cancelled run would block the gate forever,
        // which is a worse failure than a stray state update on the way out.
        setIsFlushing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, isAuthenticated, completeOnboarding, ensureUser, router]);

  // Signing out has to re-arm the latch, or a second user on the same device would never
  // get their draft written.
  useEffect(() => {
    if (!isSignedIn) hasRun.current = false;
  }, [isSignedIn]);

  return (
    <OnboardingHandoffContext.Provider value={{ isFlushing }}>{children}</OnboardingHandoffContext.Provider>
  );
}

export function useOnboardingHandoff() {
  return useContext(OnboardingHandoffContext);
}
