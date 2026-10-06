import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { getAllAreas, getRiskColorClass } from "@/lib/dampData";

export default function OutcodeDirectory() {
  const areas = getAllAreas();

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center justify-center sm:justify-start gap-2">
          <Building2 className="w-7 h-7 text-slate-800" /> Outcode Risk Directory ({areas.length} Postcode Districts)
        </h2>
        <p className="text-slate-600 mt-2 text-sm">
          Browse comprehensive damp, condensation, and solid-wall housing profiles across Birmingham and Manchester.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {areas.map((item) => {
          const isHigh = item.damp_risk_score >= 50;
          const isMod = item.damp_risk_score >= 35 && item.damp_risk_score < 50;

          return (
            <Link
              key={item.outcode}
              href={`/damp-risk/${item.outcode.toLowerCase()}`}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 group-hover:text-slate-900 group-hover:underline transition-colors text-base block">
                    {item.outcode}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
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
                <span className="text-[11px] text-slate-500 block truncate mt-1">
                  {item.city}
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Score</span>
                <span className="font-black text-slate-900">{item.damp_risk_score} / 100</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}