import Link from "next/link";
import { ShieldCheck, Database, Award, ArrowLeft, CheckCircle2, Building2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Hero Header */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-800 mb-4">
            <ShieldCheck className="w-4 h-4 text-slate-700" /> Transparency &amp; Building Pathology First
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">
            About UK Damp Risk Index
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            CheckDamp UK is an independent property condition analytics platform synthesizing open government housing data, Energy Performance Certificate (EPC) registers, and solid-wall housing distribution to benchmark domestic damp and condensation risks across the United Kingdom.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Award className="w-6 h-6 text-cyan-600" /> Our Mission
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Millions of UK residents live in homes suffering from persistent condensation, dampness, and toxic black mould. Furthermore, an estimated 75% of remedial damp-proofing works commissioned each year are based on misdiagnosed surface condensation treated as &quot;rising damp.&quot;
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our mission is to empower tenants, homebuyers, and property owners with transparent building physics data, helping them identify root causes, understand statutory rights under Awaab&apos;s Law, and connect with accredited independent PCA / RICS surveyors.
          </p>
        </div>

        {/* Data Methodology */}
        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Database className="w-6 h-6 text-cyan-600" /> Data Methodology &amp; Sources
            </h2>
            <p className="text-slate-600 text-sm">
              We aggregate and cross-reference multiple official UK public registers to compute local Damp Risk Scores (0-100):
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" /> UK EPC Open Data Register
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aggregates millions of domestic Energy Performance Certificates to calculate the percentage of properties in bands E, F, and G with cold external wall dew points.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Valuation Office Agency (VOA) Housing Stock
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Determines the proportion of pre-1930 solid-wall construction lacking modern cavity barriers across each UK postal district.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" /> British Standards (BS 5250:2021)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recommendations align with the British Standard Code of Practice for the control of condensation in buildings and BRE Digest 245 testing standards.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Independent Surveyor Standards
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We advocate for CSRT (Certificated Surveyor in Remedial Treatment) and CSTDB professionals who charge fixed inspection fees without selling chemical injections.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Important Disclaimer:</strong> CheckDamp UK is an independent data analysis service. Risk scores and metrics are calculated for educational and preliminary screening purposes. Always commission an on-site, PCA-accredited damp and timber survey before purchasing property or initiating remedial building work.
        </div>
      </div>
    </div>
  );
}