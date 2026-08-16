"use client";

import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function PackageFaqSection() {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
      <h3 className="font-heading text-xl font-bold text-slate-900 tracking-tight leading-[1.3] flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-brand-action" /> Frequently Asked Questions
      </h3>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="faq-1" className="border-b border-slate-100 py-1">
          <AccordionTrigger className="font-heading text-slate-800 font-bold hover:no-underline hover:text-brand-action text-left leading-[1.3]">
            What is the sample size requirement for this package?
          </AccordionTrigger>
          <AccordionContent className="font-body text-slate-600 leading-[1.5] text-sm font-normal">
            Typically, we require a minimum of 200g to 500g of the packaged food or liquid sample in its original retail package. For custom container samples, please ensure it is tightly sealed in a sterile container.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-2" className="border-b border-slate-100 py-1">
          <AccordionTrigger className="font-heading text-slate-800 font-bold hover:no-underline hover:text-brand-action text-left leading-[1.3]">
            How is the sample collected?
          </AccordionTrigger>
          <AccordionContent className="font-body text-slate-600 leading-[1.5] text-sm font-normal">
            Once you finalize the booking, our specialized sample collection executives will pick up the sample from your facility in specialized cold-chain insulated bags to maintain temperature integrity during transit.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-3" className="border-0 py-1">
          <AccordionTrigger className="font-heading text-slate-800 font-bold hover:no-underline hover:text-brand-action text-left leading-[1.3]">
            Are the reports valid for FSSAI / legal compliance?
          </AccordionTrigger>
          <AccordionContent className="font-body text-slate-600 leading-[1.5] text-sm font-normal">
            Yes, all testing is conducted in NABL accredited and FSSAI notified laboratories. The reports generated will carry official NABL holograms and QR codes, which are 100% compliant for FSSAI submissions, audits, and certifications.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
