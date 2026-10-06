import Link from "next/link";
import { AlertTriangle, ShieldCheck, ArrowRight, Home, ThermometerSnowflake } from "lucide-react";
import { getTopRiskAreas, getLowestRiskAreas, getRiskColorClass } from "@/lib/dampData";

export default function TopRankingGrid() {
  const highestRisk = getTopRiskAreas(5);
  const lowestRisk = getLowestRiskAreas(5);

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200/60 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            UK Damp &amp; Mould Risk Rankings
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            High vs Low vulnerability postal districts based on EPC efficiency ratings and Victorian solid-wall housing density.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CARD 1: KHU VỰC NGUY CƠ CAO NHẤT */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Highest Damp Risk Areas</h3>
                  <p className="text-xs text-slate-500">Uninsulated solid walls &amp; high moisture load</p>
                </div>
              </div>
              <span className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-full border border-rose-200">
                Action Advised
              </span>
            </div>

            <div className="space-y-3">
              {highestRisk.map((item, idx) => {
                const color = getRiskColorClass(item.risk_level);
                return (
                  <Link
                    key={item.outcode}
                    href={`/damp-risk/${item.outcode.toLowerCase()}`}
                    className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors group border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-xs font-black text-rose-500 group-hover:text-rose-600">
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="font-black text-slate-900 text-sm group-hover:text-slate-900 group-hover:underline transition-colors uppercase block">
                          Outcode {item.outcode} • {item.city}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {item.pct_old_build}% Pre-1930 • {item.dominant_house_type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900 text-sm block">
                        {item.damp_risk_score} / 100
                      </span>
                      <span className="text-[11px] font-bold text-rose-600 uppercase">
                        {item.risk_level} Risk
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CARD 2: KHU VỰC NGUY CƠ THẤP NHẤT */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Lowest Damp Risk Areas</h3>
                  <p className="text-xs text-slate-500">Modern insulated builds &amp; low condensation</p>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                Low Vulnerability
              </span>
            </div>

            <div className="space-y-3">
              {lowestRisk.map((item, idx) => (
                <Link
                  key={item.outcode}
                  href={`/damp-risk/${item.outcode.toLowerCase()}`}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors group border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs font-black text-emerald-500 group-hover:text-emerald-600">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="font-black text-slate-900 text-sm group-hover:text-slate-900 group-hover:underline transition-colors uppercase block">
                        Outcode {item.outcode} • {item.city}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {item.pct_old_build}% Pre-1930 • {item.dominant_house_type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-sm block">
                      {item.damp_risk_score} / 100
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase">
                      {item.risk_level} Risk
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}