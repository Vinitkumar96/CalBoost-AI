import { useCallback, useEffect, useState } from 'react';

import {
  fetchIsPremium,
  fetchPackages,
  fetchTrialEligibility,
  onPremiumChange,
  type PaywallPackage,
} from '@/lib/revenuecat';

/**
 * Loads the offering, plus whether the store will honour the free trial.
 *
 * Eligibility is fetched alongside the packages rather than on demand because every screen in
 * the paywall reads it — three screens promising a trial the user won't get is worse than one.
 */
export function useOfferings() {
  const [packages, setPackages] = useState<PaywallPackage[] | null>(null);
  const [trialEligible, setTrialEligible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    void (async () => {
      try {
        const loaded = await fetchPackages();
        if (cancelled) return;
        setPackages(loaded);

        const eligible = await fetchTrialEligibility(loaded.map((pkg) => pkg.productId));
        if (!cancelled) setTrialEligible(eligible);
      } catch (err) {
        if (__DEV__) console.error('Failed to load offerings:', err);
        // Deliberately vague: the causes (no network, StoreKit down, a misconfigured
        // dashboard) are indistinguishable to the user and all have the same remedy.
        if (!cancelled) setError("We can't reach the App Store right now.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const monthly = packages?.find((pkg) => pkg.period === 'monthly') ?? null;
  const annual = packages?.find((pkg) => pkg.period === 'annual') ?? null;

  return {
    monthly,
    annual,
    /** `true` until the first attempt resolves either way. */
    loading: packages === null && error === null,
    error,
    trialEligible,
    retry: useCallback(() => setAttempt((n) => n + 1), []),
  };
}

/**
 * The client's view of entitlement — for UI only.
 *
 * Convex's `users.isPremium`, written by the RevenueCat webhook, is the authority for anything
 * that costs money. This exists so the paywall can react the instant a purchase completes
 * rather than waiting for a webhook round-trip.
 */
export function useSubscription() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setIsPremium(await fetchIsPremium());
    } catch (error) {
      if (__DEV__) console.error('Failed to read entitlement:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    // Renewals, expirations, and purchases made on another device all arrive here without
    // the app asking.
    return onPremiumChange(setIsPremium);
  }, [refresh]);

  return { isPremium, loading, refresh };
}

/**
 * The annual saving, as a whole percent against twelve months of the monthly plan.
 *
 * Computed rather than written down: a badge that says 77% after someone changes the price in
 * App Store Connect is a lie the app tells on every launch. Returns `null` when either price
 * is missing, and the badge is then simply not rendered.
 */
export function annualSavingPercent(
  monthly: PaywallPackage | null,
  annual: PaywallPackage | null,
): number | null {
  if (!monthly || !annual || monthly.price <= 0) return null;

  const percent = Math.round((1 - annual.price / (monthly.price * 12)) * 100);
  return percent > 0 ? percent : null;
}

/** The annual plan expressed per month, which is the comparison that actually persuades. */
export function annualPerMonth(annual: PaywallPackage | null): string | null {
  if (!annual) return null;

  // Derived from the numeric price, so it loses the store's currency symbol. Recover it from
  // `priceString` rather than assuming '$' — this app is sold in every territory.
  const symbol = annual.priceString.replace(/[\d.,\s]/g, '');
  return `${symbol}${(annual.price / 12).toFixed(2)}`;
}
