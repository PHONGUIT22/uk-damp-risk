"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { DampAreaRecord } from "@/lib/types/damp";

interface CityOutcodeGridProps {
  cityName: string;
  outcodes: DampAreaRecord[];
}

export default function CityOutcodeGrid({ cityName, outcodes }: CityOutcodeGridProps) {
  const [search, setSearch] = useState("");

  const filtered = outcodes.filter((item) =>
    item.outcode.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-cyan-600" />
            {cityName} Postcode Districts ({outcodes.length})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse local damp vulnerability metrics, solid-wall housing distribution, and surveyor quotes.
          </p>
        </div>

        {outcodes.length > 6 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter outcode (e.g. B1, M14)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
            />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No outcodes matching &ldquo;{search}&rdquo;. Try another search term.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((item) => {
            const isHigh = item.damp_risk_score >= 50;
            const isMod = item.damp_risk_score >= 35 && item.damp_risk_score < 50;

            return (
              <Link
                key={item.outcode}
                href={`/damp-risk/${item.outcode.toLowerCase()}`}
                className="group flex flex-col justify-between p-3.5 rounded-2xl border border-slate-200/70 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 group-hover:text-cyan-700 text-base">
                    {item.outcode}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="mt-2 flex items-center justify-between">
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
                  <span className="text-xs font-black text-slate-800">
                    {item.damp_risk_score}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
