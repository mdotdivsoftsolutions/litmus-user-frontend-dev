"use client";

import Link from "next/link";
import { LifeBuoy, FlaskConical, Package, MapPin, FileText, Headphones, ArrowRight } from "lucide-react";
import { PolicyHero } from "./components/policies/PolicyHero";

const tiles = [
  {
    title: "Browse tests",
    description: "Search parameters, methods, and pricing across accredited partner labs.",
    href: "/tests",
    icon: FlaskConical,
  },
  {
    title: "Health packages",
    description: "Bundle popular assays for compliance checks and routine monitoring.",
    href: "/packages",
    icon: Package,
  },
  {
    title: "Sample collection",
    description: "How home visits work, fasting rules, and container guidelines.",
    href: "/support",
    icon: MapPin,
  },
  {
    title: "Reports & billing",
    description: "Download PDF reports, GST invoices, and understand turnaround times.",
    href: "/reports",
    icon: FileText,
  },
];

export default function HelpCenterPage() {
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        icon={LifeBuoy}
        eyebrow="Resources · Help center"
        title={
          <>
            How can we{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-action">
              help you?
            </span>
          </>
        }
        subtitle="Quick paths to booking, samples, reports, and live support. Demo content for your Help hub — replace with real articles and links when ready."
      />

      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tiles.map((tile) => {
              const Icon = tile.icon;
              return (
                <Link
                  key={tile.href}
                  href={tile.href}
                  className="group rounded-2xl border border-slate-100 bg-slate-50/40 p-6 hover:border-brand-primary/20 hover:bg-white hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-all"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-slate-100 text-brand-primary shadow-sm mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-semibold text-slate-800 tracking-tight mb-2 group-hover:text-brand-primary transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{tile.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary">
                    Open <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-14 rounded-2xl border border-slate-100 bg-slate-50/60 p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Need direct human support?</h4>
                <p className="text-sm text-slate-500">Reach our clinical operations desk for sample questions or order assistance.</p>
              </div>
            </div>
            <Link
              href="/support"
              className="px-6 py-2.5 rounded-xl bg-brand-action hover:bg-brand-action-hover text-white text-sm font-semibold shadow-sm transition-colors shrink-0"
            >
              Open Support Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
