"use client";

import { CircleHelp } from "lucide-react";
import Link from "next/link";
import { PolicyHero } from "./components/policies/PolicyHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "./components/policies/faqs-data";

export default function FaqsPage() {
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        icon={CircleHelp}
        eyebrow="Answers · FAQs"
        title={
          <>
            Frequently asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-action">
              questions
            </span>
          </>
        }
        subtitle="Straightforward answers about booking, samples, tracking, and reports."
      />

      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-1 shadow-sm data-[state=open]:bg-white data-[state=open]:border-brand-primary/20 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-800 hover:no-underline text-base py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5 pt-1">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center text-sm text-slate-500">
            Still have questions?{" "}
            <Link href="/contact" className="font-semibold text-brand-primary hover:underline">
              Contact our team
            </Link>{" "}
            or visit the{" "}
            <Link href="/help" className="font-semibold text-brand-primary hover:underline">
              Help Center
            </Link>
            .
          </div>
        </div>
      </section>
    </div>
  );
}
