import { v } from 'convex/values';

import type { Doc, Id } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';
import { mutation, query } from './_generated/server';

/**
 * Resolves the caller to their row, or `null` when signed out or not yet created.
 *
 * Keyed on `tokenIdentifier` rather than `subject`: only the former is guaranteed unique
 * across providers, so it is the one safe ownership key.
 */
export async function getCurrentUser(ctx: QueryCtx): Promise<Doc<'users'> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) return null;

  return ctx.db
    .query('users')
    .withIndex('by_token_identifier', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
    .unique();
}

/**
 * The same lookup for writes, but refusing rather than returning null — a mutation that
 * silently no-ops on a missing session is a bug that only shows up in production.
 *
 * The two failures are reported separately on purpose: "signed in but no row" is a race with
 * whatever creates the row, not an auth problem, and reporting it as "Not signed in" sends
 * you looking at Clerk for an hour. Anything that can legitimately run before the row exists
 * should call `upsertCurrentUser` instead.
 */
export async function requireCurrentUser(ctx: MutationCtx): Promise<Doc<'users'>> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) throw new Error('Not signed in');

  const user = await getCurrentUser(ctx);
  if (user === null) throw new Error('Signed in, but no user row exists yet');

  return user;
}

/**
 * Creates the row if this is the identity's first request, and refreshes the profile fields
 * Clerk owns if it isn't. Returns the id either way.
 */
export async function upsertCurrentUser(ctx: MutationCtx): Promise<Id<'users'>> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) throw new Error('Not signed in');

  const now = Date.now();
  const existing = await ctx.db
    .query('users')
    .withIndex('by_token_identifier', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
    .unique();

  // Clerk is the source of truth for name and email, so they are re-read on every call
  // rather than frozen at signup — a user who changes their email should see it change here.
  const profile = {
    email: identity.email,
    name: identity.name,
    updatedAt: now,
  };

  if (existing !== null) {
    await ctx.db.patch(existing._id, profile);
    return existing._id;
  }

  return ctx.db.insert('users', {
    tokenIdentifier: identity.tokenIdentifier,
    clerkId: identity.subject,
    ...profile,
    // Entitlement starts false and only ever moves via the RevenueCat webhook.
    isPremium: false,
    createdAt: now,
  });
}

/**
 * The app's root query: every layout gate and most screens read from this one subscription.
 * Returning `null` rather than throwing lets the client distinguish "still loading"
 * (`undefined`) from "signed out or brand new" (`null`).
 */
export const current = query({
  args: {},
  returns: v.union(v.null(), v.any()),
  handler: (ctx) => getCurrentUser(ctx),
});

/**
 * Idempotent first-touch, called once the Clerk session lands. Split out from
 * `onboarding.complete` so a user who signs in without a pending draft — a returning user on
 * a new device — still gets a row.
 */
export const ensureCurrent = mutation({
  args: {},
  returns: v.id('users'),
  handler: (ctx) => upsertCurrentUser(ctx),
});
