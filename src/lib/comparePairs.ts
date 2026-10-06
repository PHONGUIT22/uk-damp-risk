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
