import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-8 pb-6 border-b border-slate-200">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500">Effective Date: January 1, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-6 leading-relaxed">
          
          <p>
            Welcome to <strong>CheckDamp UK</strong>! By accessing or using our website located at https://checkdamp.co.uk, you agree to comply with and be bound by the following Terms of Service.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">1. Informational &amp; Educational Disclaimer</h2>
          <p className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800">
            <strong>Disclaimer:</strong> All damp risk scores, building condition estimates, condensation indices, and remedial guidance published on CheckDamp UK are provided solely for general informational and educational purposes. They do not constitute formal architectural surveys or binding structural damp diagnoses. Always commission a certified Property Care Association (PCA) or RICS-accredited surveyor to inspect your property before undertaking remedial treatments.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">2. Use of Content &amp; Intellectual Property</h2>
          <p>
            The content, structure, database layout, and visual elements of CheckDamp UK are protected by intellectual property laws. You may access our tools for personal, non-commercial use. Automated scraping or commercial redistribution of our aggregated datasets without written permission is strictly prohibited.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">3. Data Sources &amp; Accuracy</h2>
          <p>
            While we strive to keep our data updated using official UK public sources (including the UK EPC Register, Valuation Office Agency, English Housing Survey, and British Standards BS 5250:2021), CheckDamp UK makes no warranties regarding hyper-local microclimates, structural alterations, or undocumented building modifications.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">4. Limitation of Liability</h2>
          <p>
            In no event shall CheckDamp UK or its operators be liable for any direct, indirect, incidental, or consequential damages resulting from the use or reliance on our calculations, ratings, or guides.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the site after changes are posted constitutes acceptance of the modified Terms of Service.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">6. Contact Information</h2>
          <p>
            For questions regarding these Terms, please contact us at <strong>support@checkdamp.co.uk</strong>.
          </p>

        </div>

      </div>
    </div>
  );
}