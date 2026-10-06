"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GuideArticle } from "@/lib/guidesData";
import { 
  Search, 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight, 
  MapPin, 
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Wind
} from "lucide-react";

interface Props {
  initialGuides: GuideArticle[];
}

const CATEGORIES = [
  "All Guides",
  "Damp Diagnostics",
  "Legal & Regulations",
  "Mitigation & Technology",
  "Surveys & Property",
] as const;

export default function GuidesClient({ initialGuides }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Guides");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = useMemo(() => {
    return initialGuides.filter((guide) => {
      const matchesCategory =
        selectedCategory === "All Guides" || guide.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        guide.title.toLowerCase().includes(query) ||
        guide.metaDescription.toLowerCase().includes(query) ||
        guide.targetKeyword.toLowerCase().includes(query) ||
        (guide.relatedOutcodes &&
          guide.relatedOutcodes.some((outcode) =>
            outcode.toLowerCase().includes(query)
          ));

      return matchesCategory && matchesSearch;
    });
  }, [initialGuides, selectedCategory, searchQuery]);

  const getCategoryBadgeClass = (category: GuideArticle["category"]) => {
    switch (category) {
      case "Damp Diagnostics":
        return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
      case "Legal & Regulations":
        return "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100";
      case "Mitigation & Technology":
        return "bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100";
      case "Surveys & Property":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
    }
  };

  const formatDateUI = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8">
      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides (e.g. Condensation, Awaab's Law, Dehumidifier, Survey)..."
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-cyan-600 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-semibold px-2">
            Showing <strong className="text-slate-900">{filteredGuides.length}</strong> of {initialGuides.length} guides
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* GUIDES GRID */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No guides found</h3>
          <p className="text-slate-500 text-xs mt-1">
            No articles match your search criteria. Try another keyword or reset the category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All Guides");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => (
            <article
              key={guide.slug}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all flex flex-col justify-between p-6 sm:p-8 group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${getCategoryBadgeClass(
                      guide.category
                    )}`}
                  >
                    {guide.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{guide.readingTime}</span>
                  </div>
                </div>

                <Link href={`/guides/${guide.slug}`}>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-cyan-600 transition-colors leading-snug">
                    {guide.title}
                  </h3>
                </Link>

                <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed line-clamp-3">
                  {guide.metaDescription}
                </p>

                {/* Quick Verdict Snippet */}
                {guide.quickVerdict && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <strong className="text-slate-900 font-bold block mb-1">
                      Key Takeaway:
                    </strong>
                    <span className="line-clamp-2 text-[11px] text-slate-600">
                      {guide.quickVerdict.keyTakeaway}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Updated {formatDateUI(guide.dateModified)}
                </span>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
