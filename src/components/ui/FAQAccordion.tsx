'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '@/types';

interface FAQAccordionProps {
  faqs: FAQ[];
  accentColor?: string;
  defaultOpenIndex?: number | null;
}

export default function FAQAccordion({
  faqs,
  accentColor = '#477BDB',
  defaultOpenIndex = 0,
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-3 w-full">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={faq.id || i}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-white/[0.04] border-white/20 shadow-lg'
                : 'bg-white/[0.02] border-white/[0.07] hover:border-white/15'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
            >
              <span className="text-sm font-semibold text-white tracking-tight">
                {faq.question}
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 bg-white/10' : 'bg-white/[0.03]'
                }`}
                style={{ color: isOpen ? accentColor : 'rgba(255,255,255,0.45)' }}
              >
                <ChevronDown size={15} />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 border-t border-white/[0.04] animate-fadeIn">
                <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
