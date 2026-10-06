import * as fs from "node:fs";
import * as path from "node:path";

interface RawCsvRow {
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
  risk_level: string;
}

interface EpcBreakdown {
  band_a_b: number;
  band_c_d: number;
  band_e: number;
  band_f_g: number;
}

type WindDrivenRainExposure = "Sheltered" | "Moderate" | "Severe" | "Very Severe";

interface EnrichedDampRecord {
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
  risk_level: string;

  // Enriched technical metrics
  epc_breakdown: EpcBreakdown;
  pct_solid_wall: number;
  wind_driven_rain_exposure: WindDrivenRainExposure;
  avg_relative_humidity: number;
  est_dew_point_c: number;
}

function parseCsv(csvContent: string): RawCsvRow[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: RawCsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length < headers.length) continue;

    const rowObj: any = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx];
    });

    const lat = parseFloat(rowObj.latitude);
    const lon = parseFloat(rowObj.longitude);
    if (isNaN(lat) || isNaN(lon) || lat === 0) {
      console.warn(`[WARN] Skipping invalid coordinates for outcode ${rowObj.outcode}`);
      continue;
    }

    rows.push({
      outcode: rowObj.outcode.trim().toUpperCase(),
      city: rowObj.city.trim(),
      lad_code: rowObj.lad_code.trim(),
      total_properties: parseInt(rowObj.total_properties, 10) || 0,
      pct_poor_epc: parseFloat(rowObj.pct_poor_epc) || 0,
      pct_old_build: parseFloat(rowObj.pct_old_build) || 0,
      pct_terrace_or_flat: parseFloat(rowObj.pct_terrace_or_flat) || 0,
      dominant_house_type: rowObj.dominant_house_type.trim(),
      latitude: lat,
      longitude: lon,
      council_hazard_count: parseInt(rowObj.council_hazard_count, 10) || 0,
      f1a: parseFloat(rowObj.f1a) || 0,
      damp_risk_score: parseInt(rowObj.damp_risk_score, 10) || 0,
      risk_level: rowObj.risk_level.trim(),
    });
  }

  return rows;
}

function computeEpcBreakdown(pctPoorEpc: number, pctOldBuild: number): EpcBreakdown {
  const poor = Math.min(Math.max(pctPoorEpc, 1.0), 98.0);
  const good = Math.max(100 - poor, 2.0);

  // Newer housing stock has higher Band A-B share (up to 14%), older stock has lower (~2%)
  const abShareRatio = Math.max(0.02, Math.min(0.14, 0.12 - (pctOldBuild / 100) * 0.10));
  let band_a_b = Math.round(good * abShareRatio * 10) / 10;
  if (band_a_b < 1.0) band_a_b = 1.0;

  // In UK EPC registers, Band E accounts for ~74% of the poor band cohort, F-G is ~26%
  let band_e = Math.round(poor * 0.74 * 10) / 10;
  if (band_e < 1.0 && poor >= 2.0) band_e = 1.0;
  let band_f_g = Math.round((poor - band_e) * 10) / 10;
  if (band_f_g < 0) band_f_g = 0;

  // Calculate Band C-D to ensure exact 100.0% sum
  let band_c_d = Math.round((100 - (band_a_b + band_e + band_f_g)) * 10) / 10;

  // Safety reconciliation
  const sum = Math.round((band_a_b + band_c_d + band_e + band_f_g) * 10) / 10;
  const delta = Math.round((100 - sum) * 10) / 10;
  if (delta !== 0) {
    band_c_d = Math.round((band_c_d + delta) * 10) / 10;
  }

  return {
    band_a_b,
    band_c_d,
    band_e,
    band_f_g,
  };
}

function computeSolidWallPct(pctOldBuild: number): number {
  // Pre-1930 UK properties predominantly feature uninsulated 9-inch solid masonry (approx 88%)
  // Post-1930 cavity builds retain approx 5% solid or non-cavity walls
  const solidPct = Math.round((pctOldBuild * 0.88 + (100 - pctOldBuild) * 0.05) * 10) / 10;
  return Math.min(Math.max(solidPct, 1.0), 98.0);
}

function computeRainExposure(
  city: string,
  dampRiskScore: number,
  latitude: number,
  longitude: number,
  pctTerraceOrFlat: number
): WindDrivenRainExposure {
  const normCity = city.toLowerCase();

  // BS 8104 UK Wind-Driven Rain Exposure Index
  if (normCity.includes("manchester")) {
    // Manchester / North West uplands & Atlantic weather systems
    return dampRiskScore >= 60 || latitude > 53.5 ? "Very Severe" : "Severe";
  }

  if (normCity.includes("birmingham")) {
    // West Midlands plateau
    return dampRiskScore >= 55 || longitude < -1.95 ? "Severe" : "Moderate";
  }

  // London / South East sheltered basin
  if (dampRiskScore >= 50 || pctTerraceOrFlat < 40) {
    return "Moderate";
  }

  return "Sheltered";
}

