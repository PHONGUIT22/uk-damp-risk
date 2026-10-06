import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 text-xl font-black text-white tracking-tight">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden p-0.5">
                <Image src="/icon.webp" alt="CheckDamp UK Logo" width={28} height={28} className="h-7 w-7 object-contain" />
              </div>
              <span>
                UK Damp <span className="text-slate-300">Risk Index</span>
              </span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed max-w-sm text-slate-400">
              CheckDamp UK provides hyper-local condensation risk indices, solid-wall housing vulnerability statistics, and surveyor quote matching across UK postcode districts.
            </p>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              Navigation &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/damp-risk" className="hover:text-white transition-colors">
                  All Outcodes Directory
                </Link>
              </li>
              <li>
                <Link href="/cities" className="hover:text-white transition-colors">
                  City Risk Hubs
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Compare Two Postcodes
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-white transition-colors">
                  Damp &amp; Mould Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Data
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Hubs */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              Priority Regions
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/cities/birmingham" className="hover:text-white transition-colors text-slate-300 font-semibold">
                  Birmingham Damp Risk
                </Link>
              </li>
              <li>
                <Link href="/cities/manchester" className="hover:text-white transition-colors text-slate-300 font-semibold">
                  Manchester Damp Risk
                </Link>
              </li>
              <li>
                <Link href="/damp-risk/b21" className="hover:text-white transition-colors">
                  B21 Handsworth (High Risk)
                </Link>
              </li>
              <li>
                <Link href="/damp-risk/b11" className="hover:text-white transition-colors">
                  B11 Sparkhill (High Risk)
                </Link>
              </li>
              <li>
                <Link href="/damp-risk/m14" className="hover:text-white transition-colors">
                  M14 Fallowfield
                </Link>
              </li>
              <li>
                <Link href="/damp-risk/b1" className="hover:text-white transition-colors">
                  B1 Birmingham Centre
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 mb-8 leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <strong>Disclaimer:</strong> CheckDamp UK is an independent data analysis platform. Damp risk scores are calculated from open government datasets including the UK EPC Register, the English Housing Survey, and regional property condition indices. This data is for informational and preliminary screening purposes only. If you suspect structural rising damp or invasive black mould, always engage an independent PCA (Property Care Association) or RICS-accredited surveyor.
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} UK Damp Risk Index (CheckDamp UK). All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Updated for 2026 Housing Cycle</p>
        </div>
      </div>
    </footer>
  );
}