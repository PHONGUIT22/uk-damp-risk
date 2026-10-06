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

      {/* VERSUS DATA MATRIX */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="grid grid-cols-3 bg-slate-900 text-white p-4 sm:p-6 text-center font-bold text-sm sm:text-base">
          <div className="text-left pl-2 text-slate-400 font-medium">Metric / Technical Indicator</div>
          <div className="font-black text-white">{dataA.outcode} ({dataA.city})</div>
          <div className="font-black text-white">{dataB.outcode} ({dataB.city})</div>
        </div>

        {/* ROWS */}
        <div className="divide-y divide-slate-100 text-slate-700">
          {/* 1. Overall Score */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center bg-slate-50/50">
            <div className="flex items-center gap-2 font-black text-slate-900 text-xs sm:text-sm text-left pl-2">
              <AlertTriangle className="w-4 h-4 text-slate-800 shrink-0 hidden sm:inline" />
              <span>Damp Risk Score</span>
            </div>
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
          </div>

          {/* 2. Risk Level */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
              <span>Severity Classification</span>
            </div>
            <div className="flex justify-center">
              <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${getRiskBadgeClass(dataA.damp_risk_score)}`}>
                {dataA.risk_level}
              </span>
            </div>
            <div className="flex justify-center">
              <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${getRiskBadgeClass(dataB.damp_risk_score)}`}>
                {dataB.risk_level}
              </span>
            </div>
          </div>

          {/* 3. Solid Wall Masonry */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <Building2 className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
              <span>Solid Wall Masonry %</span>
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataA.pct_solid_wall}%
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataB.pct_solid_wall}%
            </div>
          </div>

          {/* 4. Pre-1930 Build Density */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <Home className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
              <span>Pre-1930 Victorian Builds</span>
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataA.pct_old_build}%
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataB.pct_old_build}%
            </div>
          </div>

          {/* 5. Rain Exposure Index */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <CloudRain className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
              <span>Wind-Driven Rain (BS 8104)</span>
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataA.wind_driven_rain_exposure}
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataB.wind_driven_rain_exposure}
            </div>
          </div>

          {/* 6. Winter RH & Dew Point */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <Droplets className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
              <span>Dew Point (@ 20°C room temp)</span>
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataA.est_dew_point_c}°C ({dataA.avg_relative_humidity}% RH)
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataB.est_dew_point_c}°C ({dataB.avg_relative_humidity}% RH)
            </div>
          </div>

          {/* 7. Poor EPC Rating (E-G) */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <ThermometerSnowflake className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
              <span>Energy Inefficiency (EPC E-G)</span>
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataA.pct_poor_epc}%
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataB.pct_poor_epc}%
            </div>
          </div>

          {/* 8. Terraced or Flat % */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <Layers className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
              <span>Terraces &amp; Flats</span>
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataA.pct_terrace_or_flat}%
            </div>
            <div className="font-extrabold text-slate-800 text-sm sm:text-base">
              {dataB.pct_terrace_or_flat}%
            </div>
          </div>

          {/* 9. Dominant Architecture */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <Home className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
              <span>Dominant Architecture</span>
            </div>
            <div className="font-extrabold text-slate-800 text-xs sm:text-sm">
              {dataA.dominant_house_type}
            </div>
            <div className="font-extrabold text-slate-800 text-xs sm:text-sm">
              {dataB.dominant_house_type}
            </div>
          </div>

          {/* 10. Total Inspected Properties */}
          <div className="grid grid-cols-3 p-4 sm:p-5 items-center text-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm text-left pl-2">
              <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 hidden sm:inline" />
              <span>Sample Inspected Homes</span>
            </div>
            <div className="font-extrabold text-slate-800 text-xs sm:text-sm">
              {dataA.total_properties.toLocaleString()}
            </div>
            <div className="font-extrabold text-slate-800 text-xs sm:text-sm">
              {dataB.total_properties.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}