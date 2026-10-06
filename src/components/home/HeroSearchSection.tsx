"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ShieldCheck, Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { dampData } from "@/lib/dampData";
import { DampAreaRecord } from "@/lib/types/damp";

export default function HeroSearchSection() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fast client-side filtering on 69 outcodes
  const searchResults = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return [];

    return dampData
      .filter((item) => {
        return (
          item.outcode.toUpperCase().includes(q) ||
          item.city.toUpperCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectArea = (outcode: string) => {
    setIsSearching(true);
    setIsOpen(false);
    router.push(`/damp-risk/${outcode.toLowerCase()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean) {
      router.push("/damp-risk");
      return;
    }

    setIsSearching(true);
    // Exact or first match
    const exact = dampData.find((a) => a.outcode.toUpperCase() === clean);
    if (exact) {
      router.push(`/damp-risk/${exact.outcode.toLowerCase()}`);
      return;
    }

    if (searchResults.length > 0) {
      router.push(`/damp-risk/${searchResults[0].outcode.toLowerCase()}`);
      return;
    }

    if (clean.includes("LONDON")) {
      router.push("/cities/london");
      return;
    }
    if (clean.includes("BIRMINGHAM")) {
      router.push("/cities/birmingham");
      return;
    }
    if (clean.includes("MANCHESTER")) {
      router.push("/cities/manchester");
      return;
    }

    router.push("/damp-risk");
  };

  const getRiskBadge = (score: number, level: string) => {
    if (score >= 50) {
      return "bg-rose-100 text-rose-700 border-rose-200";
    }
    if (score >= 35) {
      return "bg-amber-100 text-amber-800 border-amber-200";
    }
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  return (
    <section className="pt-12 pb-16 px-4 text-center max-w-5xl mx-auto relative">
      {/* Trust Badge */}
      <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 mb-8 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-slate-700" />
        <span>Independent UK EPC &amp; Housing Condition Register (2026)</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] mb-6 uppercase">
        UK Damp &amp; Mould <br className="hidden sm:inline" />
        <span className="text-slate-900 underline decoration-slate-400 underline-offset-8">Risk Explorer.</span>
      </h1>

      <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
        Check local condensation risk scores, solid wall vulnerability (% Victorian builds), and poor EPC exposure across <strong>UK Postcode Districts</strong>.
      </p>

      {/* Big Search Input with Client-side Filter */}
      <div className="relative max-w-2xl mx-auto" ref={dropdownRef}>
        <form
          onSubmit={handleSearch}
          className="bg-white p-3 rounded-3xl shadow-xl border border-slate-200/90 flex flex-col sm:flex-row items-center gap-3 relative z-20"
        >
          <div className="flex items-center gap-3 px-4 py-2 w-full">
            <MapPin className="w-6 h-6 text-slate-700 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                if (query.trim()) setIsOpen(true);
              }}
              placeholder="Enter UK Outcode (e.g. B1, M14, B21)..."
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none font-medium text-base sm:text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-base shrink-0 cursor-pointer disabled:opacity-50 shadow-md"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span>Search Area</span>
          </button>
        </form>

        {/* Live Filter Autocomplete Dropdown */}
        {isOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-30 overflow-hidden text-left divide-y divide-slate-100">
            {searchResults.map((item) => (
              <button
                key={item.outcode}
                type="button"
                onClick={() => handleSelectArea(item.outcode)}
                className="w-full px-5 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-slate-700 group-hover:text-slate-900 font-black text-sm">
                    {item.outcode}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm group-hover:text-slate-900">
                      {item.outcode} • {item.city}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {item.dominant_house_type} • {item.pct_old_build}% Pre-1930 Build
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getRiskBadge(
                      item.damp_risk_score,
                      item.risk_level
                    )}`}
                  >
                    {item.risk_level} ({item.damp_risk_score}/100)
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* POPULAR DAMP HOTSPOTS */}
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500 flex-wrap">
        <span className="font-bold text-slate-700">Featured Postcodes:</span>
        <Link
          href="/damp-risk/b21"
          className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full hover:bg-rose-100 transition-colors"
        >
          B21 (Handsworth - 58 High)
        </Link>
        <Link
          href="/damp-risk/b11"
          className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full hover:bg-rose-100 transition-colors"
        >
          B11 (Sparkhill - 57 High)
        </Link>
        <Link
          href="/damp-risk/m14"
          className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full hover:bg-amber-100 transition-colors"
        >
          M14 (Fallowfield - 42 Mod)
        </Link>
        <Link
          href="/damp-risk/b1"
          className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full hover:bg-emerald-100 transition-colors"
        >
          B1 (Birmingham - 18 Low)
        </Link>
        <Link
          href="/damp-risk/m1"
          className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full hover:bg-emerald-100 transition-colors"
        >
          M1 (Manchester - 24 Low)
        </Link>
      </div>
    </section>
  );
}