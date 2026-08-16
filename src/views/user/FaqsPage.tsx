"use client";

import { CircleHelp } from "lucide-react";
import Link from "next/link";
import { PolicyHero } from "./components/policies/PolicyHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I book a diagnostic test?",
    a: "Choose tests or a package, add them to your cart, pick home collection or lab visit, and complete checkout. You will receive an SMS and email with your order ID and next steps.",
  },
  {
    q: "How long do results take?",
    a: "Turnaround depends on the assay matrix and lab workload. Typical food chemistry panels complete within a few business days; microbiology cultures may take longer. Your order summary shows an estimate.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. Open My Orders from your profile menu or use Track Order in the footer. Search by order ID or product name to see status updates until your report is ready.",
  },
  {
    q: "How do I prepare my sample?",
    a: "Follow the instructions in your booking confirmation. Some tests require fasting or sterile containers; our phlebotomy partner will confirm timing when they call to schedule collection.",
  },
  {
    q: "Where can I download my report?",
    a: "When status shows Reports Ready, open the order detail page or visit the Reports section to download your PDF. Reports are issued by the accredited performing laboratory.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major cards and UPI through our payment partners. GST-compliant invoices are available after payment succeeds.",
  },
  {
    q: "Can I cancel or reschedule?",
    a: "Requests before sample collection may be eligible for cancellation per lab policy. After collection, cancellation may not be possible; contact support with your order ID for options.",
  },
  {
    q: "Is my health data secure?",
    a: "We apply administrative and technical safeguards aligned with healthcare expectations. Read our Privacy Policy for categories of data we collect and how we share them with partner labs.",
  },
];

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
        subtitle="Straightforward answers about booking, samples, tracking, and reports. Demo copy — refine with your operations team."
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
