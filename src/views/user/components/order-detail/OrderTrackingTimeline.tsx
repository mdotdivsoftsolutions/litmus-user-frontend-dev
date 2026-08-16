"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const timelineSteps = ["Booked", "Payment", "Approved", "Lab Testing", "Report Ready"];

interface OrderTrackingTimelineProps {
  currentStep: number;
}

export function OrderTrackingTimeline({ currentStep }: OrderTrackingTimelineProps) {
  const lastIndex = timelineSteps.length - 1;
  const clampedStep = Math.max(0, Math.min(currentStep, lastIndex));

  return (
    <div className="w-full">
      <div className="flex items-start">
        {timelineSteps.map((label, i) => {
          const isDone = i < clampedStep;
          const isCurrent = i === clampedStep;
          const isReached = isDone || isCurrent;
          const isLast = i === lastIndex;

          return (
            <div key={label} className={cn("flex items-start min-w-0", !isLast && "flex-1")}>
              <div className="flex flex-col items-center w-[4.25rem] sm:w-[5.5rem] shrink-0">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 border-2",
                    isReached
                      ? "bg-brand-action border-brand-action text-white"
                      : "bg-white border-slate-200 text-slate-400"
                  )}
                >
                  {isReached ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : i + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 text-[10px] sm:text-xs font-semibold text-center leading-tight",
                    isCurrent ? "text-slate-900" : isDone ? "text-slate-600" : "text-slate-400"
                  )}
                >
                  {label}
                </span>
              </div>

              {!isLast && (
                <div className="flex-1 h-[2px] mt-[15px] mx-1 sm:mx-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-brand-action transition-all duration-300"
                    style={{ width: isDone ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
