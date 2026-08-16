"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const timelineSteps = ["Booked", "Payment", "Approved", "Lab Testing", "Report Ready"];

interface OrderTrackingTimelineProps {
  currentStep: number;
}

export function OrderTrackingTimeline({ currentStep }: OrderTrackingTimelineProps) {
  const lastIndex = timelineSteps.length - 1;

  return (
    <div className="bg-card rounded-xl p-5 sm:p-6 border border-border shadow-sm overflow-hidden">
      <div className="relative">
        <div className="absolute left-4 right-4 top-[16px] h-1 bg-muted rounded-full" />
        <div
          className="absolute left-4 top-[16px] h-1 bg-primary rounded-full transition-all duration-500"
          style={{
            width: `calc((100% - 2rem) * ${Math.max(0, Math.min(currentStep, lastIndex)) / lastIndex})`,
          }}
        />

        <div className="relative z-10 flex items-start justify-between">
          {timelineSteps.map((step, i) => {
            const isCompleted = i <= currentStep;
            return (
              <div key={step} className="flex w-16 sm:w-24 flex-col items-center">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm border-2 shrink-0",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-card border-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs mt-2 text-center font-semibold leading-tight",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
