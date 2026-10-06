import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Props {
  outcode: string;
  sector: string;
}

export default function Breadcrumb({ outcode, sector }: Props) {
  const cleanOutcode = outcode.trim().toUpperCase();
  const cleanSector = sector.trim().toUpperCase();

  return (
    <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
      <Link href="/" className="hover:text-slate-900 flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" /> Home
      </Link>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

      <Link 
        href="/damp-risk" 
        className="hover:text-slate-900 transition-colors font-medium"
      >
        All Outcodes
      </Link>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

      <Link 
        href={`/damp-risk/${cleanOutcode.toLowerCase()}`} 
        className="hover:text-slate-900 transition-colors font-medium"
      >
        Outcode {cleanOutcode}
      </Link>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

      <span className="font-bold text-slate-900">
        Sector {cleanSector}
      </span>
    </nav>
  );
}