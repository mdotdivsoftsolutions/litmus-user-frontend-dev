"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingProgressBarProps {
  currentStep: number;
  steps: string[];
}

export function BookingProgressBar({ currentStep, steps }: BookingProgressBarProps) {
  return (
    <div className="w-full">
      <div className="relative max-w-3xl mx-auto px-2 sm:px-4">
        <div className="absolute left-8 right-8 top-[18px] h-0.5 bg-slate-200" />
        <div
          className="absolute left-8 top-[18px] h-0.5 bg-brand-action transition-all duration-300"
          style={{
            width:
              steps.length > 1
                ? `calc((100% - 4rem) * ${currentStep / (steps.length - 1)})`
                : "0%",
          }}
        />

        <div className="relative z-10 flex items-start justify-between">
          {steps.map((label, idx) => {
            const isDone = currentStep > idx;
            const isCurrent = currentStep === idx;

            return (
              <div key={label} className="flex w-16 sm:w-24 flex-col items-center gap-2">
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shrink-0",
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
                    "text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-center leading-tight",
                    isCurrent ? "text-brand-action" : isDone ? "text-slate-600" : "text-slate-400"
                  )}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
