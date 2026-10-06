"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, Compass, Loader2 } from "lucide-react";
import { resolveSearchDestination } from "@/lib/search";

export default function NotFound() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const destination = await resolveSearchDestination(query);
      router.push(destination);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#FDFDFD] text-slate-900 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* 404 Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 text-cyan-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-cyan-600" /> Error 404 • Area Not Found
        </div>

        {/* Headline 404 Siêu Bự */}
        <div>
          <h1 className="text-7xl sm:text-9xl font-black text-slate-900 tracking-tight leading-none mb-4">
            404<span className="text-cyan-600">.</span>
          </h1>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 uppercase tracking-tight">
            Lost in the Postcodes?
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base max-w-md mx-auto">
            We couldn&apos;t find the specific postcode sector, outcode, or page you were looking for. Search our database of 9,000+ UK postcode sectors below.
          </p>
        </div>

        {/* Ô Search Tải Lại Ngay Tại Trang 404 */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-3 rounded-3xl shadow-lg border border-slate-200/80 flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
        >
          <div className="flex items-center gap-3 px-4 py-2 w-full">
            <MapPin className="w-5 h-5 text-cyan-600 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Postcode Sector (e.g. SW1A 1, AB10)..."
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none font-medium text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto bg-slate-900 hover:bg-cyan-600 text-white font-bold px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Search</span>
          </button>
        </form>

        {/* Nút Quay Về Trang Chủ & Link Các Vùng Nổi Bật UK */}
        <div className="pt-6 border-t border-slate-200/80 space-y-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold px-5 py-2.5 rounded-full text-xs transition-colors"
            >
              <Home className="w-4 h-4 text-cyan-600" /> Go to Homepage
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-5 py-2.5 rounded-full text-xs transition-colors shadow-xs"
            >
              Compare Postcodes
            </Link>
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-center gap-2 flex-wrap">
            <span>Or explore major areas:</span>
            <Link href="/damp-risk/b21" className="font-semibold text-slate-700 hover:text-cyan-600 underline">B21 (Handsworth)</Link> •
            <Link href="/damp-risk/m14" className="font-semibold text-slate-700 hover:text-cyan-600 underline">M14 (Fallowfield)</Link> •
            <Link href="/damp-risk/b1" className="font-semibold text-slate-700 hover:text-cyan-600 underline">B1 (Birmingham)</Link> •
            <Link href="/damp-risk/m1" className="font-semibold text-slate-700 hover:text-cyan-600 underline">M1 (Manchester)</Link>
          </div>
        </div>

      </div>
    </div>
  );
}