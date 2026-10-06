"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin, Scale, Loader2 } from "lucide-react";
import { resolveSearchDestination } from "@/lib/search";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const targetUrl = await resolveSearchDestination(searchTerm);
      router.push(targetUrl);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* BRAND LOGO */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 bg-slate-900 group-hover:bg-slate-800 transition-colors rounded-2xl flex items-center justify-center shadow-sm overflow-hidden p-0.5">
            <Image
              src="/icon.webp"
              alt="CheckDamp UK Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 block leading-tight">
              UK Damp <span className="text-slate-700">Risk Index</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block -mt-0.5">
              CHECKDAMP.CO.UK
            </span>
          </div>
        </Link>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-2 sm:mx-6">
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Outcode (e.g. B1, M14, B21)..."
              className="w-full bg-slate-100/90 focus:bg-white border border-transparent focus:border-slate-800 rounded-full pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-4 shrink-0">
          <nav className="hidden lg:flex items-center gap-6 font-semibold text-slate-600 text-sm">
            <Link href="/damp-risk" className="hover:text-slate-900 transition-colors">
              Risk Map
            </Link>
            <Link href="/cities" className="hover:text-slate-900 transition-colors">
              Cities
            </Link>
            <Link href="/compare" className="hover:text-slate-900 transition-colors">
              Compare
            </Link>
            <Link href="/guides" className="hover:text-slate-900 transition-colors">
              Guides
            </Link>
          </nav>

          <Link
            href="/compare"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all text-xs sm:text-sm shadow-sm flex items-center gap-2"
          >
            <Scale className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">Compare Postcodes</span>
          </Link>
        </div>
      </div>
    </header>
  );
}