"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  Phone,
  Home,
  Clock,
  Wrench,
  Shield,
  FileText,
  AlertTriangle
} from "lucide-react";

interface QuoteRequestCardProps {
  outcode: string;
  dampRiskScore?: number;
  locationName?: string;
}

export default function QuoteRequestCard({
  outcode,
  dampRiskScore = 35,
  locationName = "your area",
}: QuoteRequestCardProps) {
  const isHighRisk = dampRiskScore >= 50;

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [serviceNeeded, setServiceNeeded] = useState(
    isHighRisk ? "damp_timber_survey" : "condensation_mould"
  );
  const [propertyType, setPropertyType] = useState("victorian_solid");
  const [urgency, setUrgency] = useState("within_month");

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcode,
          city_or_town: locationName,
          damp_risk_score: dampRiskScore,
          service_needed: serviceNeeded,
          property_type: propertyType,
          urgency,
          full_name: fullName,
          phone_number: phoneNumber,
          email,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to register survey inquiry. Please check your details.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-8 text-center shadow-lg my-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
          Request Received
        </span>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Survey Request Confirmed for {outcode}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 leading-relaxed">
          Thank you, <strong>{fullName}</strong>. We have matched your inquiry with accredited independent PCA / RICS damp & timber surveyors covering <strong>{locationName} ({outcode})</strong>.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-semibold text-slate-700 shadow-xs border border-emerald-200">
          <Clock className="h-4 w-4 text-emerald-600" />
          <span>Local specialist will contact you by phone/email within 1 business day</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl my-8">
      {/* Top Banner & Trust badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 block">
              Independent Surveyor Network • {outcode}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">PCA &amp; RICS Accredited</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">Unbiased Diagnosis (No Sales Commission)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
          <Shield className="w-4 h-4 text-slate-700" />
          <span>100% Free &amp; No-Obligation</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Get an Independent Damp & Timber Survey Quote
        </h3>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Need a definitive diagnosis for buying a property, mortgage lender retention, or persistent black mould? Get transparent fixed-fee quotes from vetted, insured damp surveyors in <strong>{locationName} ({outcode})</strong>.
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
            step === 1 ? "bg-slate-900 text-white" : "bg-emerald-600 text-white"
          }`}>
            {step === 1 ? "1" : "✓"}
          </span>
          <span className={`text-xs font-bold ${step === 1 ? "text-slate-900" : "text-slate-500"}`}>
            Survey Needs
          </span>
        </div>
        <div className="h-0.5 w-8 bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
            step === 2 ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600"
          }`}>
            2
          </span>
          <span className={`text-xs font-bold ${step === 2 ? "text-slate-900" : "text-slate-400"}`}>
            Contact Details
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-medium text-red-700 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Survey Needs */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              1. What service do you require in {outcode}?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "damp_timber_survey",
                  title: "Pre-Purchase Damp & Timber Survey",
                  desc: "Essential for homebuyers & mortgage approvals. Full written report with moisture mapping.",
                },
                {
                  id: "condensation_mould",
                  title: "Condensation & Mould Diagnosis",
                  desc: "Dew-point analysis, hygrometer testing, and PIV / ventilation recommendations.",
                },
                {
                  id: "rising_penetrating",
                  title: "Rising & Penetrating Damp Inspection",
                  desc: "DPC check, external brick pointing, ground-level bridging, and salt contamination tests.",
                },
                {
                  id: "full_property_audit",
                  title: "Thermal Imaging & Moisture Audit",
                  desc: "FLIR thermal camera scan to locate hidden plumbing leaks and cold bridging.",
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    serviceNeeded === item.id
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm ring-1 ring-slate-900"
                      : "border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 text-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-bold block">{item.title}</span>
                    <input
                      type="radio"
                      name="service"
                      value={item.id}
                      checked={serviceNeeded === item.id}
                      onChange={() => setServiceNeeded(item.id)}
                      className="sr-only"
                    />
                  </div>
                  <span className={`text-xs mt-2 block ${serviceNeeded === item.id ? "text-slate-300" : "text-slate-500"}`}>
                    {item.desc}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                2. Property Construction Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="victorian_solid">Victorian / Pre-1930 Solid Wall</option>
                <option value="semi_detached">1930-1980 Cavity Wall Semi-Detached</option>
                <option value="terraced">Mid / End-of-Terrace House</option>
                <option value="flat_apartment">Apartment / Tenement Flat</option>
                <option value="modern_post_1980">Modern Post-1980 Insulated Build</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                3. Timescale / Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="asap">Urgent (Within 48 hours / Home purchase deadline)</option>
                <option value="within_month">Next 2 to 4 weeks</option>
                <option value="planning_budget">Planning & getting quotes</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Continue to Contact Step</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Contact Details */}
      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. David Williams"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                UK Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 07123 456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. david@example.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>We never sell your contact info. Details are shared solely with 1-2 verified local damp surveyors.</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting with Local Surveyors...</span>
                </>
              ) : (
                <>
                  <span>Request Free Survey Quotes</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
