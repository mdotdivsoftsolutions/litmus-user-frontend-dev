"use client";

import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

export function LabPromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-24">
      <div className="relative rounded-[2rem] bg-slate-950 p-12 lg:p-20 overflow-hidden group shadow-[0_64px_128px_rgba(0,0,0,0.1)]">
        <div className="absolute top-0 right-0 w-[600px] h-full bg-[#D32F2F]/10 blur-[120px] rounded-full translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[#feba50] text-[10px] font-semibold uppercase tracking-[0.4em]">
              <Zap className="h-4 w-4 fill-current" /> Limited Enterprise Offer
            </div>
            <h2 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
              Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Clinical Compliance</span> <br />
              with Litmus Premium.
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg">
              Get direct access to our most prestigious laboratories with 20% off on bulk testing packages and priority safety audits.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <Button className="h-14 px-10 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl flex items-center gap-3">
                Claim Offer <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-4 relative group-hover:scale-105 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800"
                alt="Institutional Science"
                className="w-full h-full object-cover rounded-[2rem] opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent rounded-[2rem]" />
              <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 space-y-2">
                <p className="text-[#feba50] text-3xl font-bold tracking-tighter">24/7</p>
                <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">Global Support Coverage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
