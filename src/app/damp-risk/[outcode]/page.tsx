import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllOutcodes,
  getAreaByOutcode,
  getAreasByCity,
  getRiskColorClass,
} from "@/lib/dampData";
import DehumidifierSizingGuide from "@/components/detail/DehumidifierSizingGuide";
import QuoteRequestCard from "@/components/lead/QuoteRequestCard";
import {
  ShieldCheck,
  AlertTriangle,
  Home,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Building2,
  ThermometerSnowflake,
  Wind,
  Layers,
  Activity,
  ArrowRight,
  Info,
  Wrench,
  Sparkles,
} from "lucide-react";

export const revalidate = 86400; // Cache on CDN 24h
export const dynamicParams = false;

export async function generateStaticParams() {
  const outcodes = getAllOutcodes();
  return outcodes.map((code) => ({
    outcode: code.toLowerCase(),
  }));
}

interface PageProps {
  params: Promise<{ outcode: string }> | { outcode: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const area = getAreaByOutcode(resolvedParams.outcode);

  if (!area) {
    return {
      title: "Outcode Area Not Found | CheckDamp UK",
    };
  }

  const baseTitle = `${area.outcode} Damp & Mould Risk Score: ${area.damp_risk_score}/100 (${area.risk_level} Risk)`;
  const description = `Check damp, condensation & mould risk for ${area.outcode} (${area.city}). Pre-1930 solid wall homes: ${area.pct_old_build}%, poor EPC ratings (E-G): ${area.pct_poor_epc}%, based on ${area.total_properties.toLocaleString()} surveyed homes.`;

  return {
    title: { absolute: `${baseTitle} | CheckDamp UK` },
    description,
    alternates: {
      canonical: `https://checkdamp.co.uk/damp-risk/${area.outcode.toLowerCase()}`,
    },
    openGraph: {
      title: baseTitle,
      description,
      url: `https://checkdamp.co.uk/damp-risk/${area.outcode.toLowerCase()}`,
      siteName: "UK Damp Risk Index",
      locale: "en_GB",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description,
    },
  };
}

export default async function DampRiskOutcodePage({ params }: PageProps) {
  const resolvedParams = await params;
  const area = getAreaByOutcode(resolvedParams.outcode);

  if (!area) {
    notFound();
  }

  const color = getRiskColorClass(area.risk_level);
  const cityPeers = getAreasByCity(area.city)
    .filter((p) => p.outcode !== area.outcode)
    .slice(0, 8);

  const isHigh = area.damp_risk_score >= 50;
  const isModerate = area.damp_risk_score >= 35 && area.damp_risk_score < 50;

  // JSON-LD Structured Data
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
            "name": "Damp Risk Map",
            "item": "https://checkdamp.co.uk/damp-risk",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": area.city,
            "item": `https://checkdamp.co.uk/cities/${area.city.toLowerCase()}`,
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": `Outcode ${area.outcode}`,
            "item": `https://checkdamp.co.uk/damp-risk/${area.outcode.toLowerCase()}`,
          },
        ],
      },
      {
        "@type": "Dataset",
        "name": `Damp and Condensation Vulnerability Profile for ${area.outcode}`,
        "description": `Statistical property condition report for postal district ${area.outcode}, ${area.city}. Records ${area.total_properties} domestic dwellings with ${area.pct_old_build}% solid-wall structures and an overall risk score of ${area.damp_risk_score}/100.`,
        "spatialCoverage": {
          "@type": "Place",
          "name": `${area.outcode}, ${area.city}, UK`,
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": area.latitude,
            "longitude": area.longitude,
          },
        },
        "variableMeasured": [
          "Damp Risk Score",
          "Percentage Solid Wall Pre-1930 Properties",
          "Percentage EPC Band E-G Energy Inefficiency",
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `What is the damp risk score in ${area.outcode}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${area.outcode} has a damp risk score of ${area.damp_risk_score}/100, categorized as ${area.risk_level} risk. This is driven by ${area.pct_old_build}% of homes being solid-wall pre-1930 builds and ${area.pct_poor_epc}% carrying energy-inefficient EPC ratings (E-G).`,
            },
          },
          {
            "@type": "Question",
            "name": `Why are solid-wall Victorian homes in ${area.outcode} vulnerable to mould?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Pre-1930 properties in ${area.outcode} typically lack cavity insulation. Uninsulated 9-inch brick walls allow external winter cold to penetrate deeply, chilling interior plaster below the 12.8°C dew point and provoking continuous condensation.`,
            },
          },
          {
            "@type": "Question",
            "name": `Should I get a damp survey before buying in ${area.outcode}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Given the ${area.risk_level.toLowerCase()} risk profile and ${area.pct_old_build}% pre-1930 housing stock, an independent PCA or RICS Level 3 building survey with electronic moisture mapping is strongly recommended to identify rising damp, bridging, or timber rot before completing exchange of contracts.`,
            },
          },
        ],
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
        {/* Top Breadcrumb Bar */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <Link href="/damp-risk" className="hover:text-slate-900 transition-colors">
                Risk Map
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <Link
                href={`/cities/${area.city.toLowerCase()}`}
                className="hover:text-slate-900 transition-colors"
              >
                {area.city}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">{area.outcode}</span>
            </nav>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="bg-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Left Column: Heading and Summary */}
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border bg-slate-800 border-slate-700 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Postcode District Condition Report • {area.city}
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
                  Damp &amp; Mould Risk in{" "}
                  <span className="text-white underline decoration-slate-600 underline-offset-8">
                    {area.outcode}
                  </span>
                </h1>

                <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  Official residential property condition assessment for <strong>{area.outcode}</strong> ({area.city}). Synthesised from {area.total_properties.toLocaleString()} surveyed homes, energy performance certificates, and solid wall vulnerability metrics.
                </p>

                {/* Quick specs pill */}
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                    LAD Code: <strong className="text-white">{area.lad_code}</strong>
                  </span>
                  <span className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                    Coordinates: <strong className="text-white">{area.latitude.toFixed(3)}°N, {Math.abs(area.longitude).toFixed(3)}°W</strong>
                  </span>
                  <span className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                    Sample: <strong className="text-white">{area.total_properties.toLocaleString()} Homes</strong>
                  </span>
                </div>
              </div>

              {/* Right Column: Prominent Damp Risk Score Badge / Gauge */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shrink-0 lg:w-96 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Damp Risk Score
                  </span>
                  <span
                    className={`text-xs font-black uppercase px-3 py-1 rounded-full ${color.badgeBg}`}
                  >
                    {area.risk_level} Risk
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-white">
                    {area.damp_risk_score}
                  </span>
                  <span className="text-xl font-bold text-slate-400">/ 100</span>
                </div>

                {/* Progress bar gauge */}
                <div className="mt-4">
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isHigh
                          ? "bg-rose-500"
                          : isModerate
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(Math.max(area.damp_risk_score, 10), 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1.5">
                    <span>0 (Low)</span>
                    <span>35 (Mod)</span>
                    <span>50 (High)</span>
                    <span>100 (Severe)</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-300 leading-relaxed border-t border-slate-700/80 pt-3">
                  {isHigh
                    ? `⚠️ Elevated damp hazard. The combination of high pre-1930 build density (${area.pct_old_build}%) and poor EPC ratings (${area.pct_poor_epc}%) predisposes homes in ${area.outcode} to persistent surface condensation and thermal bridging.`
                    : isModerate
                    ? `⚡ Moderate moisture load. Properties in ${area.outcode} require consistent background heating and active extraction ventilation to avoid winter mould growth.`
                    : `✅ Low vulnerability relative to UK averages. Modern thermal standards and lower solid-wall density reduce condensation frequency.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5-METRIC STATISTICAL GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Metric 1 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Risk Score</span>
                <Activity className="w-4 h-4 text-slate-700" />
              </div>
              <div className="text-2xl font-black text-slate-900">{area.damp_risk_score} / 100</div>
              <span className={`text-[11px] font-bold mt-1 inline-block ${color.text}`}>
                {area.risk_level} Severity
              </span>
            </div>

            {/* Metric 2 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Pre-1930 Builds</span>
                <Building2 className="w-4 h-4 text-slate-700" />
              </div>
              <div className="text-2xl font-black text-slate-900">{area.pct_old_build}%</div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Victorian / Solid Brick
              </span>
            </div>

            {/* Metric 3 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Poor EPC (E-G)</span>
                <ThermometerSnowflake className="w-4 h-4 text-slate-700" />
              </div>
              <div className="text-2xl font-black text-slate-900">{area.pct_poor_epc}%</div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Thermal dew-point risk
              </span>
            </div>

            {/* Metric 4 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Housing Type</span>
                <Layers className="w-4 h-4 text-slate-700" />
              </div>
              <div className="text-2xl font-black text-slate-900 truncate">{area.dominant_house_type}</div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {area.pct_terrace_or_flat}% Terraced/Flats
              </span>
            </div>

            {/* Metric 5 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Sample Size</span>
                <Home className="w-4 h-4 text-slate-700" />
              </div>
              <div className="text-2xl font-black text-slate-900">{area.total_properties.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Inspected properties
              </span>
            </div>
          </div>
        </section>

        {/* DETAILED PROPERTY CONDITION ANALYSIS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Primary Building Physics Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <Building2 className="w-6 h-6 text-slate-800" />
                  Building Physics &amp; Moisture Mechanics in {area.outcode}
                </h2>

                <div className="mt-6 space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    In <strong>{area.outcode} ({area.city})</strong>, approximately <strong>{area.pct_old_build}%</strong> of all residential housing stock was constructed prior to 1930. Standard UK construction before the 1930s relied on 9-inch solid brickwork without a cavity barrier. Without an insulating air cavity, external moisture from driving rain can transfer through deteriorated mortar joints directly onto internal wall surfaces.
                  </p>

                  <p>
                    Furthermore, <strong>{area.pct_poor_epc}%</strong> of properties in {area.outcode} have an Energy Performance Certificate (EPC) rating between E and G. Underheated rooms and uninsulated solid walls create cold thermal bridges. When routine household activities (cooking, showering, drying clothes indoors) elevate indoor relative humidity above 60%, air reaching cold external wall surfaces plummets below the <strong>12.8°C dew point</strong>, depositing liquid water and triggering <em>Aspergillus niger</em> (black toxic mould) colonization within 48 to 72 hours.
                  </p>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold">Dominant Architecture:</strong>
                      <span>{area.dominant_house_type} homes account for the majority of residential units, with {area.pct_terrace_or_flat}% classified as terraces or flats.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold">Awaab&apos;s Law &amp; Landlord Duties:</strong>
                      <span>Under the Social Housing Regulation Act 2023, social landlords must investigate damp hazards within strict 14-day statutory timeframes.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LOCAL MOISTURE PATHOLOGY & ACTION PLAN */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
                  <Activity className="w-3.5 h-3.5 text-slate-700" />
                  Building Pathology Roadmap
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  Local Moisture Pathology &amp; Action Plan for {area.outcode}
                </h2>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                  Tailored remediation roadmap based on {area.outcode}&apos;s specific building fabric ({area.pct_old_build}% pre-1930 builds, {area.dominant_house_type} architecture, {area.risk_level} risk tier).
                </p>

                {/* Architectural Commentary by Dominant House Type */}
                <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    <span>Architectural Typology Profile: {area.dominant_house_type} in {area.outcode}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {area.dominant_house_type === "Mid-Terrace" && (
                      <>
                        In <strong>{area.outcode}</strong>, Mid-Terrace properties represent the predominant residential typology ({area.pct_terrace_or_flat}% terraced or flat distribution). Mid-terraced dwellings benefit from lateral thermal sheltering by adjacent occupied homes on either party wall, reducing overall external heat dissipation. However, their primary moisture vulnerability arises from <strong>cold rear outrigger additions</strong> (often single-leaf brick extensions housing kitchens or sculleries) and <strong>single-aspect airflow limitations</strong>. Without unrestricted front-to-back cross-ventilation, internal humidity produced in kitchens and bathrooms stagnates along central stairwells and uninsulated rear party junctions.
                      </>
                    )}
                    {area.dominant_house_type === "End-Terrace" && (
                      <>
                        End-Terrace properties in <strong>{area.outcode}</strong> present distinct moisture dynamics compared to mid-terrace units. While sharing thermal stability on one party wall, end-terraces feature a massive, uninterrupted solid brick flank wall directly exposed to prevailing wind-driven precipitation and ambient temperature drops. In pre-1930 solid-wall construction, this exposed flank wall behaves as a thermal radiator, drawing heat away from interior bedrooms and dropping interior plaster below the critical 12.8°C dew point. This creates severe corner condensation and persistent black mould colonization on external wall junctions.
                      </>
                    )}
                    {area.dominant_house_type === "Semi-Detached" && (
                      <>
                        Semi-Detached housing forms the primary residential profile in <strong>{area.outcode}</strong>. The principal damp vulnerability in semi-detached properties centers around the long exposed gable elevation and the thermal junctions between roof eaves and exterior masonry. Driving rain directly impacts unshielded side elevations, while cold external winter conditions lower plaster temperatures in corner bedrooms. Furthermore, differences in heating schedules between adjoining neighbours can trigger thermal vapor migration across party cavity barriers or chimney flues, manifesting as damp staining around chimney alcoves.
                      </>
                    )}
                    {area.dominant_house_type === "Detached" && (
                      <>
                        Detached residences in <strong>{area.outcode}</strong> feature four completely detached external elevations exposed to 360-degree environmental weathering and directional wind-driven rain. Without thermal sheltering from adjacent properties, detached homes suffer higher external heat loss per square metre. Remedial moisture defense requires careful maintenance of sub-floor cross-ventilation across opposing wall airbricks, balanced roof valley lead flashings, and continuous background thermal control across all perimeter bedrooms.
                      </>
                    )}
                  </p>
                </div>

                {/* 3 Prescribed Remedial Action Steps */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    3-Step Diagnostic &amp; Remedial Action Plan:
                  </h3>

                  {isHigh ? (
                    <>
                      {/* Step 1 for High */}
                      <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/50">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            1
                          </span>
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-slate-900">
                              Solid Wall Thermal Barrier Analysis &amp; Internal Insulation (IWI)
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              With {area.pct_old_build}% of homes in {area.outcode} built prior to 1930 without cavity wall barriers, uninsulated 9-inch solid brickwork allows external winter cold to penetrate directly through the masonry. When indoor relative humidity exceeds 60%, air reaching external wall plaster plummets below the 12.8°C dew point. Rather than installing non-breathable foil-backed plasterboard (which risks interstitial damp and hidden timber decay behind the lining), commission a moisture simulation to evaluate vapor-permeable aerogel blankets or wood-fibre internal wall insulation (IWI) finished with breathable lime plaster.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 for High */}
                      <div className="p-5 rounded-2xl border border-amber-100 bg-amber-50/50">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            2
                          </span>
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-slate-900">
                              External Masonry Water-Repellent Breathability Treatment
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Driving rain across {area.city} saturates weathered external brickwork and deteriorating lime-mortar joints. Saturated brickwork increases thermal conductivity by up to 300%, accelerating indoor wall chilling. Apply a deeply penetrating, breathable silane-siloxane masonry cream (tested to British Standards / BBA certification). This lines internal pore capillaries with a hydrophobic barrier—repelling liquid water from rain while allowing internal water vapor to escape outward naturally, preventing frost spalling and penetrating damp.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 for High */}
                      <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            3
                          </span>
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-slate-900">
                              Sub-Floor Void &amp; Airbrick Clearance Verification
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Suspended timber ground floors require continuous under-floor airflow to prevent moisture buildup beneath floorboards. In {area.outcode}, external paving, tarmac drives, or flower beds frequently bridge the 150mm damp-proof course (DPC) or block sub-floor airbricks. Ensure all perimeter airbricks provide at least 75mm clear opening above finished ground level. If external levels have been raised, install periscopic cranked airbrick sleeves to ventilate the sub-floor void and prevent wet rot (<em>Coniophora puteana</em>) or devastating dry rot (<em>Serpula lacrymans</em>) from weakening structural floor joists.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Step 1 for Moderate/Low */}
                      <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            1
                          </span>
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-slate-900">
                              Lifestyle Vapor Mitigation &amp; Mechanical Source Extraction
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Even with a lower baseline risk score of {area.damp_risk_score}/100 in {area.outcode}, a typical household generates 10 to 15 litres of water vapor daily from respiration, cooking, and hot showers. Uncontrolled moisture creates localized microclimates behind wardrobes and on cold window lintels. Strictly avoid drying wet laundry on radiators without active mechanical extraction. Ensure kitchen and bathroom extractors feature continuous trickle extraction or 15-minute overrun timers to expel humid air at the source before it spreads to cooler bedrooms.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 for Moderate/Low */}
                      <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            2
                          </span>
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-slate-900">
                              Continuous Trickle Vent Usage &amp; Background Air Circulation
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Modern energy-efficient double glazing creates an airtight seal that traps indoor humidity. Keep all window trickle vents open 24/7 throughout autumn and winter. Conforming to Building Regulations Part F (Ventilation), trickle vents maintain crucial passive background air exchange without producing noticeable room draughts or thermal energy loss, preventing stagnant overnight condensation pools on window cills.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 for Moderate/Low */}
                      <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            3
                          </span>
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-slate-900">
                              Dew-Point Equilibrium &amp; Consistent Background Heating
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Fluctuating heating cycles—such as turning heating off completely overnight in cold weather—causes indoor air to cool rapidly. As air cools, its relative humidity increases sharply, dropping peripheral wall surfaces below the saturation dew point. Maintain consistent background heating (minimum 15°C to 18°C) in perimeter rooms and unheated spare bedrooms across {area.city} to stabilize plaster temperature and eliminate surface condensation before fungal spores can germinate.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Dehumidifier Sizing & Extraction Guide */}
              <DehumidifierSizingGuide
                outcode={area.outcode}
                dampRiskScore={area.damp_risk_score}
                pctOldBuild={area.pct_old_build}
                pctPoorEpc={area.pct_poor_epc}
                dominantHouseType={area.dominant_house_type}
                city={area.city}
              />

              {/* Independent Surveyor Quote Form with id="survey-quote" */}
              <div id="survey-quote">
                <QuoteRequestCard
                  outcode={area.outcode}
                  dampRiskScore={area.damp_risk_score}
                  locationName={area.city}
                />
              </div>
            </div>

            {/* Right Sidebar: City Peers & Quick Comparison */}
            <div className="space-y-6">
              {/* City Summary Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-800" />
                  {area.city} Regional Profile
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  How {area.outcode} compares to neighboring {area.city} postal districts.
                </p>

                <div className="mt-4 space-y-2">
                  {cityPeers.map((peer) => {
                    const peerColor = getRiskColorClass(peer.risk_level);
                    return (
                      <Link
                        key={peer.outcode}
                        href={`/damp-risk/${peer.outcode.toLowerCase()}`}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <span className="font-extrabold text-slate-800 group-hover:text-slate-900 text-sm block">
                            {peer.outcode}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {peer.dominant_house_type} • {peer.pct_old_build}% Old
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 text-xs block">
                            {peer.damp_risk_score} / 100
                          </span>
                          <span className={`text-[10px] font-bold ${peerColor.text}`}>
                            {peer.risk_level}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <Link
                    href={`/cities/${area.city.toLowerCase()}`}
                    className="text-xs font-bold text-slate-900 hover:text-slate-700 flex items-center justify-between"
                  >
                    <span>View All {area.city} Districts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Head to Head Compare Callout */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Comparison Engine
                </span>
                <h4 className="font-black text-lg text-white">
                  Compare {area.outcode} with Another District
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Moving house or managing multiple rental portfolios? Compare EPC profiles and solid wall vulnerability head-to-head.
                </p>
                <Link
                  href="/compare"
                  className="mt-4 inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors w-full justify-center"
                >
                  <span>Launch Postcode Comparison</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Methodology & Data Source Notice */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                  <Info className="w-4 h-4 text-slate-700" />
                  <span>Data Integrity &amp; Methodology</span>
                </div>
                <p>
                  Damp risk scores are calculated by cross-referencing pre-1930 solid wall percentages, EPC band E-G distributions, and local housing density metrics from the English Housing Survey and UK EPC Register.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-white rounded-3xl p-6 sm:max-w-none sm:p-10 border border-slate-200/90 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-slate-800" />
                Frequently Asked Questions about Damp in {area.outcode}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Expert insights for homeowners, buyers, and tenants across {area.city}.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-base font-extrabold text-slate-900">
                  What causes damp problems in {area.outcode}?
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  In {area.outcode}, the primary driver of domestic damp is a combination of <strong>{area.pct_old_build}% pre-1930 solid-wall construction</strong> and <strong>{area.pct_poor_epc}% EPC band E-G thermal inefficiency</strong>. Without cavity insulation, external cold lowers internal wall surface temperatures below the condensation dew point.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-6">
                <h3 className="text-base font-extrabold text-slate-900">
                  How can I tell the difference between condensation and rising damp?
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Condensation typically manifests as superficial black mould (<em>Aspergillus</em>) on cold external corners, behind wardrobes, and around window reveals, accompanied by water droplets on glass. Rising damp occurs exclusively on ground-floor walls up to 1.2 metres, leaving tide marks, bubbling plaster, and hygroscopic mineral salts.
                </p>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  When should I commission an independent PCA damp survey in {area.outcode}?
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Before purchasing any pre-1930 or solid-brick property in {area.outcode}, an independent survey by a CSRT (Certified Surveyor in Remedial Treatment) or PCA-registered surveyor is essential. An independent surveyor charges a fixed inspection fee and does not sell chemical damp-proofing treatments, ensuring completely unbiased diagnostics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
