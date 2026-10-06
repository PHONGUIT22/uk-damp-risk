import { Metadata } from "next";
import Link from "next/link";
import { getAllAreas, getAllCities, getAreasByCity, getRiskColorClass } from "@/lib/dampData";
import { ShieldCheck, Building2, ArrowRight, Activity, MapPin } from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "UK Outcode Damp & Mould Risk Directory | CheckDamp UK",
  description: "Browse damp risk scores, Victorian solid-wall housing percentages, and poor EPC exposure across all UK postcode districts.",
  alternates: {
    canonical: "https://checkdamp.co.uk/damp-risk",
  },
};

export default function DampRiskIndexPage() {
  const cities = getAllCities();

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20">
      {/* HERO HEADER */}
      <section className="bg-slate-900 text-white pt-16 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-slate-400" /> UK Housing Condition Index • 2026
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase">
            All UK <span className="text-white underline decoration-slate-600 underline-offset-8">Postcode Districts</span>
          </h1>
          <p className="text-slate-400 mt-3 text-base sm:text-lg max-w-2xl">
            Select an outcode below to view local condensation vulnerability, solid-wall housing distribution, and independent surveyor recommendations.
          </p>
        </div>
      </section>

      {/* DIRECTORY GRIDS GROUPED BY CITY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {cities.map((city) => {
          const areas = getAreasByCity(city);
          const avgScore = Math.round(
            areas.reduce((sum, a) => sum + a.damp_risk_score, 0) / (areas.length || 1)
          );

          return (
            <div
              key={city}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      {city} ({areas.length} Postcode Districts)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Average Regional Damp Risk Score: <strong>{avgScore} / 100</strong>
                    </p>
                  </div>
                </div>

                <Link
                  href={`/cities/${city.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-slate-700"
                >
                  <span>View {city} City Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {areas.map((item) => {
                  const isHigh = item.damp_risk_score >= 50;
                  const isMod = item.damp_risk_score >= 35 && item.damp_risk_score < 50;

                  return (
                    <Link
                      key={item.outcode}
                      href={`/damp-risk/${item.outcode.toLowerCase()}`}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300 transition-all flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 group-hover:text-slate-900 text-sm block">
                          {item.outcode}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isHigh
                              ? "bg-rose-100 text-rose-700"
                              : isMod
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {item.risk_level}
                        </span>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400">
                        Score: <strong className="text-slate-800">{item.damp_risk_score}/100</strong>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
