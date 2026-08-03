/** How long the introductory offer runs. Must match the trial configured on both products. */
export const TRIAL_DAYS = 3;

/** The reminder fires a day before the charge, which is what the middle screen promises. */
export const TRIAL_REMINDER_DAY = TRIAL_DAYS - 1;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * The date the card gets charged, written out — "25 May 2026".
 *
 * Formatted by hand rather than with `toLocaleDateString`: Hermes ships without a guaranteed
 * full `Intl`, so the locale-aware call silently degrades to something unhelpful on device.
 * The same reason `result.tsx` groups thousands by regex.
 */
export function trialChargeDate(from: number = Date.now()): string {
  const date = new Date(from + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
