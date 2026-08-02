import type { NutritionPlan, PlanInputs } from '@/lib/nutrition';

/**
 * Builds the onboarding plan from the user's answers.
 *
 * ⚠️ This calls OpenAI straight from the device using an `EXPO_PUBLIC_` key, which Expo
 * inlines into the JS bundle — anyone with the app can read it. That is acceptable while
 * developing; before release this request belongs behind a server route (the Convex backend
 * in `plan.md`) so the key never leaves the server.
 */

const ENDPOINT = 'https://api.openai.com/v1/chat/completions';

/** Cheap and fast, and structured outputs keep the shape guaranteed. */
const MODEL = 'gpt-4o-mini';

/** A plan is worth waiting for, but not forever — the screen needs to fail visibly. */
const TIMEOUT_MS = 30_000;

/** Onboarding doesn't ask for age; this matches the assumption in `lib/nutrition.ts`. */
const ASSUMED_AGE = 22;

const SYSTEM_PROMPT = [
  'You are a sports nutritionist building a daily intake plan for a weight-gain app.',
  'The user wants to gain weight, so the calorie target must sit above their maintenance level.',
  'Base the target on the Mifflin-St Jeor equation, scaled by their activity level, plus a surplus that matches their chosen pace.',
  'Protein should scale with bodyweight and training experience.',
  'The macros you return must add back up to the calorie target, using 4 kcal per gram of protein and carbohydrate and 9 kcal per gram of fat.',
  'Round calories to the nearest 10 and every macro to the nearest 5 grams.',
  'Also return sensible daily fiber, added-sugar and sodium targets for this intake level, following standard dietary guidelines.',
  'Never return a calorie target below 1800.',
].join(' ');

/** Structured outputs: the model cannot return a shape other than this one. */
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    calories: { type: 'number', description: 'Daily calorie target in kcal' },
    proteinGrams: { type: 'number', description: 'Daily protein target in grams' },
    carbGrams: { type: 'number', description: 'Daily carbohydrate target in grams' },
    fatGrams: { type: 'number', description: 'Daily fat target in grams' },
    fiberGrams: { type: 'number', description: 'Daily fiber target in grams' },
    sugarGrams: { type: 'number', description: 'Daily added-sugar ceiling in grams' },
    sodiumMg: { type: 'number', description: 'Daily sodium ceiling in milligrams' },
  },
  required: ['calories', 'proteinGrams', 'carbGrams', 'fatGrams', 'fiberGrams', 'sugarGrams', 'sodiumMg'],
  additionalProperties: false,
} as const;

export type AiPlanInputs = PlanInputs & {
  targetWeightKg: number;
};

/** Thrown when the key is absent, so the UI can say so rather than showing a network error. */
export class MissingApiKeyError extends Error {
  constructor() {
    super('EXPO_PUBLIC_OPENAI_API_KEY is not set.');
    this.name = 'MissingApiKeyError';
  }
}

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

export async function generatePlanWithAI(inputs: AiPlanInputs): Promise<NutritionPlan> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) throw new MissingApiKeyError();

  // `fetch` has no timeout of its own, so a hung socket would leave the loading screen
  // spinning indefinitely.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: JSON.stringify({
              gender: inputs.gender,
              ageYears: ASSUMED_AGE,
              heightCm: inputs.heightCm,
              currentWeightKg: inputs.weightKg,
              goalWeightKg: inputs.targetWeightKg,
              activityLevel: inputs.activity,
              gymExperience: inputs.experience,
              bulkingPace: inputs.pace,
            }),
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'daily_plan', strict: true, schema: RESPONSE_SCHEMA },
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenAI request failed (${response.status}): ${detail.slice(0, 200)}`);
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;

    if (typeof content !== 'string') throw new Error('OpenAI returned no plan content.');

    const plan = JSON.parse(content) as Partial<NutritionPlan>;

    // Structured outputs guarantee the keys, not that the values are usable — a zero or a
    // NaN would render as a plan the user might actually try to eat.
    if (
      !isPositiveNumber(plan.calories) ||
      !isPositiveNumber(plan.proteinGrams) ||
      !isPositiveNumber(plan.carbGrams) ||
      !isPositiveNumber(plan.fatGrams) ||
      !isPositiveNumber(plan.fiberGrams) ||
      !isPositiveNumber(plan.sugarGrams) ||
      !isPositiveNumber(plan.sodiumMg)
    ) {
      throw new Error('OpenAI returned an incomplete plan.');
    }

    return {
      calories: Math.round(plan.calories),
      proteinGrams: Math.round(plan.proteinGrams),
      carbGrams: Math.round(plan.carbGrams),
      fatGrams: Math.round(plan.fatGrams),
      fiberGrams: Math.round(plan.fiberGrams),
      sugarGrams: Math.round(plan.sugarGrams),
      sodiumMg: Math.round(plan.sodiumMg),
    };
  } finally {
    clearTimeout(timeout);
  }
}
