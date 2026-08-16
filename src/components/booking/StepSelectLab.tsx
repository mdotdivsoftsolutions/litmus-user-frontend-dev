"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabItem } from "@/types/lab.types";

interface StepSelectLabProps {
  labs: LabItem[];
  selectedLab: string | null;
  onSelectLab: (id: string) => void;
  calculateLabPricing: (lab: any) => number | null;
}

export function StepSelectLab({ labs, selectedLab, onSelectLab, calculateLabPricing }: StepSelectLabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-[1.3]">
          3. Choose Your Testing Laboratory
        </h2>
        <p className="font-body text-slate-500 text-sm mt-1 leading-[1.5]">
          Select Litmus AI Auto-Assign for fastest turnaround or choose a specific partner laboratory.
        </p>
      </div>

      <div className="space-y-4">
        {/* Option 1: Litmus Smart Auto-Assign */}
        <Card
          onClick={() => onSelectLab("admin")}
          className={cn(
            "cursor-pointer border-2 rounded-2xl transition-all bg-white shadow-sm hover:shadow-md",
            selectedLab === "admin"
              ? "border-brand-action ring-2 ring-brand-action/20"
              : "border-slate-100 hover:border-slate-200"
          )}
        >
          <CardContent className="p-5 flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-brand-action/10 text-brand-action flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-base text-slate-900">Litmus AI Auto-Assign</h3>
                  <Badge className="font-data-badge bg-emerald-100 text-emerald-800 text-[10px]">Recommended</Badge>
                </div>
                <p className="font-body text-xs text-slate-500">
                  Routes automatically to the fastest accredited NABL lab closest to your pickup address.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-data text-sm font-bold text-brand-action">Platform Best Price</span>
            </div>
          </CardContent>
        </Card>

        {/* Option 2: Individual Labs */}
        {labs.map((lab) => {
          const labPrice = calculateLabPricing(lab);
          const isSelected = selectedLab === lab._id;

          return (
            <Card
              key={lab._id}
              onClick={() => onSelectLab(lab._id)}
              className={cn(
                "cursor-pointer border-2 rounded-2xl transition-all bg-white shadow-sm hover:shadow-md",
                isSelected
                  ? "border-brand-action ring-2 ring-brand-action/20"
                  : "border-slate-100 hover:border-slate-200"
              )}
            >
              <CardContent className="p-5 flex items-start justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 text-brand-action flex items-center justify-center font-bold text-sm shrink-0">
                    {lab.labName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-base text-slate-900">{lab.labName}</h3>
                      {lab.isNablAccredited && (
                        <Badge className="font-data-badge bg-slate-900 text-white text-[10px]">NABL</Badge>
                      )}
                    </div>
                    <p className="font-body text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" /> {lab.city}
                    </p>
                  </div>
                </div>

                {labPrice && (
                  <div className="text-right">
                    <span className="font-data text-base font-bold text-slate-900">₹{labPrice.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
