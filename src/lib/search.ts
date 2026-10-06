import { getAllAreas, getAreaByOutcode } from "@/lib/dampData";

/**
 * Resolves search queries directly from local dampData (zero database overhead)
 */
export async function resolveSearchDestination(query: string): Promise<string> {
  const clean = query.trim().toUpperCase();
  if (!clean) return "/damp-risk";

  // 1. Direct match on outcode (e.g. "B1", "M14", "WA15")
  const area = getAreaByOutcode(clean);
  if (area) {
    return `/damp-risk/${area.outcode.toLowerCase()}`;
  }

  // 2. City name match
  if (clean.includes("LONDON")) {
    return "/cities/london";
  }
  if (clean.includes("BIRMINGHAM")) {
    return "/cities/birmingham";
  }
  if (clean.includes("MANCHESTER")) {
    return "/cities/manchester";
  }

  // 3. Partial / prefix match on outcode
  const allAreas = getAllAreas();
  const matchedOutcode = allAreas.find((a) => {
    const code = a.outcode.toUpperCase();
    return clean.startsWith(code) || code.startsWith(clean);
  });

  if (matchedOutcode) {
    return `/damp-risk/${matchedOutcode.outcode.toLowerCase()}`;
  }

  // 4. Default fallback
  return "/damp-risk";
}