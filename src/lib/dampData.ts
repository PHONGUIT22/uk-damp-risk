import dampDataRaw from "@/data/dampData.json";
import { DampAreaRecord, WindDrivenRainExposure } from "@/lib/types/damp";

export const dampData: DampAreaRecord[] = dampDataRaw as DampAreaRecord[];

/**
 * Returns all damp area records.
 */
export function getAllAreas(): DampAreaRecord[] {
  return dampData;
}

/**
 * Returns list of unique outcode strings.
 */
export function getAllOutcodes(): string[] {
  return dampData.map((area) => area.outcode);
}

/**
 * Find an area record by its outcode (case-insensitive).
 */
export function getAreaByOutcode(outcode: string): DampAreaRecord | undefined {
  if (!outcode) return undefined;
  const clean = outcode.trim().toUpperCase();
  return dampData.find((area) => area.outcode.toUpperCase() === clean);
}

/**
 * Find all area records for a given city (case-insensitive).
 */
export function getAreasByCity(city: string): DampAreaRecord[] {
  if (!city) return [];
  const clean = city.trim().toLowerCase();
  return dampData.filter((area) => area.city.toLowerCase() === clean);
}

/**
 * Get areas with highest damp risk scores.
 */
export function getTopRiskAreas(limit: number = 10): DampAreaRecord[] {
  return [...dampData]
    .sort((a, b) => b.damp_risk_score - a.damp_risk_score)
    .slice(0, limit);
}

/**
 * Get areas with lowest damp risk scores.
 */
export function getLowestRiskAreas(limit: number = 10): DampAreaRecord[] {
  return [...dampData]
    .sort((a, b) => a.damp_risk_score - b.damp_risk_score)
    .slice(0, limit);
}

/**
 * Get unique city names.
 */
export function getAllCities(): string[] {
  const cities = new Set<string>();
  dampData.forEach((item) => cities.add(item.city));
  return Array.from(cities).sort();
}

/**
 * Color classes and badge metadata helper for Risk Levels
 */
export function getRiskColorClass(levelOrScore: string | number): {
  badgeBg: string;
  badgeText: string;
  border: string;
  bgLight: string;
  text: string;
} {
  let level = typeof levelOrScore === "string" ? levelOrScore.toLowerCase() : "";
  if (typeof levelOrScore === "number") {
    if (levelOrScore >= 70) level = "severe";
    else if (levelOrScore >= 50) level = "high";
    else if (levelOrScore >= 35) level = "moderate";
    else level = "low";
  }

  switch (level) {
    case "severe":
      return {
        badgeBg: "bg-red-600 text-white",
        badgeText: "text-red-700",
        border: "border-red-500",
        bgLight: "bg-red-50",
        text: "text-red-600",
      };
    case "high":
      return {
        badgeBg: "bg-rose-500 text-white",
        badgeText: "text-rose-700",
        border: "border-rose-400",
        bgLight: "bg-rose-50",
        text: "text-rose-600",
      };
    case "moderate":
      return {
        badgeBg: "bg-amber-500 text-white",
        badgeText: "text-amber-800",
        border: "border-amber-400",
        bgLight: "bg-amber-50",
        text: "text-amber-600",
      };
    case "low":
    default:
      return {
        badgeBg: "bg-emerald-600 text-white",
        badgeText: "text-emerald-800",
        border: "border-emerald-400",
        bgLight: "bg-emerald-50",
        text: "text-emerald-600",
      };
  }
}

/**
 * Color classes and badge metadata helper for Wind-Driven Rain Exposure
 */
export function getRainExposureColorClass(exposure: WindDrivenRainExposure | string): {
  badgeBg: string;
  badgeText: string;
  border: string;
  text: string;
} {
  switch (exposure) {
    case "Very Severe":
      return {
        badgeBg: "bg-purple-100 text-purple-900",
        badgeText: "text-purple-700",
        border: "border-purple-300",
        text: "text-purple-600",
      };
    case "Severe":
      return {
        badgeBg: "bg-blue-100 text-blue-900",
        badgeText: "text-blue-700",
        border: "border-blue-300",
        text: "text-blue-600",
      };
    case "Moderate":
      return {
        badgeBg: "bg-amber-100 text-amber-900",
        badgeText: "text-amber-800",
        border: "border-amber-300",
        text: "text-amber-600",
      };
    case "Sheltered":
    default:
      return {
        badgeBg: "bg-emerald-100 text-emerald-900",
        badgeText: "text-emerald-800",
        border: "border-emerald-300",
        text: "text-emerald-600",
      };
  }
}

