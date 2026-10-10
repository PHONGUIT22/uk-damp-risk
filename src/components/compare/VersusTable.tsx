import {
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  ShieldCheck,
  Building2,
  ThermometerSnowflake,
  Layers,
  Home,
  CheckCircle2,
  CloudRain,
  Droplets,
} from "lucide-react";
import { DampAreaRecord } from "@/lib/types/damp";

interface Props {
  dataA: DampAreaRecord;
  dataB: DampAreaRecord;
}

export default function VersusTable({ dataA, dataB }: Props) {
  const diffScore = Math.abs(dataA.damp_risk_score - dataB.damp_risk_score);
  const isALowerRisk = dataA.damp_risk_score <= dataB.damp_risk_score;

  const getRiskBadgeClass = (score: number) => {
    if (score >= 50) return "bg-rose-100 text-rose-700 border-rose-200";
    if (score >= 35) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 -mt-8 space-y-8">
      {/* CONCLUSION SUMMARY CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          {diffScore === 0 ? (
            <span>
              Both <span className="text-slate-900 underline decoration-slate-400">{dataA.outcode}</span> and{" "}
              <span className="text-slate-900 underline decoration-slate-400">{dataB.outcode}</span> share identical damp risk scores ({dataA.damp_risk_score}/100)
            </span>
          ) : isALowerRisk ? (
            <span>
              Outcode <span className="text-slate-900 underline decoration-slate-400">{dataA.outcode}</span> has a{" "}
              <span className="text-emerald-600">{diffScore} POINT LOWER</span> damp risk score than {dataB.outcode}
            </span>
          ) : (
            <span>
              Outcode <span className="text-slate-900 underline decoration-slate-400">{dataB.outcode}</span> has a{" "}
              <span className="text-emerald-600">{diffScore} POINT LOWER</span> damp risk score than {dataA.outcode}
            </span>
          )}
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-2 leading-relaxed">
          {isALowerRisk
            ? `${dataA.outcode} benefits from a lower concentration of uninsulated solid-wall masonry (${dataA.pct_solid_wall}% vs ${dataB.pct_solid_wall}%) and lower rain exposure (${dataA.wind_driven_rain_exposure} vs ${dataB.wind_driven_rain_exposure}), reducing thermal dew-point condensation.`
            : `${dataB.outcode} benefits from a lower concentration of uninsulated solid-wall masonry (${dataB.pct_solid_wall}% vs ${dataA.pct_solid_wall}%) and lower rain exposure (${dataB.wind_driven_rain_exposure} vs ${dataA.wind_driven_rain_exposure}), reducing thermal dew-point condensation.`}
        </p>
      </div>

      {/* VERSUS DATA MATRIX - SEMANTIC HTML TABLE FOR GOOGLEBOT TABLE SNIPPETS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-sm sm:text-base border-b border-slate-800">
              <th className="p-4 sm:p-6 text-left pl-4 sm:pl-6 text-slate-400 font-medium w-1/3">Metric / Technical Indicator</th>
              <th className="p-4 sm:p-6 font-black text-white w-1/3">{dataA.outcode} ({dataA.city})</th>
              <th className="p-4 sm:p-6 font-black text-white w-1/3">{dataB.outcode} ({dataB.city})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {/* 1. Overall Score */}
            <tr className="bg-slate-50/50">
              <td className="p-4 sm:p-5 text-left pl-4 sm:pl-6 font-black text-slate-900 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-slate-800 shrink-0 hidden sm:inline" />
                  <span>Damp Risk Score</span>
                </span>
              </td>
              <td className="p-4 sm:p-5">
                <div className="flex items-center justify-center gap-1.5 font-black text-lg sm:text-2xl text-slate-900">
                  <span>{dataA.damp_risk_score}</span>
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                  {isALowerRisk && diffScore > 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold ml-1 hidden sm:inline">
                      Better
                    </span>
                  )}
                  {isALowerRisk && <ArrowDown className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
              </td>
              <td className="p-4 sm:p-5">
                <div className="flex items-center justify-center gap-1.5 font-black text-lg sm:text-2xl text-slate-900">
                  <span>{dataB.damp_risk_score}</span>
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                  {!isALowerRisk && diffScore > 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold ml-1 hidden sm:inline">
                      Better
                    </span>
                  )}
                  {!isALowerRisk && <ArrowDown className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
              </td>
            </tr>

            {/* 2. Risk Level */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 sm:p-5 text-left pl-4 sm:pl-6 font-bold text-slate-800 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
                  <span>Severity Classification</span>
                </span>
              </td>
              <td className="p-4 sm:p-5">
                <div className="flex justify-center">
                  <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${getRiskBadgeClass(dataA.damp_risk_score)}`}>
                    {dataA.risk_level}
                  </span>
                </div>
              </td>
              <td className="p-4 sm:p-5">
                <div className="flex justify-center">
                  <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${getRiskBadgeClass(dataB.damp_risk_score)}`}>
                    {dataB.risk_level}
                  </span>
                </div>
              </td>
            </tr>

            {/* 3. Solid Wall Masonry */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 sm:p-5 text-left pl-4 sm:pl-6 font-bold text-slate-800 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
                  <span>Solid Wall Masonry %</span>
                </span>
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataA.pct_solid_wall}%
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataB.pct_solid_wall}%
              </td>
            </tr>

            {/* 4. Pre-1930 Build Density */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 sm:p-5 text-left pl-4 sm:pl-6 font-bold text-slate-800 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
                  <span>Pre-1930 Victorian Builds</span>
                </span>
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataA.pct_old_build}%
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataB.pct_old_build}%
              </td>
            </tr>

            {/* 5. Rain Exposure Index */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 sm:p-5 text-left pl-4 sm:pl-6 font-bold text-slate-800 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
                  <span>Wind-Driven Rain (BS 8104)</span>
                </span>
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataA.wind_driven_rain_exposure}
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataB.wind_driven_rain_exposure}
              </td>
            </tr>

            {/* 6. Winter RH & Dew Point */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 sm:p-5 text-left pl-4 sm:pl-6 font-bold text-slate-800 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
                  <span>Dew Point (@ 20°C room temp)</span>
                </span>
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataA.est_dew_point_c}°C ({dataA.avg_relative_humidity}% RH)
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataB.est_dew_point_c}°C ({dataB.avg_relative_humidity}% RH)
              </td>
            </tr>

            {/* 7. Poor EPC Rating (E-G) */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 sm:p-5 text-left pl-4 sm:pl-6 font-bold text-slate-800 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <ThermometerSnowflake className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
                  <span>Energy Inefficiency (EPC E-G)</span>
                </span>
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataA.pct_poor_epc}%
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataB.pct_poor_epc}%
              </td>
            </tr>

            {/* 8. Terraced or Flat % */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 sm:p-5 text-left pl-4 sm:pl-6 font-bold text-slate-800 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
                  <span>Terraces &amp; Flats</span>
                </span>
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataA.pct_terrace_or_flat}%
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataB.pct_terrace_or_flat}%
              </td>
            </tr>

            {/* 9. Dominant Architecture */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 sm:p-5 text-left pl-4 sm:pl-6 font-bold text-slate-800 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
                  <span>Dominant Architecture</span>
                </span>
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-xs sm:text-sm">
                {dataA.dominant_house_type}
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataB.dominant_house_type}
              </td>
            </tr>

            {/* 10. Total Inspected Properties */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 sm:p-5 text-left pl-4 sm:pl-6 font-bold text-slate-800 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
                  <span>Sample Inspected Homes</span>
                </span>
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-xs sm:text-sm">
                {dataA.total_properties.toLocaleString()}
              </td>
              <td className="p-4 sm:p-5 font-extrabold text-slate-800 text-sm sm:text-base">
                {dataB.total_properties.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}