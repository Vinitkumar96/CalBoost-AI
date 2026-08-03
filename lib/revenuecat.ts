import { useAuth } from '@clerk/expo';
import { useConvexAuth, useMutation } from 'convex/react';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { api } from '@/convex/_generated/api';

/**
 * The purchase layer, behind a façade.
 *
 * Two reasons this isn't just `import Purchases from 'react-native-purchases'` at each call
 * site. First, it's a native module: Expo Go doesn't ship it, so touching it there crashes.
 * Second, the App Store products don't exist yet — until they do, `EXPO_PUBLIC_REVENUECAT_IOS_KEY`
 * is unset and everything below runs against a stub, so the paywall can be built and reviewed
 * without a developer account or a device build.
 *
 * The screens never see a RevenueCat type. They see `PaywallPackage`, which is the same shape
 * whether it came from StoreKit or the stub — so switching to the real SDK changes nothing
 * above this file.
 */

/** The App Store key (`appl_…`) — the one real users' purchases go through. */
const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;

/**
 * RevenueCat's Test Store key. Test Store products live entirely inside RevenueCat, so real
 * purchase and webhook flows can be exercised with no Apple Developer account and no App Store
 * Connect products — its subscriptions renew up to 5 times at minutes-long intervals.
 *
 * Gated on `__DEV__` deliberately. RevenueCat's own warning is never to submit an app built
 * with a Test Store key, and a release build that shipped one would hand every user a free
 * subscription. `__DEV__` is false in release builds, so the key cannot leak into one.
 */
const TEST_KEY = process.env.EXPO_PUBLIC_REVENUECAT_TEST_KEY;

const USING_TEST_STORE = __DEV__ && !!TEST_KEY;

const API_KEY = USING_TEST_STORE ? TEST_KEY : IOS_KEY;

/**
 * The single entitlement this app sells.
 *
 * Must match the entitlement **identifier** in the RevenueCat dashboard — not its display
 * name. RevenueCat's setup wizard proposes a human-readable name ("CalBoost AI Pro"); the
 * identifier underneath is what the SDK keys on, and a mismatch means a paying user is never
 * recognised as premium. Overridable so the dashboard stays the source of truth.
 */
const ENTITLEMENT = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT ?? 'premium';

/** Expo Go ships no third-party native modules, so the SDK can't run there at all. */
const IS_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/**
 * The one switch. Stub whenever the real SDK can't work: no key configured, or running in
 * Expo Go, which ships no third-party native modules at all.
 *
 * The platform check applies only to real purchases — this app sells on iOS. The Test Store
 * is store-agnostic, so a free Android dev build is a legitimate way to exercise the purchase
 * and webhook paths without a $99 account, and must not be stubbed out.
 */
export const IS_STUB = !API_KEY || IS_EXPO_GO || (!USING_TEST_STORE && Platform.OS !== 'ios');

/** What a plan card renders. Deliberately free of SDK types. */
export type PaywallPackage = {
  /** RevenueCat's package identifier — `$rc_monthly` or `$rc_annual`. */
  identifier: string;
  productId: string;
  /** The numeric price, used only to compute the annual saving. Never rendered. */
  price: number;
  /** The localized, store-authoritative price. This is what gets rendered — always. */
  priceString: string;
  period: 'monthly' | 'annual';
  /** The real `PurchasesPackage`, handed back to `purchasePackage` untouched. */
  raw: unknown;
};

export type PurchaseOutcome = 'purchased' | 'cancelled';

export class PurchaseError extends Error {}

// --- The real SDK, loaded lazily -------------------------------------------------------

// `require` rather than a top-level import: in Expo Go the native module is missing, and a
// static import would bring it in before `IS_STUB` ever gets a chance to be read.
/* eslint-disable @typescript-eslint/no-require-imports */
function sdk() {
  return require('react-native-purchases') as typeof import('react-native-purchases');
}
/* eslint-enable @typescript-eslint/no-require-imports */

// --- The stub ---------------------------------------------------------------------------

/**
 * What the stub's `purchase` does. Exposed so the paywall's failure and cancellation paths
 * can be exercised in Expo Go — they are the states most likely to be wrong and the hardest
 * to reach on a real device.
 */
let stubOutcome: 'success' | 'cancel' | 'fail' = 'success';

export function setStubOutcome(outcome: typeof stubOutcome) {
  stubOutcome = outcome;
}

/**
 * The real product identifiers, as configured in the RevenueCat `default` offering.
 *
 * These must match App Store Connect exactly — Apple's product ids are case-sensitive and
 * cannot be renamed once created, so a typo here means creating a second product and
 * abandoning the first.
 */
