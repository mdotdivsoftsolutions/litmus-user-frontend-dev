"use client";

import Link from "next/link";
import { Briefcase, ArrowRight, MapPin } from "lucide-react";
import { PolicyHero } from "./components/policies/PolicyHero";
import { Badge } from "@/components/ui/badge";
import { CAREER_CATEGORY_ORDER, careersGrouped, type CareerOpening } from "@/lib/company-careers-data";

function JobCard({ opening }: { opening: CareerOpening }) {
  return (
    <Link
      href={`/careers/${opening.slug}`}
      className="group block rounded-2xl border border-slate-100 bg-white p-6 hover:border-brand-primary/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <h3 className="text-lg font-semibold text-slate-800 tracking-tight group-hover:text-brand-primary transition-colors">
            {opening.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{opening.summary}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider">
              {opening.type}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {opening.location}
            </span>
            <span className="text-xs text-slate-400">Posted {opening.posted}</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-primary shrink-0">
          View role <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default function CareersPage() {
  const grouped = careersGrouped();

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        icon={Briefcase}
        eyebrow="Careers · Join Litmus"
        title={
          <>
            Build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-action">
              trustworthy diagnostics
            </span>
          </>
        }
        subtitle="Engineering, laboratory science, operations, and growth — open roles grouped by team. Demo postings for UI preview."
      />

      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          {CAREER_CATEGORY_ORDER.map((category) => {
            const list = grouped[category];
            if (!list || list.length === 0) return null;

            return (
              <div key={category} className="space-y-6">
                <div className="flex items-baseline justify-between border-b border-slate-200/80 pb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-slate-800 tracking-tight">{category}</h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {list.length} {list.length === 1 ? "opening" : "openings"}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {list.map((opening) => (
                    <JobCard key={opening.slug} opening={opening} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
