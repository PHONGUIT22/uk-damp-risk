/**
 * Whitelist of high-intent, indexable damp risk comparison pairs.
 * Outcode head-to-head comparisons (e.g. b21-vs-b1).
 */
export const POPULAR_COMPARE_PAIRS = [
  "b21-vs-b1",
  "b11-vs-m1",
  "m14-vs-m15",
  "b10-vs-m14",
  "b1-vs-m1",
  "b21-vs-m14",
  "b23-vs-m20",
  "b13-vs-m21",
] as const;

export type PopularComparePair = (typeof POPULAR_COMPARE_PAIRS)[number];

export function isPopularComparePair(slug: string): boolean {
  if (!slug) return false;
  const normalized = slug.trim().toLowerCase();
  return (POPULAR_COMPARE_PAIRS as readonly string[]).includes(normalized);
}

/**
 * Returns the canonical whitelist pair if the given slug is the reverse of a whitelisted pair.
 * e.g. "b1-vs-b21" -> "b21-vs-b1"
 */
export function getCanonicalPairForReverse(slug: string): string | null {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();
  const parts = normalized.split("-vs-");
  if (parts.length !== 2) return null;
  const reverse = `${parts[1]}-vs-${parts[0]}`;
  if ((POPULAR_COMPARE_PAIRS as readonly string[]).includes(reverse)) {
    return reverse;
  }
  return null;
}
