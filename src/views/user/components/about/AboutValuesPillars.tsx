"use client";

import { ShieldCheck, Zap, Eye, Users, Microscope, Truck, FileStack, Sparkles } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity of measurement",
    copy: "We publish methods, scopes, and limitations clearly — no black-box “trust us” language.",
  },
  {
    icon: Zap,
    title: "Speed with rigour",
    copy: "Turnaround targets are set with labs upfront; escalations are visible in-product, not buried in email.",
  },
  {
    icon: Eye,
    title: "Transparency",
    copy: "Pricing, SLAs, and report histories are structured for auditors as well as everyday shoppers.",
  },
  {
    icon: Users,
    title: "Partnership",
    copy: "Labs remain the accredited authority; Litmus orchestrates scheduling, data hand-offs, and CX.",
  },
];

const pillars = [
  {
    icon: Microscope,
    title: "Accredited laboratory network",
    copy: "Curated partner labs with chemistry, microbiology, and labelling capabilities mapped to your SKU categories.",
  },
  {
    icon: Truck,
    title: "Collection & logistics",
    copy: "Home visits and hub drops coordinated with cold-chain awareness for sensitive matrices.",
  },
  {
    icon: FileStack,
    title: "Reports & enterprise workflows",
    copy: "PDF delivery, GST-ready artefacts, and hooks for procurement teams wiring diagnostics into QA programmes.",
  },
  {
    icon: Sparkles,
    title: "Consumer-grade experience",
    copy: "Searchable catalogues, cart/checkout, and order tracking — without diluting scientific accuracy.",
  },
];

export function AboutValuesPillars() {
  return (
    <>
      <section className="bg-slate-50 border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-8">Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-[#D32F2F]" aria-hidden />
                  </div>
                  <h3 className="font-semibold text-slate-800 tracking-tight mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-3">What we deliver</h2>
          <p className="text-[15px] md:text-base text-slate-600 max-w-3xl mb-10 leading-relaxed">
            One platform does not replace specialised instruments or bench scientists — it aligns everyone around the same facts before money
            moves or trucks roll.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex gap-5 rounded-2xl border border-slate-100 p-6 hover:border-[#D32F2F]/15 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-[#D32F2F]" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 tracking-tight mb-2">{p.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{p.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
