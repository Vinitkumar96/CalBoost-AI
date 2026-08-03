import { v } from 'convex/values';

// Relative, not `@/` — `convex/tsconfig.json` carries no path aliases. `lib/nutrition.ts` is
// pure math with no React import, which is what makes it safe to bundle into a function.
import { calculatePlan } from '../lib/nutrition';
import { mutation } from './_generated/server';
import {
  activityValidator,
  experienceValidator,
  genderValidator,
  paceValidator,
} from './schema';
import { upsertCurrentUser } from './users';

/**
 * The one write the whole onboarding flow makes. Everything before it is a client-side draft,
 * so a user who drops out at step 4 leaves no row behind.
 *
 * Note what is *not* an argument: the generated plan. The client computes one to show on the
 * result screen, but the goals stored here are recomputed from the answers — otherwise the
 * calorie target that gates the whole app would be whatever a modified client claimed.
 */
export const complete = mutation({
  args: {
    gender: genderValidator,
    heightCm: v.number(),
    weightKg: v.number(),
    targetWeightKg: v.number(),
    activity: activityValidator,
    experience: experienceValidator,
    pace: paceValidator,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await upsertCurrentUser(ctx);

    const plan = calculatePlan({
      gender: args.gender,
      heightCm: args.heightCm,
      weightKg: args.weightKg,
      activity: args.activity,
      experience: args.experience,
      pace: args.pace,
    });

    // A patch rather than an insert, so re-running the flow — a user redoing onboarding from
    // the profile screen later — overwrites the plan instead of orphaning the old one.
    await ctx.db.patch(userId, {
      gender: args.gender,
      heightCm: args.heightCm,
      weightKg: args.weightKg,
      targetWeightKg: args.targetWeightKg,
      activity: args.activity,
      experience: args.experience,
      pace: args.pace,
      calorieGoal: plan.calories,
      proteinGoal: plan.proteinGrams,
      carbGoal: plan.carbGrams,
      fatGoal: plan.fatGrams,
      fiberGoal: plan.fiberGrams,
      sugarGoal: plan.sugarGrams,
      sodiumLimitMg: plan.sodiumMg,
      onboardedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return null;
  },
});
