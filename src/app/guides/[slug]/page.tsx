import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guidesData, getGuideBySlug } from "@/lib/guidesData";
import QuoteRequestCard from "@/components/lead/QuoteRequestCard";
import { 
  Home, 
  ChevronRight, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  MapPin,
  Award,
  AlertTriangle,
  Wind,
  Sparkles
} from "lucide-react";

export const revalidate = 86400; // ISR Cache 24h
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guidesData.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Guide Not Found | UK Damp Risk Index",
    };
  }

  const canonicalUrl = `https://checkdamp.co.uk/guides/${guide.slug}`;
  let absoluteTitle = guide.metaTitle;
  if (!guide.metaTitle.includes("CheckDamp UK")) {
    absoluteTitle = `${guide.metaTitle} | CheckDamp UK`;
  }

  return {
    title: { absolute: absoluteTitle },
    description: guide.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: absoluteTitle,
      description: guide.metaDescription,
      url: canonicalUrl,
      siteName: "UK Damp Risk Index",
      locale: "en_GB",
      type: "article",
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
      authors: ["UK Damp Risk Technical Desk"],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description: guide.metaDescription,
    },
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const formatDateUI = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const leadOutcode = (guide.relatedOutcodes && guide.relatedOutcodes.length > 0)
    ? guide.relatedOutcodes[0]
    : "B21";

  // Schema.org JSON-LD (Article, BreadcrumbList, FAQPage)
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://checkdamp.co.uk/guides/${guide.slug}#article`,
        "headline": guide.title,
        "description": guide.metaDescription,
        "datePublished": guide.datePublished,
        "dateModified": guide.dateModified,
        "mainEntityOfPage": `https://checkdamp.co.uk/guides/${guide.slug}`,
        "author": {
          "@type": "Person",
          "@id": "https://checkdamp.co.uk/#lead-pathologist",
          "name": "Dr. Arthur Pendelton",
          "jobTitle": "Lead Building Pathology Surveyor, AssocRICS",
          "url": "https://checkdamp.co.uk/about"
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://checkdamp.co.uk/#organization",
          "name": "CheckDamp UK",
          "url": "https://checkdamp.co.uk"
        },
        "about": {
          "@type": "Thing",
          "name": guide.targetKeyword
        }
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
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": guide.title,
            "item": `https://checkdamp.co.uk/guides/${guide.slug}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": guide.faqItems.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ARTICLE HEADER HERO */}
      <section className="bg-slate-900 text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/guides" className="hover:text-white transition-colors">
              Guides
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-medium truncate max-w-xs sm:max-w-sm">
              {guide.title}
            </span>
          </nav>

          {/* Category & Reading time */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> {guide.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" /> {guide.readingTime}
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" /> Updated {formatDateUI(guide.dateModified)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {guide.title}
          </h1>

          {/* Lead Description */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            {guide.metaDescription}
          </p>

          {/* E-E-A-T Editorial Badge */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 border border-slate-700">
              PCA
            </div>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                UK Damp Risk Technical Desk
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </p>
              <p className="text-xs text-slate-400">
                Building Pathology &amp; Environmental Health Advisory • BS 5250 Standards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE BODY CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* QUICK TECHNICAL VERDICT BOX */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Award className="w-5 h-5 text-slate-700" />
              <span>Quick Technical Verdict</span>
            </div>
            {guide.quickVerdict.riskLevel && (
              <span className="bg-slate-100 border border-slate-200 text-slate-800 font-bold px-3 py-1 rounded-full text-xs">
                {guide.quickVerdict.riskLevel}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {guide.quickVerdict.primaryCause && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                  Root Mechanism
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {guide.quickVerdict.primaryCause}
                </span>
              </div>
            )}
            {guide.quickVerdict.recommendedSolution && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-slate-500 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                  Recommended Strategy
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {guide.quickVerdict.recommendedSolution}
                </span>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 text-xs sm:text-sm leading-relaxed shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Technical Takeaway (Quick Answer):</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-normal">
              {guide.quickVerdict.keyTakeaway}
            </p>
          </div>
        </div>

        {/* MAIN EDITORIAL CONTENT */}
        <article 
          className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-900 prose-strong:font-bold"
          dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
        />

        {/* RELATED POSTCODE DISTRICTS */}
        {guide.relatedOutcodes && guide.relatedOutcodes.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-700" />
              Related High-Risk Postcode Profiles
            </h3>
            <p className="text-xs text-slate-500">
              Inspect building condition profiles and solid-wall housing distributions for districts impacted by this topic:
            </p>
            <div className="flex items-center gap-2.5 flex-wrap pt-2">
              {guide.relatedOutcodes.map((outcode) => (
                <Link
                  key={outcode}
                  href={`/damp-risk/${outcode.toLowerCase()}`}
                  className="bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 hover:border-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>Outcode {outcode} Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ SECTION */}
        {guide.faqItems && guide.faqItems.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <HelpCircle className="w-6 h-6 text-slate-700" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              {guide.faqItems.map((faq, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-extrabold text-base text-slate-900">
                    {faq.question}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUOTE LEAD GENERATION */}
        <div id="survey-quote" className="pt-6">
          <QuoteRequestCard
            outcode={leadOutcode}
            dampRiskScore={55}
            locationName="your area"
          />
        </div>
      </main>
    </div>
  );
}
