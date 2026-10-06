import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-8 pb-6 border-b border-slate-200">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Last Updated: January 1, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-6 leading-relaxed">
          
          <p>
            At <strong>CheckDamp UK</strong>, available at https://checkdamp.co.uk, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by CheckDamp UK and how we use it.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">1. Log Files</h2>
          <p>
            CheckDamp UK follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          {/* CHUYÊN MỤC BẮT BUỘC DÀNH CHO GOOGLE ADSENSE */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-slate-800">
            <h2 className="text-base font-bold text-slate-900 uppercase mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-700" /> 2. Google DoubleClick DART Cookie &amp; Advertising Policies
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed mb-3">
              Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to checkdamp.co.uk and other sites on the internet.
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL:{" "}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-bold underline">
                https://policies.google.com/technologies/ads
              </a>
            </p>
          </div>

          <h2 className="text-lg font-bold text-slate-900 uppercase">3. Privacy Policies of Third-Party Advertisers</h2>
          <p>
            You may consult this list to find the Privacy Policy for each of the advertising partners of CheckDamp UK. Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on CheckDamp UK, which are sent directly to users&apos; browsers.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">4. UK GDPR &amp; Data Protection Rights</h2>
          <p>
            Under the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018, UK residents are entitled to full access, rectification, erasure, and restriction of processing regarding any personal data collected. CheckDamp UK does not sell personal user information.
          </p>

          <h2 className="text-lg font-bold text-slate-900 uppercase">5. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>support@checkdamp.co.uk</strong>.
          </p>

        </div>

      </div>
    </div>
  );
}