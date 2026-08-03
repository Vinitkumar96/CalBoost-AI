import { v } from 'convex/values';

import { internalMutation, mutation } from './_generated/server';
import { subscriptionStatusValidator } from './schema';
import { upsertCurrentUser } from './users';

/**
 * The RevenueCat mirror. The client's `customerInfo` drives UI so the paywall can react
 * instantly, but this table is what anything that costs money checks — see `plan.md` §15.
 */

/**
 * Records which RevenueCat app user id belongs to the caller.
 *
 * Deliberately accepts no entitlement, price, or status: the client could claim any of them.
 * All it establishes is the alias, which is what lets the webhook — the only writer that
 * matters — find this user later. The client sends its own Clerk id here only in the sense
 * that `Purchases.logIn(clerkUserId)` set it; the value is re-derived server-side.
 *
 * Upserts rather than requiring an existing row. This fires from the root layout as soon as
 * Convex authenticates, which races the onboarding handoff that would otherwise create the
 * user — and losing that race should not drop the alias on the floor.
 */
export const linkRevenueCatUser = mutation({
  args: { revenueCatAppUserId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await upsertCurrentUser(ctx);

    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .unique();

    if (existing !== null) {
      if (existing.revenueCatAppUserId !== args.revenueCatAppUserId) {
        await ctx.db.patch(existing._id, { revenueCatAppUserId: args.revenueCatAppUserId });
      }
      return null;
    }

    // A placeholder row so the webhook has something to find even if its event arrives
    // before the first purchase completes. Status `none` grants nothing.
    await ctx.db.insert('subscriptions', {
      userId,
      revenueCatAppUserId: args.revenueCatAppUserId,
      status: 'none',
      isTrial: false,
      willRenew: false,
      store: 'app_store',
    });

    return null;
  },
});

/**
 * The only writer of entitlement state. Called from `http.ts` after the webhook's shared
 * secret checks out — never exposed to the client, hence `internalMutation`.
 *
 * Finds the user by the RevenueCat app user id, which `Purchases.logIn()` aliased to the
 * Clerk id at sign-in. If no user matches, the event is dropped rather than throwing: a
 * failure here would make RevenueCat retry forever over something we can't fix.
 */
export const syncFromWebhook = internalMutation({
  args: {
    revenueCatAppUserId: v.string(),
    eventType: v.string(),
    status: subscriptionStatusValidator,
    isPremium: v.boolean(),
    isTrial: v.boolean(),
    willRenew: v.boolean(),
    productId: v.optional(v.string()),
    entitlement: v.optional(v.string()),
    periodType: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
    eventAt: v.number(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // The alias RevenueCat carries is the Clerk user id, so the user row is reachable even
    // if the placeholder subscription row was never written.
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.revenueCatAppUserId))
      .unique();

    if (user === null) {
      console.warn(`RevenueCat event ${args.eventType} for unknown app user ${args.revenueCatAppUserId}`);
      return false;
    }

    const record = {
      userId: user._id,
      revenueCatAppUserId: args.revenueCatAppUserId,
      productId: args.productId,
      entitlement: args.entitlement,
      status: args.status,
      isTrial: args.isTrial,
      willRenew: args.willRenew,
      periodType: args.periodType,
      trialEndsAt: args.trialEndsAt,
      expiresAt: args.expiresAt,
      lastEventType: args.eventType,
      lastEventAt: args.eventAt,
      store: 'app_store',
    };

    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_rc_user', (q) => q.eq('revenueCatAppUserId', args.revenueCatAppUserId))
      .unique();

    if (existing === null) {
      await ctx.db.insert('subscriptions', record);
    } else if ((existing.lastEventAt ?? 0) > args.eventAt) {
      // Webhooks arrive out of order often enough to matter — a delayed RENEWAL landing
      // after an EXPIRATION would otherwise resurrect a dead subscription.
      console.warn(`Ignoring stale RevenueCat event ${args.eventType} for ${args.revenueCatAppUserId}`);
      return false;
    } else {
      await ctx.db.patch(existing._id, record);
    }

    await ctx.db.patch(user._id, { isPremium: args.isPremium, updatedAt: Date.now() });

    return true;
  },
});
