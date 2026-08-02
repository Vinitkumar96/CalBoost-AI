/**
 * Joins conditional class names, dropping falsy entries.
 *
 * Deliberately does not merge conflicting utilities — Tailwind resolves conflicts by
 * stylesheet order, not string order, so variants below build mutually exclusive sets
 * rather than relying on a later class winning.
 */
export function cn(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}
