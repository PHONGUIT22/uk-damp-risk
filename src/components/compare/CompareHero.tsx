"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, ArrowRightLeft, Search, MapPin, Loader2 } from "lucide-react";
import { dampData } from "@/lib/dampData";
import { DampAreaRecord } from "@/lib/types/damp";

interface Props {
  locA: string;
  locB: string;
  dataA?: DampAreaRecord | null;
  dataB?: DampAreaRecord | null;
}

export default function CompareHero({ locA, locB, dataA, dataB }: Props) {
  const [inputA, setInputA] = useState(locA);
  const [inputB, setInputB] = useState(locB);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const resolveOutcodeSlug = (inputVal: string, fallback: string) => {
    const clean = inputVal.trim().toUpperCase();
    if (!clean) return fallback.toLowerCase();

    const match = dampData.find((a) => a.outcode.toUpperCase() === clean);
    if (match) return match.outcode.toLowerCase();

    const partial = dampData.find((a) => a.outcode.toUpperCase().startsWith(clean));
    if (partial) return partial.outcode.toLowerCase();

    return fallback.toLowerCase();
  };

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputA.trim() || !inputB.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const slugA = resolveOutcodeSlug(inputA, locA || "b21");
    const slugB = resolveOutcodeSlug(inputB, locB || "b1");

    router.push(`/compare/${slugA}-vs-${slugB}`);
  };

  const handleSwap = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const newA = inputB;
    const newB = inputA;
    setInputA(newA);
    setInputB(newB);

    const slugA = resolveOutcodeSlug(newA, locB || "b1");
    const slugB = resolveOutcodeSlug(newB, locA || "b21");

    router.push(`/compare/${slugA}-vs-${slugB}`);
  };

  return (
    <section className="bg-slate-900 text-white pt-12 pb-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-slate-800 text-cyan-400 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold mb-6">
          <Scale className="w-4 h-4 text-cyan-400" /> Postcode Head-to-Head Comparison
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase mb-4">
          Compare Damp &amp; Mould Risk
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-10">
          Compare Damp Risk Scores, Victorian solid-wall housing percentages, and energy performance ratings between any two UK postcode districts.
        </p>

        {/* INTERACTIVE FORM COMPARISON */}
        <form
          onSubmit={handleCompare}
          className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-200/80 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-3 text-slate-900"
        >
          {/* INPUT AREA A */}
          <div className="flex-1 w-full bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-cyan-600 focus-within:bg-white transition-all">
            <MapPin className="w-5 h-5 text-cyan-600 shrink-0" />
            <div className="text-left w-full">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Postcode A
              </label>
              <input
                type="text"
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                placeholder="e.g. B21"
                className="w-full bg-transparent font-black text-slate-900 text-sm sm:text-base focus:outline-none uppercase"
              />
            </div>
          </div>

          {/* SWAP BUTTON */}
          <button
            type="button"
            onClick={handleSwap}
            title="Swap postcodes"
            className="p-3 rounded-full bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-600 transition-colors shrink-0 cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* INPUT AREA B */}
          <div className="flex-1 w-full bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-cyan-600 focus-within:bg-white transition-all">
            <MapPin className="w-5 h-5 text-cyan-600 shrink-0" />
            <div className="text-left w-full">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Postcode B
              </label>
              <input
                type="text"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                placeholder="e.g. B1 or M14"
                className="w-full bg-transparent font-black text-slate-900 text-sm sm:text-base focus:outline-none uppercase"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-black px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base shrink-0 shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Compare</span>
          </button>
        </form>
      </div>
    </section>
  );
}