// Relative, not `@/` — this module is bundled into Convex functions, whose tsconfig carries
// no path aliases.
import type { ActivityLevel, Gender, GymExperience, Pace } from './onboardingTypes';

/**
 * Pure plan math — no React, no I/O, so every number on the result screen can be checked by
 * hand against the formulas in `plan.md` §5.
 */

/** Onboarding deliberately doesn't ask for age; this is the audience median. */
const ASSUMED_AGE = 22;

/** Mifflin-St Jeor sex constants. */
const BMR_CONSTANT: Record<Gender, number> = {
  male: 5,
  female: -161,
};

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

/** Daily calories above maintenance. Roughly 7,700 kcal buys a kilogram. */
const PACE_SURPLUS: Record<Pace, number> = {
  lean: 300,
  moderate: 450,
  aggressive: 600,
};

/** What each surplus buys per week, in kilograms — the number shown on the pace slider. */
export const PACE_WEEKLY_GAIN_KG: Record<Pace, number> = {
  lean: 0.25,
  moderate: 0.375,
  aggressive: 0.5,
};

/** Grams of protein per kg of bodyweight, before the experience bump. */
const PACE_PROTEIN_PER_KG: Record<Pace, number> = {
  lean: 1.6,
  moderate: 1.8,
  aggressive: 2.0,
};

/** Trained lifters hold more mass to feed. */
const EXPERIENCE_PROTEIN_BONUS: Record<GymExperience, number> = {
  beginner: 0,
  intermediate: 0,
  advanced: 0.1,
  expert: 0.1,
};

/** A quarter of intake from fat leaves carbs to carry the surplus, which is what bulks need. */
const FAT_SHARE_OF_CALORIES = 0.25;

const CALORIES_PER_GRAM = { protein: 4, carbs: 4, fat: 9 } as const;

/** Nobody should be told to eat less than this, whatever the inputs say. */
const CALORIE_FLOOR = 1800;
const PROTEIN_RANGE = { min: 80, max: 220 };

/** The dietary-guideline figures the secondary targets are derived from. */
const FIBER_GRAMS_PER_1000_KCAL = 14;
/** Added sugar is capped at a tenth of intake. */
const SUGAR_SHARE_OF_CALORIES = 0.1;
/** A flat daily ceiling rather than a target — it doesn't scale with intake. */
const SODIUM_CEILING_MG = 2300;

const roundTo = (value: number, nearest: number) => Math.round(value / nearest) * nearest;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export type NutritionPlan = {
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  /** Secondary targets — shown collapsed under the three headline macros. */
  fiberGrams: number;
  sugarGrams: number;
  sodiumMg: number;
};

export type PlanInputs = {
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activity: ActivityLevel;
  experience: GymExperience;
  pace: Pace;
};

/** Mifflin-St Jeor resting burn. */
export function basalMetabolicRate({ gender, heightCm, weightKg }: PlanInputs) {
  return 10 * weightKg + 6.25 * heightCm - 5 * ASSUMED_AGE + BMR_CONSTANT[gender];
}

/** Maintenance calories: resting burn scaled by how much the user moves. */
export function totalDailyEnergyExpenditure(inputs: PlanInputs) {
  return basalMetabolicRate(inputs) * ACTIVITY_MULTIPLIER[inputs.activity];
}

export function calculatePlan(inputs: PlanInputs): NutritionPlan {
  const calories = Math.max(
    CALORIE_FLOOR,
    roundTo(totalDailyEnergyExpenditure(inputs) + PACE_SURPLUS[inputs.pace], 10),
  );

  const proteinPerKg = PACE_PROTEIN_PER_KG[inputs.pace] + EXPERIENCE_PROTEIN_BONUS[inputs.experience];
  const proteinGrams = clamp(
    roundTo(proteinPerKg * inputs.weightKg, 5),
    PROTEIN_RANGE.min,
    PROTEIN_RANGE.max,
  );

  const fatGrams = roundTo((calories * FAT_SHARE_OF_CALORIES) / CALORIES_PER_GRAM.fat, 5);

  // Carbs take whatever the other two leave, so the three macros always add back up to the
  // calorie target rather than drifting apart from it.
  const remainingCalories =
    calories - proteinGrams * CALORIES_PER_GRAM.protein - fatGrams * CALORIES_PER_GRAM.fat;
  const carbGrams = Math.max(0, roundTo(remainingCalories / CALORIES_PER_GRAM.carbs, 5));

  const fiberGrams = roundTo((calories / 1000) * FIBER_GRAMS_PER_1000_KCAL, 1);
  const sugarGrams = roundTo((calories * SUGAR_SHARE_OF_CALORIES) / CALORIES_PER_GRAM.carbs, 5);

  return { calories, proteinGrams, carbGrams, fatGrams, fiberGrams, sugarGrams, sodiumMg: SODIUM_CEILING_MG };
}
