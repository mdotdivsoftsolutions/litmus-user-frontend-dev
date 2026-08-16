"use client";

import { Eye, Target } from "lucide-react";

export function AboutVisionMission() {
  return (
    <section className="bg-white border-t border-slate-100 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-slate-100 p-8 md:p-10 bg-gradient-to-br from-white to-slate-50/80">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#D32F2F]/10 text-[#D32F2F] mb-6">
            <Eye className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-3">Vision</h2>
          <p className="text-[15px] md:text-base text-slate-600 leading-relaxed">
            A food economy where every consequential safety decision — from new product launch to import clearance — can be backed by
            timely, accredited measurement and plain-language evidence chains.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 p-8 md:p-10 bg-gradient-to-br from-white to-slate-50/80">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#D32F2F]/10 text-[#D32F2F] mb-6">
            <Target className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-3">Mission</h2>
          <p className="text-[15px] md:text-base text-slate-600 leading-relaxed">
            Compress time-to-compliance for product teams while giving households confidence in what they eat. We obsess over specimen
            integrity, predictable turnaround communication, and reports that survive scrutiny from QA leads and auditors alike.
          </p>
        </div>
      </div>
    </section>
  );
}
