import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
  sector: string;
}

export default function FAQSection({ items, sector }: Props) {
  return (
    <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm mb-10">
      <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider mb-2">
        <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">
        Damp &amp; Mould FAQs for Outcode {sector}
      </h2>

      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="border-b border-slate-100 pb-4 last:border-none last:pb-0">
            <h3 className="font-bold text-slate-900 text-base mb-2 flex items-start gap-2">
              <span className="text-slate-900 font-black">Q:</span> {item.question}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed pl-6">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}