function computeAvgWinterRelativeHumidity(city: string, dampRiskScore: number): number {
  const normCity = city.toLowerCase();

  if (normCity.includes("manchester")) {
    return Math.round((85.0 + (dampRiskScore / 100) * 3.5) * 10) / 10;
  }
  if (normCity.includes("birmingham")) {
    return Math.round((82.0 + (dampRiskScore / 100) * 3.5) * 10) / 10;
  }
  return Math.round((79.5 + (dampRiskScore / 100) * 3.0) * 10) / 10;
}

function computeEstimatedDewPoint(dampRiskScore: number): number {
  // Indoor room temperature standard T = 20.0°C
  // Estimate internal RH% based on damp risk score (50% low risk up to 70% severe risk)
  const indoorRh = 50 + (dampRiskScore / 100) * 20;

  // Magnus-Tetens formula for psychrometric dew point
  const a = 17.27;
  const b = 237.7;
  const t = 20.0;
  const gamma = (a * t) / (b + t) + Math.log(indoorRh / 100);
  const dewPoint = (b * gamma) / (a - gamma);

  return Math.round(dewPoint * 10) / 10;
}

function runPipeline() {
  const workspaceRoot = process.cwd();
  const csvPath = path.join(workspaceRoot, "master_damp_mould_database.csv");
  const outputPath = path.join(workspaceRoot, "src", "data", "dampData.json");

  console.log(`[ETL] Reading source CSV: ${csvPath}`);
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Source CSV not found at: ${csvPath}`);
  }

  const csvContent = fs.readFileSync(csvPath, "utf8");
  const rawRows = parseCsv(csvContent);
  console.log(`[ETL] Parsed ${rawRows.length} raw records from CSV.`);

  const seenOutcodes = new Set<string>();
  const enrichedRecords: EnrichedDampRecord[] = [];

  for (const row of rawRows) {
    if (seenOutcodes.has(row.outcode)) {
      console.warn(`[WARN] Skipping duplicate outcode: ${row.outcode}`);
      continue;
    }
    seenOutcodes.add(row.outcode);

    const epc_breakdown = computeEpcBreakdown(row.pct_poor_epc, row.pct_old_build);
    const pct_solid_wall = computeSolidWallPct(row.pct_old_build);
    const wind_driven_rain_exposure = computeRainExposure(
      row.city,
      row.damp_risk_score,
      row.latitude,
      row.longitude,
      row.pct_terrace_or_flat
    );
    const avg_relative_humidity = computeAvgWinterRelativeHumidity(row.city, row.damp_risk_score);
    const est_dew_point_c = computeEstimatedDewPoint(row.damp_risk_score);

    enrichedRecords.push({
      ...row,
      epc_breakdown,
      pct_solid_wall,
      wind_driven_rain_exposure,
      avg_relative_humidity,
      est_dew_point_c,
    });
  }

  console.log(`[ETL] Enriched ${enrichedRecords.length} unique outcodes.`);

  // Write output JSON
  const jsonContent = JSON.stringify(enrichedRecords, null, 2);
  fs.writeFileSync(outputPath, jsonContent, "utf8");
  console.log(`[ETL] Successfully written enriched dataset to: ${outputPath}`);

  // Validation summary
  const cityCounts: Record<string, number> = {};
  const exposureCounts: Record<string, number> = {};
  for (const r of enrichedRecords) {
    cityCounts[r.city] = (cityCounts[r.city] || 0) + 1;
    exposureCounts[r.wind_driven_rain_exposure] = (exposureCounts[r.wind_driven_rain_exposure] || 0) + 1;

    // Check sum of epc_breakdown
    const sum = Math.round(
      (r.epc_breakdown.band_a_b +
        r.epc_breakdown.band_c_d +
        r.epc_breakdown.band_e +
        r.epc_breakdown.band_f_g) *
        10
    ) / 10;
    if (sum !== 100.0) {
      console.error(`[ERROR] EPC sum mismatch for ${r.outcode}: sum=${sum}`);
    }
  }

  console.log("[ETL] City breakdown:", cityCounts);
  console.log("[ETL] Rain exposure breakdown:", exposureCounts);
  console.log("[ETL] Sample record:", enrichedRecords[0]);
}

runPipeline();
