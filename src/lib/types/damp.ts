export type RiskLevel = "Low" | "Moderate" | "High" | "Severe";

export type WindDrivenRainExposure = "Sheltered" | "Moderate" | "Severe" | "Very Severe";

export interface EpcBreakdown {
  band_a_b: number;
  band_c_d: number;
  band_e: number;
  band_f_g: number;
}

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

  // Enriched quantitative technical metrics
  epc_breakdown: EpcBreakdown;
  pct_solid_wall: number;
  wind_driven_rain_exposure: WindDrivenRainExposure;
  avg_relative_humidity: number;
  est_dew_point_c: number;
}
