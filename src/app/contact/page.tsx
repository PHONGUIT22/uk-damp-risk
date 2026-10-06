"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">
            Contact Support
          </h1>
          <p className="text-lg text-slate-600">
            Have questions about your postcode&apos;s damp risk score, feedback on our property data, or surveyor partnership inquiries? We&apos;re here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <Mail className="w-6 h-6 text-slate-900 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Email Us Directly</h3>
              <p className="text-xs text-slate-500 mb-2">For general inquiries &amp; data feedback:</p>
              <a href="mailto:support@checkdamp.co.uk" className="text-sm font-semibold text-slate-900 hover:text-blue-700 underline">
                support@checkdamp.co.uk
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <Clock className="w-6 h-6 text-slate-900 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm mb-1">Response Time</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our building data analysis team typically responds within 24 to 48 business hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Send us a message</h2>
            
            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-base text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Message Sent Successfully!
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you for contacting CheckDamp UK. Our data analytics team has received your message and will respond to your email within 24-48 business hours.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Your Email</label>
                  <input
                    type="email"
                    placeholder="john@example.co.uk"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Postcode data inquiry or feedback"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you with damp risk, condensation, or surveyor inquiries?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-800"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}