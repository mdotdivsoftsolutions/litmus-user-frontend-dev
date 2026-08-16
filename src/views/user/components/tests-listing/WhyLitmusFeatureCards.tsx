"use client";

import { Shield, Clock, Zap, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const reasons = [
  {
    icon: Shield,
    title: "NABL Calibration",
    description: "Nationally recognized accuracy standards with certified clinical precision.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Clock,
    title: "Swift TAT",
    description: "Reports delivered with clinically verified efficiency in just 3-5 days.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Zap,
    title: "Full Compliance",
    description: "Adhering to FSSAI & ISO standards for end-to-end safety verification.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Smartphone,
    title: "Live Tracking",
    description: "Real-time updates via WhatsApp & verified QR-coded reports.",
    color: "from-rose-500 to-pink-600",
  },
];

interface WhyLitmusFeatureCardsProps {
  isDark: boolean;
}

export function WhyLitmusFeatureCards({ isDark }: WhyLitmusFeatureCardsProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {reasons.map((item, idx) => (
        <div
          key={idx}
          className={cn(
            "group p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2",
            isDark
              ? "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10"
              : "bg-slate-50/50 border-slate-100 hover:bg-white hover:border-red-100 hover:shadow-xl hover:shadow-slate-200/50"
          )}
        >
          <div
            className={cn(
              "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-2xl mb-7 group-hover:scale-110 transition-transform duration-500",
              item.color
            )}
          >
            <item.icon className="h-7 w-7 text-white" />
          </div>
          <h3 className={cn("text-xl font-bold mb-3 tracking-tight", isDark ? "text-white" : "text-slate-800")}>
            {item.title}
          </h3>
          <p className={cn("text-[15px] leading-relaxed font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
