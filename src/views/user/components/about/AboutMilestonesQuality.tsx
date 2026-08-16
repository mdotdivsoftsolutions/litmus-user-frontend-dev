"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const milestones = [
  { year: "2019", text: "Pilot marketplace linking Chennai brands with local ISO-ready labs." },
  { year: "2021", text: "Nationwide collection playbook and SLA dashboards for enterprise buyers." },
  { year: "2023", text: "Unified reporting vault with role-based access for QA and regulatory leads." },
  { year: "2026", text: "Expanded assay catalogue and deeper integrations with partner LIMS pipelines." },
];

export function AboutMilestonesQuality() {
  return (
    <>
      <section className="bg-slate-50 border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-8">Milestones</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {milestones.map((ms) => (
              <div key={ms.year} className="relative pl-6 border-l-2 border-[#D32F2F]/25">
                <p className="text-sm font-bold text-[#D32F2F] mb-2">{ms.year}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{ms.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4 text-[15px] md:text-base text-slate-600 leading-relaxed">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Quality &amp; governance</h2>
            <p>
              Official certificates and interpretations come from the <strong className="text-slate-800 font-semibold">performing laboratory</strong>,
              not from Litmus marketing pages. We publish accreditation references supplied by partners and keep escalation paths open when
              scopes change or assays need referral.
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-slate-300">
              <li>Structured metadata on orders for audit reconstruction (timestamps, parties, document IDs).</li>
              <li>Privacy posture described in our Privacy Policy; retention tuned for healthcare-adjacent records.</li>
              <li>
                Read how we talk about NABL data on the dedicated{" "}
                <Link href="/nabl" className="font-semibold text-brand-primary hover:underline">
                  NABL statement
                </Link>
                .
              </li>
            </ul>
          </div>
          <div className="lg:col-span-5 rounded-2xl bg-slate-900 text-white p-8 flex flex-col justify-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/50 mb-3">Join us</p>
            <p className="text-lg font-semibold tracking-tight mb-4">
              We hire scientists, engineers, and operators who care about trustworthy measurement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/careers"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-brand-action hover:bg-brand-action-hover text-white text-sm font-semibold transition-colors"
              >
                View openings <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blogs"
                className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Read the blog
              </Link>
            </div>
            <Link href="/contact" className="mt-6 text-sm text-white/60 hover:text-white underline-offset-4 hover:underline">
              Corporate &amp; media enquiries → Contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
