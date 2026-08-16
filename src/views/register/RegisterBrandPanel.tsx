"use client";

import { FlaskConical, CheckCircle2 } from "lucide-react";

export function RegisterBrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-5/12 items-center justify-center bg-gradient-to-br from-[#002e3b] via-[#004B60] to-[#00751F] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-brand-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-action rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 px-12 text-center max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <FlaskConical className="h-12 w-12 text-white" />
          <div className="text-left">
            <h1 className="text-3xl font-bold text-white tracking-tight">LITMUS</h1>
            <p className="text-xs tracking-[0.2em] text-white/70">FOOD ANALYTICS</p>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-4">Create Your Account</h2>
        <p className="text-white/80 text-sm leading-relaxed">
          Join thousands of food businesses ensuring FSSAI compliance through accredited laboratory testing.
        </p>
        <div className="mt-10 space-y-3 text-left text-white/90 text-sm">
          {["500+ FSSAI-aligned tests", "NABL accredited laboratories", "Transparent pricing & reports"].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
