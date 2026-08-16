"use client";

import { Star } from "lucide-react";
import excellenceImg from "@/assets/clinical-excellence.png";
import { cn } from "@/lib/utils";
import { WhyLitmusFeatureCards } from "./WhyLitmusFeatureCards";
import { WhyLitmusVisualColumn } from "./WhyLitmusVisualColumn";

interface WhyLitmusTestsProps {
  theme?: "light" | "dark";
}

export const WhyLitmusTests = ({ theme = "dark" }: WhyLitmusTestsProps) => {
  const isDark = theme === "dark";

  return (
    <section
      className={cn(
        "relative py-32 overflow-hidden transition-colors duration-1000",
        isDark ? "bg-[#0A0D14]" : "bg-white"
      )}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={typeof excellenceImg === "string" ? excellenceImg : (excellenceImg as any)?.src || ""}
          alt="Clinical Excellence"
          className={cn(
            "w-full h-full object-cover scale-110 blur-[2px] transition-opacity duration-1000",
            isDark ? "opacity-20 mix-blend-luminosity" : "opacity-5"
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b transition-colors duration-1000",
            isDark ? "from-[#0A0D14] via-[#0A0D14]/80 to-[#0A0D14]" : "from-white/50 via-white/80 to-white"
          )}
        />
        <div
          className={cn(
            "absolute top-1/4 -left-20 w-[500px] h-[500px] blur-[150px] rounded-full animate-pulse",
            isDark ? "bg-red-600/10" : "bg-red-500/5"
          )}
        />
        <div
          className={cn(
            "absolute bottom-1/4 -right-20 w-[500px] h-[500px] blur-[150px] rounded-full animate-pulse delay-700",
            isDark ? "bg-orange-600/10" : "bg-orange-500/5"
          )}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <div
                className={cn(
                  "inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-md",
                  isDark ? "bg-white/[0.03] border-white/10 text-red-500" : "bg-slate-50 border-slate-100 text-[#D32F2F]"
                )}
              >
                <Star className="h-3.5 w-3.5 fill-current" /> The Litmus Standard
              </div>
              <h2
                className={cn(
                  "text-4xl md:text-5xl xl:text-6xl font-black tracking-[-0.04em] leading-[1.05]",
                  isDark ? "text-white" : "text-slate-800"
                )}
              >
                Transparency, Compliance, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">
                  Clinical Precision.
                </span>
              </h2>
              <p className={cn("text-lg md:text-xl font-medium leading-relaxed max-w-2xl", isDark ? "text-slate-400" : "text-slate-500")}>
                At Litmus, we don&apos;t just test; we validate. Our ecosystem is built on the foundational pillars of scientific integrity and digital transparency.
              </p>
            </div>

            <WhyLitmusFeatureCards isDark={isDark} />

            <div className="flex flex-col sm:flex-row items-center gap-8 pt-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-12 w-12 rounded-full border-[3px] overflow-hidden relative ring-2 shadow-xl",
                      isDark ? "border-[#0A0D14] bg-slate-800 ring-white/5" : "border-white bg-slate-200 ring-slate-100"
                    )}
                  >
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    {i === 5 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F] to-[#F06C00] flex items-center justify-center text-[10px] font-black text-white">
                        5K+
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={cn("text-sm font-bold tracking-wide uppercase", isDark ? "text-slate-400" : "text-slate-500")}>
                Trusted by <span className={isDark ? "text-white" : "text-slate-800"}>5,000+</span> Food Producers across India.
              </div>
            </div>
          </div>

          <WhyLitmusVisualColumn isDark={isDark} />
        </div>
      </div>
    </section>
  );
};
