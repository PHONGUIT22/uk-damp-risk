import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect, RedirectType } from "next/navigation";
import { getAreaByOutcode } from "@/lib/dampData";
import CompareHero from "@/components/compare/CompareHero";
import VersusTable from "@/components/compare/VersusTable";
import QuoteRequestCard from "@/components/lead/QuoteRequestCard";
import { POPULAR_COMPARE_PAIRS, isPopularComparePair, getCanonicalPairForReverse } from "@/lib/comparePairs";
import { ChevronRight, ShieldCheck, Building2, Scale, ArrowRight } from "lucide-react";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  return POPULAR_COMPARE_PAIRS.map((pair) => ({
    pair,
  }));
}

interface PageProps {
  params: Promise<{ pair: string }> | { pair: string };
}

function parsePairSlug(pairSlug: string) {
  const parts = pairSlug.split("-vs-");
  if (parts.length !== 2) return null;

  const outcodeA = parts[0].trim().toUpperCase();
  const outcodeB = parts[1].trim().toUpperCase();

  if (!outcodeA || !outcodeB) return null;

  return { outcodeA, outcodeB, slugA: parts[0], slugB: parts[1] };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawPairSlug = resolvedParams.pair || "";
  const normalizedPairSlug = rawPairSlug.toLowerCase().trim();

  // If this pair is the inverse of a whitelisted pair, redirect to canonical pair
  const canonicalTarget = getCanonicalPairForReverse(normalizedPairSlug);
  if (canonicalTarget) {
    redirect(`/compare/${canonicalTarget}`, RedirectType.replace);
  }

  const parsed = parsePairSlug(normalizedPairSlug);

  if (!parsed) {
    return {
      title: "Comparison Not Found | CheckDamp UK",
      robots: { index: false, follow: true },
    };
  }

  const dataA = getAreaByOutcode(parsed.outcodeA);
  const dataB = getAreaByOutcode(parsed.outcodeB);

  if (!dataA || !dataB) {
    return {
      title: "Comparison Not Found | CheckDamp UK",
      robots: { index: false, follow: true },
    };
  }

  const isIndexable = isPopularComparePair(normalizedPairSlug);
  const canonicalUrl = `https://checkdamp.co.uk/compare/${normalizedPairSlug}`;
  const title = `${dataA.outcode} vs ${dataB.outcode} Damp & Mould Risk Comparison`;
  const description = `Compare residential damp risk: ${dataA.outcode} (${dataA.damp_risk_score}/100) vs ${dataB.outcode} (${dataB.damp_risk_score}/100). Victorian solid-wall housing: ${dataA.pct_old_build}% vs ${dataB.pct_old_build}%.`;

  return {
    title: { absolute: `${title} | CheckDamp UK` },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: isIndexable,
      follow: true,
      googleBot: {
        index: isIndexable,
        follow: true,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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

export default async function CompareDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawPairSlug = resolvedParams.pair || "";
  const normalizedPairSlug = rawPairSlug.toLowerCase().trim();

  // If this pair is the inverse of a whitelisted pair, redirect to canonical pair
  const canonicalTarget = getCanonicalPairForReverse(normalizedPairSlug);
  if (canonicalTarget) {
    redirect(`/compare/${canonicalTarget}`, RedirectType.replace);
  }

  const parsed = parsePairSlug(normalizedPairSlug);

  if (!parsed) {
    notFound();
  }

  const dataA = getAreaByOutcode(parsed.outcodeA);
  const dataB = getAreaByOutcode(parsed.outcodeB);

  if (!dataA || !dataB) {
    notFound();
  }

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
            "name": "Compare",
            "item": "https://checkdamp.co.uk/compare",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${dataA.outcode} vs ${dataB.outcode}`,
            "item": `https://checkdamp.co.uk/compare/${normalizedPairSlug}`,
          },
        ],
      },
      {
        "@type": "Article",
        "headline": `${dataA.outcode} vs ${dataB.outcode} Housing Condition & Damp Risk Head-to-Head`,
        "description": `Detailed comparison between ${dataA.outcode} (${dataA.city}) and ${dataB.outcode} (${dataB.city}).`,
        "mainEntityOfPage": `https://checkdamp.co.uk/compare/${normalizedPairSlug}`,
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
              <Link href="/compare" className="hover:text-slate-900 transition-colors">
                Compare
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">
                {dataA.outcode} vs {dataB.outcode}
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <CompareHero
          locA={dataA.outcode}
          locB={dataB.outcode}
          dataA={dataA}
          dataB={dataB}
        />

        {/* Versus Comparison Table */}
        <VersusTable dataA={dataA} dataB={dataB} />

        {/* Deep Dive Narrative Comparison */}
        <div className="max-w-5xl mx-auto px-4 mt-14">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-slate-800" />
              Housing Stock &amp; Moisture Dynamics: {dataA.outcode} vs {dataB.outcode}
            </h2>

            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                When assessing property condition between <strong>{dataA.outcode} ({dataA.city})</strong> and <strong>{dataB.outcode} ({dataB.city})</strong>, the primary structural differentiator is the age profile of the residential building envelope.
              </p>

              <p>
                In <strong>{dataA.outcode}</strong>, <strong>{dataA.pct_old_build}%</strong> of properties are solid-wall Victorian or Edwardian construction, compared to <strong>{dataB.pct_old_build}%</strong> in <strong>{dataB.outcode}</strong>. Solid brick masonry lacks the modern thermal break of a cavity wall, resulting in higher moisture permeation through mortar beds during prolonged wet weather.
              </p>

              <p>
                Regarding energy efficiency, {dataA.outcode} records <strong>{dataA.pct_poor_epc}%</strong> of properties in EPC bands E through G, while {dataB.outcode} records <strong>{dataB.pct_poor_epc}%</strong>. Colder internal surface temperatures accelerate the condensation of ambient indoor moisture, substantially elevating the risk of black mould spore germination.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-bold">
                <Link
                  href={`/damp-risk/${dataA.outcode.toLowerCase()}`}
                  className="text-slate-900 hover:underline"
                >
                  View full {dataA.outcode} profile &rarr;
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  href={`/damp-risk/${dataB.outcode.toLowerCase()}`}
                  className="text-slate-900 hover:underline"
                >
                  View full {dataB.outcode} profile &rarr;
                </Link>
              </div>

              <span className="text-[11px] text-slate-400">
                Sample: {dataA.total_properties.toLocaleString()} ({dataA.outcode}) vs {dataB.total_properties.toLocaleString()} ({dataB.outcode}) homes
              </span>
            </div>
          </div>

          {/* Lead Quote Request Card with id="survey-quote" */}
          <div id="survey-quote" className="mt-8">
            <QuoteRequestCard
              outcode={dataA.outcode}
              dampRiskScore={dataA.damp_risk_score}
              locationName={dataA.city}
            />
          </div>
        </div>
      </div>
    </>
  );
}