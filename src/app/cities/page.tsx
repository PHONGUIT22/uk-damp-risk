import { Metadata } from "next";
import Link from "next/link";
import { getAllCities, getAreasByCity } from "@/lib/dampData";
import { ChevronRight, Building2, ShieldCheck, MapPin, ArrowRight, AlertTriangle } from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "UK Cities Damp & Mould Risk Directory | CheckDamp UK",
  description: "Compare damp risk scores, Victorian solid-wall housing density, and poor EPC exposure across Birmingham, Manchester, and major UK metropolitan regions.",
  alternates: {
    canonical: "https://checkdamp.co.uk/cities",
  },
};

export default function CitiesDirectoryPage() {
  const cities = getAllCities();

  const cityCards = cities.map((city) => {
    const areas = getAreasByCity(city);
    const avgScore = Math.round(
      areas.reduce((sum, a) => sum + a.damp_risk_score, 0) / (areas.length || 1)
    );
    const avgOldBuild = Math.round(
      (areas.reduce((sum, a) => sum + a.pct_old_build, 0) / (areas.length || 1)) * 10
    ) / 10;
    const avgPoorEpc = Math.round(
      (areas.reduce((sum, a) => sum + a.pct_poor_epc, 0) / (areas.length || 1)) * 10
    ) / 10;
    const highestRisk = [...areas].sort((a, b) => b.damp_risk_score - a.damp_risk_score)[0];

    return {
      name: city,
      slug: city.toLowerCase(),
      totalAreas: areas.length,
      avgScore,
      avgOldBuild,
      avgPoorEpc,
      highestRiskOutcode: highestRisk?.outcode || "",
      highestRiskScore: highestRisk?.damp_risk_score || 0,
    };
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">UK Cities Directory</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-900 text-white pt-16 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-slate-400" /> Metropolitan Housing Condition Index
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase">
            UK Cities <span className="text-white underline decoration-slate-600 underline-offset-8">Damp Risk Directory</span>
          </h1>
          <p className="text-slate-400 mt-3 text-base sm:text-lg max-w-2xl">
            Compare metropolitan condensation risks, Victorian solid-wall housing prevalence, and energy inefficiency ratings across major UK cities.
          </p>
        </div>
      </section>

      {/* City Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cityCards.map((city) => (
            <div
              key={city.slug}
              className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-black text-xl">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{city.name}</h2>
                      <span className="text-xs text-slate-500">
                        {city.totalAreas} Postcode Districts Monitored
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase block">
                      Avg Risk Score
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      {city.avgScore} / 100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 my-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Solid Walls</span>
                    <strong className="text-slate-800 text-sm">{city.avgOldBuild}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Poor EPC</span>
                    <strong className="text-slate-800 text-sm">{city.avgPoorEpc}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Hotspot</span>
                    <strong className="text-rose-600 text-sm">{city.highestRiskOutcode} ({city.highestRiskScore})</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Extensive analysis of Victorian solid-brick terraces, energy efficiency ratings, and winter condensation mechanics across {city.name}.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {city.totalAreas} outcodes available
                </span>
                <Link
                  href={`/cities/${city.slug}`}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-sm"
                >
                  <span>Explore {city.name} Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
