"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield as ShieldIcon, MapPin as MapPinIcon, Clock as ClockIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingStep2LabSelectionProps {
  selectedLab: string | null;
  setSelectedLab: (labId: string | null) => void;
  isLabsLoading: boolean;
  eligibleLabs: any[];
  getLabPrice: (lab: any) => number;
}

export function BookingStep2LabSelection({
  selectedLab,
  setSelectedLab,
  isLabsLoading,
  eligibleLabs,
  getLabPrice,
}: BookingStep2LabSelectionProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Choose Fulfilment Partner</h1>
        <p className="text-slate-500 text-sm font-medium">Select an accredited laboratory or let Litmus experts decide.</p>
      </div>

      <div className="grid gap-4">
        <Card
          onClick={() => setSelectedLab("admin")}
          className={cn(
            "cursor-pointer transition-all border rounded-lg relative overflow-hidden group shadow-sm",
            selectedLab === "admin"
              ? "border-brand-action bg-brand-action/5 ring-1 ring-primary/20"
              : "border-slate-200 hover:border-brand-action/40 hover:bg-slate-50"
          )}
        >
          <div className="absolute top-0 right-0 bg-brand-action text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">
            Recommended
          </div>
          <CardContent className="p-6 flex items-start gap-6">
            <div
              className={cn(
                "h-14 w-14 rounded-lg flex items-center justify-center shrink-0",
                selectedLab === "admin" ? "bg-brand-action text-white" : "bg-slate-100 text-brand-action"
              )}
            >
              <ShieldIcon className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-slate-900">Litmus Smart Allocation</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Our senior analysts will route samples to the most optimal labs based on current TAT and specialization.
              </p>
            </div>
          </CardContent>
        </Card>

        {isLabsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-brand-action" />
          </div>
        ) : eligibleLabs.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-slate-600 font-medium">No single laboratory supports all your selected tests.</p>
            <p className="text-sm text-slate-500 mt-1">
              Please select &quot;Litmus Smart Allocation&quot; and our team will route your samples to the optimal combination of labs.
            </p>
          </div>
        ) : (
          eligibleLabs.map((lab: any) => (
            <Card
              key={lab._id}
              onClick={() => setSelectedLab(lab._id)}
              className={cn(
                "cursor-pointer transition-all rounded-lg border group shadow-sm",
                selectedLab === lab._id ? "border-brand-action bg-brand-action/5" : "border-slate-200 hover:border-slate-300 hover:bg-white"
              )}
            >
              <CardContent className="p-5 flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center">
                <div className="flex gap-4 items-center">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-lg flex items-center justify-center text-lg font-bold uppercase",
                      selectedLab === lab._id ? "bg-brand-action text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    )}
                  >
                    {lab.labName.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-action transition-colors">
                      {lab.labName}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" /> {lab.location?.city || "India"}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" /> {lab.availability?.turnaroundTime || "24-48 hrs"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Base Fee</p>
                  <p className="font-bold text-slate-900 text-xl">₹{getLabPrice(lab).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
