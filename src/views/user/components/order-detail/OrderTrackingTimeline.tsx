"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const timelineSteps = ["Booked", "Payment", "Approved", "Lab Testing", "Report Ready"];

interface OrderTrackingTimelineProps {
  currentStep: number;
}

export function OrderTrackingTimeline({ currentStep }: OrderTrackingTimelineProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="relative">
        <div className="absolute top-4 left-0 w-full h-1 bg-muted rounded-full" />
        <div
          className="absolute top-4 left-0 h-1 bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / (timelineSteps.length - 1)) * 100}%` }}
        />

        <div className="flex items-start justify-between relative z-10">
          {timelineSteps.map((step, i) => {
            const isCompleted = i <= currentStep;
            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm border-2",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-card border-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs mt-2 text-center font-semibold max-w-[80px]",
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
