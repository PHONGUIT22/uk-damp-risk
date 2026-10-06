import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAreasByCity, getAllCities } from "@/lib/dampData";
import CityOutcodeGrid from "./CityOutcodeGrid";
import QuoteRequestCard from "@/components/lead/QuoteRequestCard";
import {
  ShieldCheck,
  AlertTriangle,
  Building2,
  ChevronRight,
  HelpCircle,
  Home,
  ThermometerSnowflake,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
} from "lucide-react";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const cities = getAllCities();
  return cities.map((c) => ({
    city: c.toLowerCase(),
  }));
}

interface PageProps {
  params: Promise<{ city: string }> | { city: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawCity = resolvedParams.city.toLowerCase();
  const cityName = getAllCities().find((c) => c.toLowerCase() === rawCity) || null;

  if (!cityName) {
    return {
      title: "City Damp Risk Guide Not Found | UK Damp Risk Index",
    };
  }

  const areas = getAreasByCity(cityName);
  const avgScore = Math.round(
    areas.reduce((sum, a) => sum + a.damp_risk_score, 0) / (areas.length || 1)
  );

  const title = `${cityName} Damp & Mould Risk Index: Score ${avgScore}/100`;
  const description = `Complete damp and mould vulnerability profile for ${cityName}. Analysis of ${areas.length} postcode districts, pre-1930 Victorian solid walls, and EPC energy efficiency ratings.`;

  return {
    title: { absolute: `${title} | CheckDamp UK` },
    description,
    alternates: {
      canonical: `https://checkdamp.co.uk/cities/${rawCity}`,
    },
    openGraph: {
      title,
      description,
      url: `https://checkdamp.co.uk/cities/${rawCity}`,
      siteName: "UK Damp Risk Index",
      locale: "en_GB",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CityHubPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawCity = resolvedParams.city.toLowerCase();
  const cityName = getAllCities().find((c) => c.toLowerCase() === rawCity) || null;

  if (!cityName) {
    notFound();
  }

  const outcodes = getAreasByCity(cityName);
  if (outcodes.length === 0) {
    notFound();
  }

  // Aggregate statistics
  const totalProperties = outcodes.reduce((sum, a) => sum + a.total_properties, 0);
  const avgRiskScore = Math.round(
    outcodes.reduce((sum, a) => sum + a.damp_risk_score, 0) / outcodes.length
  );
  const avgOldBuild = Math.round(
    (outcodes.reduce((sum, a) => sum + a.pct_old_build, 0) / outcodes.length) * 10
  ) / 10;
  const avgSolidWall = Math.round(
    (outcodes.reduce((sum, a) => sum + a.pct_solid_wall, 0) / outcodes.length) * 10
  ) / 10;
  const avgPoorEpc = Math.round(
    (outcodes.reduce((sum, a) => sum + a.pct_poor_epc, 0) / outcodes.length) * 10
  ) / 10;

  // Highest and lowest risk outcodes
  const sortedByRisk = [...outcodes].sort((a, b) => b.damp_risk_score - a.damp_risk_score);
  const highestRisk = sortedByRisk[0];
  const lowestRisk = sortedByRisk[sortedByRisk.length - 1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://checkdamp.co.uk",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "UK Cities",
            "item": "https://checkdamp.co.uk/cities",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": cityName,
            "item": `https://checkdamp.co.uk/cities/${rawCity}`,
          },
        ],
      },
      {
        "@type": "Article",
        "headline": `${cityName} Housing Condition & Damp Risk Index`,
        "description": `Comprehensive analysis of residential damp, solid wall construction, and energy ratings across ${cityName}.`,
        "mainEntityOfPage": `https://checkdamp.co.uk/cities/${rawCity}`,
        "publisher": {
          "@type": "Organization",
          "@id": "https://checkdamp.co.uk/#organization",
          "name": "CheckDamp UK"
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <Link href="/cities" className="hover:text-slate-900 transition-colors">
                Cities
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">{cityName}</span>
            </nav>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="bg-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border bg-slate-800 border-slate-700 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Metropolitan Housing Condition Report • 2026
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
              {cityName} <span className="text-white underline decoration-slate-600 underline-offset-8">Damp &amp; Mould Risk</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              Analysis across <strong>{outcodes.length} postcode districts</strong> and {totalProperties.toLocaleString()} surveyed homes. Evaluates Victorian solid-wall housing density ({avgSolidWall}% solid masonry), EPC energy inefficiency, and winter condensation risks across {cityName}.
            </p>

            {/* City Stats Snapshot */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 block">Avg Risk Score</span>
                <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
                  {avgRiskScore} / 100
                </span>
                <span className="text-[11px] text-slate-300 font-semibold block mt-0.5">
                  City-Wide Benchmark
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 block">Solid Wall Density</span>
                <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
                  {avgSolidWall}%
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {avgOldBuild}% Pre-1930 builds
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 block">Poor EPC (E-G)</span>
                <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
                  {avgPoorEpc}%
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  High condensation risk
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 block">Highest Risk District</span>
                <span className="text-2xl sm:text-3xl font-black text-rose-400 mt-1 block">
                  {highestRisk.outcode} ({highestRisk.damp_risk_score})
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {highestRisk.dominant_house_type}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN BODY CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Postcode Grid for City */}
          <CityOutcodeGrid cityName={cityName} outcodes={outcodes} />

          {/* Regional Housing Context */}
          <div className="my-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-slate-800" />
              {cityName} Housing Architecture &amp; Damp Dynamics
            </h2>

            <div className="mt-6 space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                {cityName} possesses an extensive heritage of late 19th and early 20th-century housing, largely developed during the industrial expansion of the Midlands and North West. Properties built before 1930 were traditionally constructed with solid brick masonry (9-inch or 13.5-inch headers) without a damp-proof cavity.
              </p>
              <p>
                In districts such as <strong>{highestRisk.outcode}</strong>, over {highestRisk.pct_old_build}% of homes retain these solid exterior walls. When combined with modern airtight uPVC double glazing without continuous trickle ventilation, moisture generated by occupants remains trapped indoors, rapidly condensing on chilled solid masonry and fueling black mould blooms (*Stachybotrys chartarum*).
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                  <TrendingUp className="w-4 h-4 text-rose-600" />
                  <span>High Risk Hotspots ({cityName})</span>
                </div>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  Postcodes like {highestRisk.outcode} require active mechanical ventilation (MEV or PIV systems) and regular exterior masonry repointing to prevent penetrating rainwater ingress.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>Lower Vulnerability Zones ({cityName})</span>
                </div>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  Districts like {lowestRisk.outcode} (Score: {lowestRisk.damp_risk_score}/100) feature modern post-1980 cavity wall construction with integrated thermal insulation and effective vapor barriers.
                </p>
              </div>
            </div>
          </div>

          {/* Lead Quote Request */}
          <div id="survey-quote">
            <QuoteRequestCard
              outcode={highestRisk.outcode}
              dampRiskScore={avgRiskScore}
              locationName={cityName}
            />
          </div>
        </div>
      </div>
    </>
  );
}
