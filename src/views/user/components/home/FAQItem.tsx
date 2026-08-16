"use client";

import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQData } from "./faq-data";

interface FAQItemProps {
  faq: FAQData;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div
      className={cn(
        "group border rounded-2xl overflow-hidden transition-all duration-300",
        isOpen ? "border-slate-200 bg-white shadow-md" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "font-semibold text-sm leading-snug transition-colors duration-200 md:text-base",
            isOpen ? "text-gradient-brand" : "text-slate-800 group-hover:text-slate-900"
          )}
        >
          {faq.question}
        </span>
        <span
          className={cn(
            "flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300",
            isOpen ? "bg-gradient-brand text-white rotate-0 shadow-sm" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
          )}
        >
          {isOpen ? <Minus className="w-3.5 h-3.5" strokeWidth={2.5} /> : <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />}
        </span>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 pb-5">
          <div className="h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent mb-4" />
          <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}
