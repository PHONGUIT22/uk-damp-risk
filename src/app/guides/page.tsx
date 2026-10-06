import { Metadata } from "next";
import Link from "next/link";
import { guidesData } from "@/lib/guidesData";
import GuidesClient from "./GuidesClient";
import { 
  ShieldCheck, 
  BookOpen, 
  ChevronRight, 
  Home, 
  CheckCircle2, 
  Wind 
} from "lucide-react";

export const revalidate = 86400; // Cache 24h on CDN

export const metadata: Metadata = {
  title: "UK Damp, Mould & Condensation Guides | CheckDamp UK",
  description: "Expert UK building pathology guides on condensation vs rising damp, Awaab's Law landlord timelines, dehumidifier sizing, and independent PCA surveys.",
  alternates: {
    canonical: "https://checkdamp.co.uk/guides",
  },
  openGraph: {
    title: "UK Damp, Mould & Condensation Guides | CheckDamp UK",
    description: "Expert British guides on condensation diagnostics, Awaab's Law landlord obligations, dehumidifier extraction capacity, and pre-purchase damp surveys.",
    url: "https://checkdamp.co.uk/guides",
    siteName: "UK Damp Risk Index",
    locale: "en_GB",
    type: "website",
  },
};

export default function GuidesHubPage() {
  const allGuides = guidesData;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://checkdamp.co.uk/guides",
        "url": "https://checkdamp.co.uk/guides",
        "name": "UK Damp, Mould & Building Condition Guides",
        "description": "Comprehensive editorial library of UK damp diagnostics, moisture dynamics, and landlord regulations.",
        "publisher": {
          "@type": "Organization",
          "name": "UK Damp Risk Index",
          "url": "https://checkdamp.co.uk"
        }
      },
      {
        "@type": "ItemList",
        "itemListElement": allGuides.map((guide, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "url": `https://checkdamp.co.uk/guides/${guide.slug}`,
          "name": guide.title
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://checkdamp.co.uk"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Guides",
            "item": "https://checkdamp.co.uk/guides"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* HERO SECTION */}
      <section className="bg-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-semibold text-slate-200">Guides &amp; Technical Hub</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-slate-400" /> Evidence-Based Building Science • BS 5250 &amp; PCA Guidelines
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase">
            UK Damp &amp; Mould <span className="text-white underline decoration-slate-600 underline-offset-8">Technical Guides</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            Unbiased, building-physics-backed guidance on identifying condensation, enforcing Awaab&apos;s Law, sizing dehumidifiers for solid-brick Victorian homes, and avoiding chemical damp-proofing misdiagnosis.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <GuidesClient initialGuides={allGuides} />
      </main>
    </div>
  );
}
