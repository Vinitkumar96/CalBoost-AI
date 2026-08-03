import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

/**
 * Only the two tables this milestone needs: the user row that holds the onboarding result,
 * and the RevenueCat mirror that decides what the user is allowed to do. The rest of the
 * data model in `plan.md` §13 lands with the screens that use it.
 */

/**
 * Exported so `onboarding.ts` validates its arguments against exactly the same literals the
 * table stores — two hand-written copies of these unions would drift the first time a pace
 * is renamed.
 */
export const genderValidator = v.union(v.literal('male'), v.literal('female'));

export const activityValidator = v.union(
  v.literal('sedentary'),
  v.literal('light'),
  v.literal('moderate'),
  v.literal('very'),
  v.literal('extra'),
);

export const experienceValidator = v.union(
  v.literal('beginner'),
  v.literal('intermediate'),
  v.literal('advanced'),
  v.literal('expert'),
);

export const paceValidator = v.union(v.literal('lean'), v.literal('moderate'), v.literal('aggressive'));

export const subscriptionStatusValidator = v.union(
  v.literal('none'),
  v.literal('trialing'),
  v.literal('active'),
  v.literal('grace_period'),
  v.literal('expired'),
  v.literal('cancelled'),
);

export default defineSchema({
  users: defineTable({
    /**
     * The canonical identity key. Convex guarantees `tokenIdentifier` is unique across
     * providers; `subject` alone is not, so ownership lookups must never key on it.
     */
    tokenIdentifier: v.string(),
    /** The bare Clerk id, kept for the webhook and for aliasing RevenueCat to the same user. */
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),

    // The onboarding answers, exactly as asked.
    gender: v.optional(genderValidator),
    heightCm: v.optional(v.number()),
    weightKg: v.optional(v.number()),
    targetWeightKg: v.optional(v.number()),
    activity: v.optional(activityValidator),
    experience: v.optional(experienceValidator),
    pace: v.optional(paceValidator),

    // Recomputed server-side from the answers above — never accepted from the client.
    calorieGoal: v.optional(v.number()),
    proteinGoal: v.optional(v.number()),
    carbGoal: v.optional(v.number()),
    fatGoal: v.optional(v.number()),
    fiberGoal: v.optional(v.number()),
    sugarGoal: v.optional(v.number()),
    sodiumLimitMg: v.optional(v.number()),

    /**
     * Mirrored from the RevenueCat webhook and nowhere else. This is the flag anything that
     * costs money checks — a client-reported boolean would be an open invoice.
     */
    isPremium: v.boolean(),

    /** Absent until `onboarding.complete` succeeds; the app's "has a plan" test. */
    onboardedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_token_identifier', ['tokenIdentifier'])
    .index('by_clerk_id', ['clerkId']),

  subscriptions: defineTable({
    userId: v.id('users'),
    /** Aliased to the Clerk user id, which is what lets the webhook find the row above. */
    revenueCatAppUserId: v.string(),
    productId: v.optional(v.string()),
    entitlement: v.optional(v.string()),
    status: subscriptionStatusValidator,
    isTrial: v.boolean(),
    willRenew: v.boolean(),
    periodType: v.optional(v.string()),
    trialEndsAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    lastEventType: v.optional(v.string()),
    lastEventAt: v.optional(v.number()),
    /** Always `app_store` for now — this app ships iOS only. */
    store: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_rc_user', ['revenueCatAppUserId']),
});
