"use client";

import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhyLitmusVisualColumnProps {
  isDark: boolean;
}

export function WhyLitmusVisualColumn({ isDark }: WhyLitmusVisualColumnProps) {
  return (
    <div className="lg:col-span-5 relative">
      <div
        className={cn(
          "relative aspect-[4/5] rounded-[4.5rem] overflow-hidden border-[16px] shadow-[0_64px_128px_rgba(0,0,0,0.5)]",
          isDark ? "border-white/5" : "border-white shadow-xl shadow-slate-200/50"
        )}
      >
        <img
          src="https://images.unsplash.com/photo-1579154235602-382b996311bd?auto=format&fit=crop&q=80&w=800"
          alt="Lab Equipment"
          className="w-full h-full object-cover transition-transform duration-[5000ms] hover:scale-110"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60",
            isDark ? "from-[#0A0D14]" : "from-slate-900/40"
          )}
        />

        <div
          className={cn(
            "absolute bottom-10 left-10 right-10 p-8 rounded-[3rem] backdrop-blur-3xl border flex items-center gap-6 shadow-2xl transition-all duration-700",
            isDark ? "bg-white/[0.03] border-white/10" : "bg-white/80 border-white"
          )}
        >
          <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-[#D32F2F] to-[#F06C00] flex items-center justify-center shrink-0 shadow-lg ring-4 ring-red-500/10">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className={cn("text-[10px] font-black uppercase tracking-[0.3em] mb-1.5", isDark ? "text-white/40" : "text-slate-400")}>
              Live Certification
            </p>
            <p className={cn("text-xl font-bold tracking-tight", isDark ? "text-white" : "text-slate-800")}>
              LT-8842-X Verified
            </p>
            <div className="flex items-center gap-2.5 mt-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">
                Clinical Validation Clear
              </span>
            </div>
          </div>
        </div>

        <div className="absolute -top-12 -right-12 w-48 h-48 border-[24px] border-[#D32F2F]/10 rounded-full" />
      </div>

      <div
        className={cn(
          "absolute -top-20 -right-20 w-80 h-80 blur-[120px] rounded-full -z-10",
          isDark ? "bg-red-600/20" : "bg-red-100"
        )}
      />
      <div
        className={cn(
          "absolute -bottom-20 -left-20 w-80 h-80 blur-[120px] rounded-full -z-10",
          isDark ? "bg-orange-600/20" : "bg-orange-100"
        )}
      />
    </div>
  );
}
