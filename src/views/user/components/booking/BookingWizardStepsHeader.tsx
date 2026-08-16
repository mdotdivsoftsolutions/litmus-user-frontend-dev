"use client";

import { cn } from "@/lib/utils";
import {
  ClipboardList as ClipboardListIcon,
  Building2 as BuildingIcon,
  CreditCard as CreditCardIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  ListChecks as ListChecksIcon,
  CheckCircle2 as CheckCircle2Icon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

export const wizardSteps = [
  { icon: ClipboardListIcon, label: "Review Tests" },
  { icon: ListChecksIcon, label: "Samples & scope" },
  { icon: BuildingIcon, label: "Select Lab" },
  { icon: HomeIcon, label: "Collection" },
  { icon: CreditCardIcon, label: "Payment" },
  { icon: CheckCircleIcon, label: "Status" },
];

interface BookingWizardStepsHeaderProps {
  step: number;
}

export function BookingWizardStepsHeader({ step }: BookingWizardStepsHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-start justify-start pt-2 pb-3 sm:pt-3 sm:pb-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 sm:gap-4 min-w-max">
          {wizardSteps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
                  i === step
                    ? "bg-brand-action/5 text-brand-action"
                    : i < step
                      ? "text-litmus-teal"
                      : "text-slate-400"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold transition-all",
                    i === step
                      ? "bg-brand-action text-white"
                      : i < step
                        ? "bg-litmus-teal text-white"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                  )}
                >
                  {i < step ? <CheckCircle2Icon className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs sm:text-sm font-semibold whitespace-nowrap",
                    i === step ? "text-slate-900" : "text-slate-500"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < wizardSteps.length - 1 && (
                <div className="mx-1 sm:mx-2">
                  <ChevronRightIcon
                    className={cn("h-3 w-3", i < step ? "text-litmus-teal" : "text-slate-300")}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
