/**
 * Maps Clerk error codes to human copy.
 *
 * Clerk's own `message` / `longMessage` are developer-facing and unstable; `code` is the
 * machine-stable contract. Spec rule: never shame the user, always offer a next step.
 * See https://clerk.com/docs/guides/development/custom-flows/error-handling
 */

type CodeCarrier = { code: string; message?: string; longMessage?: string } | null | undefined;

const MESSAGES: Record<string, string> = {
  // Identifier
  form_identifier_exists: 'You already have an account — sign in instead.',
  form_identifier_not_found: "We couldn't find an account with that email.",
  identifier_already_signed_in: "You're already signed in.",
  form_param_format_invalid: 'That email address doesn’t look right.',
  form_param_nil: 'This field is required.',

  // Password
  form_password_incorrect: 'That password isn’t right. Try again or reset it.',
  form_password_pwned: 'That password has appeared in a data breach. Try another.',
  form_password_length_too_short: 'Use at least 8 characters.',
  form_password_validation_failed: 'That password isn’t strong enough. Try a longer one.',
  form_password_not_strong_enough: 'That password isn’t strong enough. Try a longer one.',

  // Verification codes
  form_code_incorrect: 'That code isn’t right. Check your email and try again.',
  verification_failed: 'That code isn’t right. Check your email and try again.',
  verification_expired: 'That code expired. Send yourself a new one.',
  verification_already_verified: 'That email is already verified.',

  // Rate limiting / bot protection
  too_many_requests: 'Too many attempts. Wait a moment and try again.',
  captcha_invalid: 'We couldn’t verify this device. Try again.',
  captcha_unavailable: 'We couldn’t verify this device. Try again.',

  // Session
  session_exists: 'You’re already signed in.',
};

const FALLBACK = 'Something went wrong. Try again.';

/** Human copy for a Clerk error, field error, or anything else that carries a `code`. */
export function errorMessage(error: CodeCarrier): string | null {
  if (!error) return null;
  return MESSAGES[error.code] ?? error.longMessage ?? error.message ?? FALLBACK;
}

/** True when the identifier simply has no account yet — the cue to switch to sign-up. */
export function isIdentifierNotFound(error: CodeCarrier): boolean {
  return error?.code === 'form_identifier_not_found';
}

/** True when the email is already registered — the cue to switch to sign-in. */
export function isIdentifierExists(error: CodeCarrier): boolean {
  return error?.code === 'form_identifier_exists';
}