export const MONTHLY_PRODUCT_ID = 'CalBoost_pro_monthly';
export const ANNUAL_PRODUCT_ID = 'CalBoost_pro_yearly';

/** Mirrors the real products so the layout is exercised at realistic price widths. */
const STUB_PACKAGES: PaywallPackage[] = [
  {
    identifier: '$rc_monthly',
    productId: MONTHLY_PRODUCT_ID,
    price: 8.99,
    priceString: '$8.99',
    period: 'monthly',
    raw: null,
  },
  {
    identifier: '$rc_annual',
    productId: ANNUAL_PRODUCT_ID,
    price: 24.99,
    priceString: '$24.99',
    period: 'annual',
    raw: null,
  },
];

let stubIsPremium = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- The façade -------------------------------------------------------------------------

export function configureRevenueCat() {
  // A Test Store key present in a release build is the one configuration that silently gives
  // every paying customer a free subscription, so it is worth shouting about even though
  // `USING_TEST_STORE` already refuses to use it outside dev.
  if (!__DEV__ && TEST_KEY) {
    console.error(
      '[RevenueCat] EXPO_PUBLIC_REVENUECAT_TEST_KEY is set in a release build. Remove it before shipping.',
    );
  }

  if (IS_STUB) {
    if (__DEV__) {
      console.warn(
        '[RevenueCat] Running in STUB mode — no real purchases. Set ' +
          'EXPO_PUBLIC_REVENUECAT_TEST_KEY (Test Store) or EXPO_PUBLIC_REVENUECAT_IOS_KEY, ' +
          'and use a dev build — Expo Go cannot load the native module.',
      );
    }
    return;
  }

  if (__DEV__ && USING_TEST_STORE) {
    console.warn('[RevenueCat] Using the Test Store — purchases are simulated and renew rapidly.');
  }

  const Purchases = sdk().default;
  if (__DEV__) Purchases.setLogLevel(sdk().LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: API_KEY! });
}

export async function identifyUser(clerkUserId: string) {
  if (IS_STUB) return;
  await sdk().default.logIn(clerkUserId);
}

export async function forgetUser() {
  if (IS_STUB) return;
  await sdk().default.logOut();
}

/** The SDK's package shape, narrowed to the fields this file reads. */
type RawPackage = {
  identifier: string;
  product: { identifier: string; price: number; priceString: string; subscriptionPeriod: string | null };
};

function toPaywallPackage(pkg: RawPackage, period: 'monthly' | 'annual'): PaywallPackage {
  return {
    identifier: pkg.identifier,
    productId: pkg.product.identifier,
    price: pkg.product.price,
    priceString: pkg.product.priceString,
    period,
    raw: pkg,
  };
}

/**
 * The current offering's two packages, monthly first.
 *
 * Reads `offerings.current` — whichever offering is marked Current in the dashboard — so the
 * packages on the paywall can be swapped without shipping a build.
 *
 * `offering.monthly` and `offering.annual` only resolve packages whose identifiers are the
 * predefined `$rc_monthly` / `$rc_annual`. A dashboard configured with custom identifiers
 * (`monthly`, `yearly`) leaves both null, which would render a paywall with no plans and no
 * explanation — so the ISO-8601 subscription period is used as a fallback, and a genuine
 * misconfiguration throws with the identifiers it actually found.
 */
export async function fetchPackages(): Promise<PaywallPackage[]> {
  if (IS_STUB) {
    await delay(600);
    return STUB_PACKAGES;
  }

  const offerings = await sdk().default.getOfferings();
  const current = offerings.current;

  if (current === null) {
    throw new PurchaseError(
      'No offering is marked Current in RevenueCat. Set the `default` offering as Current.',
    );
  }

  const available = current.availablePackages as unknown as RawPackage[];
  // ISO 8601 durations: a one-month subscription is "P1M", a one-year one "P1Y".
  const byPeriod = (period: 'P1M' | 'P1Y') =>
    available.find((pkg) => pkg.product.subscriptionPeriod?.toUpperCase() === period);

  const monthly = (current.monthly as unknown as RawPackage | null) ?? byPeriod('P1M') ?? null;
  const annual = (current.annual as unknown as RawPackage | null) ?? byPeriod('P1Y') ?? null;

  const packages: PaywallPackage[] = [];
  if (monthly) packages.push(toPaywallPackage(monthly, 'monthly'));
  if (annual) packages.push(toPaywallPackage(annual, 'annual'));

  if (packages.length === 0) {
    const found = available.map((pkg) => pkg.identifier).join(', ') || 'none';
    throw new PurchaseError(
      `The "${current.identifier}" offering has no monthly or annual package (found: ${found}). ` +
        'Package identifiers should be $rc_monthly and $rc_annual.',
    );
  }

  return packages;
}

