import { httpRouter } from 'convex/server';

import { httpAction } from './_generated/server';
import { internal } from './_generated/api';

/**
 * RevenueCat's webhook — the only path by which a user becomes premium.
 *
 * Configure at RevenueCat → Integrations → Webhooks with the URL
 * `https://<deployment>.convex.site/revenuecat-webhook` (the `.convex.site` host, not
 * `.convex.cloud`) and an Authorization header matching `REVENUECAT_WEBHOOK_AUTH`.
 */

const http = httpRouter();

/** The RevenueCat event fields this handler reads. Everything else in the payload is ignored. */
type RevenueCatEvent = {
  type?: string;
  app_user_id?: string;
  original_app_user_id?: string;
  product_id?: string;
  entitlement_ids?: string[] | null;
  period_type?: string;
  expiration_at_ms?: number | null;
  event_timestamp_ms?: number;
  transferred_to?: string[];
};

type SubscriptionStatus = 'none' | 'trialing' | 'active' | 'grace_period' | 'expired' | 'cancelled';

/**
 * Constant-time comparison. A plain `!==` leaks the shared secret one byte at a time to
 * anyone patient enough to measure the response.
 */
function secretsMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);

  return diff === 0;
}

/**
 * Maps a RevenueCat event to the state this app cares about.
 *
 * The subtlety is `CANCELLATION`: the user has turned off auto-renew, but they have paid
 * through the end of the period and keep access until it lapses. Revoking there would be
 * taking away something they bought, and it generates refund requests.
 */
function interpret(event: RevenueCatEvent): { status: SubscriptionStatus; isPremium: boolean } | null {
  const expiresAt = event.expiration_at_ms ?? null;
  const stillPaidThrough = expiresAt === null || expiresAt > Date.now();
  const isTrial = event.period_type === 'TRIAL';

  switch (event.type) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
    case 'UNCANCELLATION':
    case 'PRODUCT_CHANGE':
    case 'NON_RENEWING_PURCHASE':
      return { status: isTrial ? 'trialing' : 'active', isPremium: true };

    case 'CANCELLATION':
      return { status: 'cancelled', isPremium: stillPaidThrough };

    // Billing failed but the store is retrying. Access is kept through the grace period,
    // because dropping a paying customer over a transient card decline is worse than the
    // few days of access it might cost.
    case 'BILLING_ISSUE':
      return { status: 'grace_period', isPremium: stillPaidThrough };

    case 'EXPIRATION':
      return { status: 'expired', isPremium: false };

    // No entitlement change: these only tell us identities were merged or moved. Acknowledged
    // so RevenueCat stops resending, but nothing to write.
    case 'SUBSCRIBER_ALIAS':
    case 'TRANSFER':
    case 'TEST':
      return null;

    default:
      return null;
  }
}

http.route({
  path: '/revenuecat-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const expected = process.env.REVENUECAT_WEBHOOK_AUTH;

    if (!expected) {
      console.error('REVENUECAT_WEBHOOK_AUTH is not set on this deployment');
      return new Response('Not configured', { status: 500 });
    }

    // RevenueCat sends whatever string the dashboard field contains, verbatim. Its own
    // placeholder shows a `Bearer …` example, so accept the token with or without the scheme
    // rather than 401-ing on a difference nobody can see from the dashboard.
    const header = request.headers.get('Authorization');
    const provided = header?.replace(/^Bearer\s+/i, '') ?? null;

    if (provided === null || !secretsMatch(provided, expected)) {
      return new Response('Unauthorized', { status: 401 });
    }

    let event: RevenueCatEvent;
    try {
      const body = (await request.json()) as { event?: RevenueCatEvent };
      event = body.event ?? {};
    } catch {
      return new Response('Malformed body', { status: 400 });
    }

    const interpreted = interpret(event);

    // 200 rather than 404 on events we don't act on. RevenueCat retries non-2xx responses
    // with backoff, and retrying something we deliberately ignore accomplishes nothing.
    if (interpreted === null) {
      return new Response(null, { status: 200 });
    }

    const appUserId = event.app_user_id ?? event.original_app_user_id;
    if (!appUserId) {
      console.warn(`RevenueCat event ${event.type} arrived with no app user id`);
      return new Response(null, { status: 200 });
    }

    const expiresAt = event.expiration_at_ms ?? undefined;
    const isTrial = event.period_type === 'TRIAL';

    await ctx.runMutation(internal.subscriptions.syncFromWebhook, {
      revenueCatAppUserId: appUserId,
      eventType: event.type ?? 'UNKNOWN',
      status: interpreted.status,
      isPremium: interpreted.isPremium,
      isTrial,
      willRenew: interpreted.status === 'active' || interpreted.status === 'trialing',
      productId: event.product_id,
      entitlement: event.entitlement_ids?.[0],
      periodType: event.period_type,
      expiresAt,
      trialEndsAt: isTrial ? expiresAt : undefined,
      eventAt: event.event_timestamp_ms ?? Date.now(),
    });

    return new Response(null, { status: 200 });
  }),
});

export default http;
