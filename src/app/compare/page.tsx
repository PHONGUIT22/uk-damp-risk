import { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";
import CompareHero from "@/components/compare/CompareHero";
import { getAreaByOutcode } from "@/lib/dampData";
import { POPULAR_COMPARE_PAIRS } from "@/lib/comparePairs";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Compare UK Damp & Mould Risk: Postcode Head-to-Head | CheckDamp UK",
  description: "Compare damp risk scores, Victorian solid-wall housing density, and poor EPC exposure between UK postcode areas.",
  alternates: {
    canonical: "https://checkdamp.co.uk/compare",
  },
  openGraph: {
    title: "Compare UK Damp & Mould Risk: Postcode Head-to-Head",
    description: "Compare damp risk scores, Victorian solid-wall housing density, and poor EPC exposure between UK postcode areas.",
    url: "https://checkdamp.co.uk/compare",
    siteName: "UK Damp Risk Index",
    locale: "en_GB",
    type: "website",
  },
};

interface ComparisonPairItem {
  slug: string;
  badge: string;
  codeA: string;
  codeB: string;
  highlight: string;
}

const FEATURED_PAIRS: ComparisonPairItem[] = [
  {
    slug: "b21-vs-b1",
    badge: "High Risk vs Modern Core",
    codeA: "B21",
    codeB: "B1",
    highlight: "Handsworth (B21) has over 69% Victorian solid-wall homes with high damp vulnerability (Score: 58), whereas Birmingham City Centre (B1) is predominantly modern with low damp risk (Score: 18).",
  },
  {
    slug: "b11-vs-m1",
    badge: "Midlands vs North West",
    codeA: "B11",
    codeB: "M1",
    highlight: "Sparkhill (B11) features extensive pre-1930 terraces with high condensation risk (Score: 57), while Central Manchester (M1) benefits from contemporary building envelopes (Score: 24).",
  },
  {
    slug: "m14-vs-m15",
    badge: "Student Terraces vs Hulme Modern",
    codeA: "M14",
    codeB: "M15",
    highlight: "Fallowfield (M14) contains 50% pre-1930 housing stock with elevated tenant damp complaints (Score: 42), compared to Hulme (M15) at just 1.7% old builds (Score: 17).",
  },
  {
    slug: "b10-vs-m14",
    badge: "Cross-City Victorian Hubs",
    codeA: "B10",
    codeB: "M14",
    highlight: "Comparing Small Heath (B10, 61% pre-1930, Score: 56) with Fallowfield (M14, 50% pre-1930, Score: 42) reveals distinct regional differences in solid masonry moisture dynamics.",
  },
  {
    slug: "b1-vs-m1",
    badge: "City Centre Showdown",
    codeA: "B1",
    codeB: "M1",
    highlight: "Both city centres exhibit predominantly modern high-density apartment housing with low moisture vulnerability (B1: 18 vs M1: 24).",
  },
  {
    slug: "b21-vs-m14",
    badge: "Top Damp Risk Sectors",
    codeA: "B21",
    codeB: "M14",
    highlight: "Birmingham Handsworth (B21) has a higher concentration of poor EPC ratings (29.8% vs 14.1%), resulting in colder internal wall dew points than Manchester Fallowfield.",
  },
];

export default function CompareHubPage() {
  const dataB21 = getAreaByOutcode("B21");
  const dataB1 = getAreaByOutcode("B1");

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
            <span className="font-semibold text-slate-900">Compare Postcodes</span>
          </nav>
        </div>
      </div>

      {/* Compare Hero Component */}
      <CompareHero
        locA="B21"
        locB="B1"
        dataA={dataB21}
        dataB={dataB1}
      />

      {/* FEATURED COMPARISON CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
            Curated Head-to-Head Comparisons
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Popular Postcode Damp Risk Matchups
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Detailed property age profile, EPC efficiency, and moisture risk comparisons between key UK districts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PAIRS.map((pair) => {
            const areaA = getAreaByOutcode(pair.codeA);
            const areaB = getAreaByOutcode(pair.codeB);

            if (!areaA || !areaB) return null;

            return (
              <div
                key={pair.slug}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {pair.badge}
                    </span>
                    <Scale className="w-4 h-4 text-slate-700" />
                  </div>

                  {/* Outcode Matchup Header */}
                  <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-4">
                    <div className="text-center flex-1">
                      <span className="font-black text-slate-900 text-lg block">{areaA.outcode}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{areaA.city}</span>
                      <span className="text-xs font-bold text-rose-600 block mt-1">
                        {areaA.damp_risk_score}/100
                      </span>
                    </div>

                    <span className="text-xs font-black text-slate-300 px-2">VS</span>

                    <div className="text-center flex-1">
                      <span className="font-black text-slate-900 text-lg block">{areaB.outcode}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{areaB.city}</span>
                      <span className="text-xs font-bold text-emerald-600 block mt-1">
                        {areaB.damp_risk_score}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pair.highlight}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={`/compare/${pair.slug}`}
                    className="inline-flex items-center justify-between w-full text-xs font-bold text-slate-900 hover:text-slate-700 transition-colors"
                  >
                    <span>View Head-to-Head Report</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}