/**
 * Buys a package.
 *
 * Returns `'cancelled'` rather than throwing when the user dismisses the sheet — backing out
 * of a purchase is a normal thing to do, and showing an error for it reads as an accusation.
 */
export async function purchase(pkg: PaywallPackage): Promise<PurchaseOutcome> {
  if (IS_STUB) {
    await delay(900);
    if (stubOutcome === 'cancel') return 'cancelled';
    if (stubOutcome === 'fail') throw new PurchaseError('Stubbed purchase failure.');
    stubIsPremium = true;
    return 'purchased';
  }

  try {
    await sdk().default.purchasePackage(pkg.raw as never);
    return 'purchased';
  } catch (error) {
    if ((error as { userCancelled?: boolean }).userCancelled) return 'cancelled';
    throw error;
  }
}

/** Returns whether anything was actually restored, so the caller can say "nothing to restore". */
export async function restore(): Promise<boolean> {
  if (IS_STUB) {
    await delay(700);
    return stubIsPremium;
  }

  const customerInfo = await sdk().default.restorePurchases();
  return typeof customerInfo.entitlements.active[ENTITLEMENT] !== 'undefined';
}

export async function fetchIsPremium(): Promise<boolean> {
  if (IS_STUB) return stubIsPremium;

  const customerInfo = await sdk().default.getCustomerInfo();
  return typeof customerInfo.entitlements.active[ENTITLEMENT] !== 'undefined';
}

/**
 * Whether the store will actually grant the free trial.
 *
 * Anyone who has trialed before is ineligible, and promising them three free days that the
 * store then refuses is a guaranteed one-star review. Unknown counts as ineligible: the
 * honest failure is to show the plain price.
 */
export async function fetchTrialEligibility(productIds: string[]): Promise<boolean> {
  if (IS_STUB) return true;

  try {
    const result = await sdk().default.checkTrialOrIntroductoryPriceEligibility(productIds);
    const eligible = sdk().INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE;
    return productIds.some((id) => result[id]?.status === eligible);
  } catch {
    return false;
  }
}

/** Subscribes to entitlement changes. Returns an unsubscribe. */
export function onPremiumChange(listener: (isPremium: boolean) => void): () => void {
  if (IS_STUB) return () => {};

  const Purchases = sdk().default;
  const handler = (customerInfo: { entitlements: { active: Record<string, unknown> } }) => {
    listener(typeof customerInfo.entitlements.active[ENTITLEMENT] !== 'undefined');
  };

  Purchases.addCustomerInfoUpdateListener(handler as never);
  return () => Purchases.removeCustomerInfoUpdateListener(handler as never);
}

// --- Identity ---------------------------------------------------------------------------

/**
 * Ties the RevenueCat app user id to the Clerk user id, mounted once at the root.
 *
 * This alias is load-bearing: it is what lets the webhook find the right Convex row, and what
 * makes a subscription survive a reinstall or follow the user to a new device. Without it,
 * purchases attach to an anonymous id that nothing else in the system knows about.
 */
export function useRevenueCatIdentity() {
  const { isSignedIn, userId } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const linkRevenueCatUser = useMutation(api.subscriptions.linkRevenueCatUser);
  const configured = useRef(false);
  const linkedFor = useRef<string | null>(null);

  useEffect(() => {
    if (configured.current) return;
    configured.current = true;
    configureRevenueCat();
  }, []);

  useEffect(() => {
    if (!isSignedIn || !userId) {
      if (linkedFor.current !== null) {
        linkedFor.current = null;
        void forgetUser().catch(() => undefined);
      }
      return;
    }

    if (linkedFor.current === userId || !isAuthenticated) return;
    linkedFor.current = userId;

    void (async () => {
      try {
        await identifyUser(userId);
        await linkRevenueCatUser({ revenueCatAppUserId: userId });
      } catch (error) {
        // Non-fatal: entitlement still resolves from the webhook, which keys on the Clerk id
        // regardless. Retrying on the next launch is enough.
        if (__DEV__) console.error('Failed to link RevenueCat identity:', error);
        linkedFor.current = null;
      }
    })();
  }, [isSignedIn, userId, isAuthenticated, linkRevenueCatUser]);
}
