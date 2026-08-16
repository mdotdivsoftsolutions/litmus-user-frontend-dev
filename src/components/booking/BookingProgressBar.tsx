"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingProgressBarProps {
  currentStep: number;
  steps: string[];
}

export function BookingProgressBar({ currentStep, steps }: BookingProgressBarProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4 relative">
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 -z-0" />
        
        {steps.map((label, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div key={label} className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300",
                  isDone
                    ? "bg-brand-action text-white shadow-sm"
                    : isCurrent
                    ? "bg-brand-action text-white ring-4 ring-brand-action/20 shadow-md"
                    : "bg-white border-2 border-slate-200 text-slate-400"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-wider hidden sm:block",
                  isCurrent ? "text-brand-action font-bold" : "text-slate-400"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
