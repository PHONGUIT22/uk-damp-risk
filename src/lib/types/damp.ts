export type RiskLevel = "Low" | "Moderate" | "High" | "Severe";

export interface DampAreaRecord {
  outcode: string;
  city: string;
  lad_code: string;
  total_properties: number;
  pct_poor_epc: number;
  pct_old_build: number;
  pct_terrace_or_flat: number;
  dominant_house_type: string;
  latitude: number;
  longitude: number;
  council_hazard_count: number;
  f1a: number;
  damp_risk_score: number;
  risk_level: RiskLevel | string;
}
