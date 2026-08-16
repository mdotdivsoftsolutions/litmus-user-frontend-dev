"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, ShoppingCart } from "lucide-react";

interface LabTestsTabProps {
  lab: any;
}

export function LabTestsTab({ lab }: LabTestsTabProps) {
  return (
    <div className="space-y-6 mt-0 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <h2 className="text-3xl lg:text-2xl font-semibold text-slate-800 tracking-tight leading-tight">
          Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Panels &amp; Pricing.</span>
        </h2>
        <Badge variant="outline" className="rounded-xl px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#D32F2F] border-[#D32F2F]/20 h-10 flex items-center justify-center">
          {lab.tests?.length || 0} Items Listed
        </Badge>
      </div>

      <div className="grid gap-4">
        {lab.tests?.length === 0 ? (
          <div className="text-center py-10 border rounded-xl border-dashed">No tests available</div>
        ) : (
          lab.tests?.map((test: any) => (
            <div
              key={test._id}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl bg-white border border-slate-100 hover:border-[#D32F2F]/20 hover:shadow-[0_24px_48px_rgba(0,0,0,0.03)] transition-all duration-300"
            >
              <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-[#D32F2F]/5 group-hover:border-[#D32F2F]/10 transition-colors">
                <Activity className="h-6 w-6 text-slate-400 group-hover:text-[#D32F2F] transition-colors" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="font-semibold text-slate-800 text-lg tracking-tight group-hover:text-[#D32F2F] transition-colors">
                  {test.testName || test.name}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Method: {test.method || "Standard"}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    TAT: {test.turnAroundTime || test.turnaroundTime || "3-5"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-800 tracking-tighter">
                    ₹{(() => {
                      const p = lab.pricing?.[test._id] || lab.pricing?.[test.id];
                      if (typeof p === "object" && p !== null) {
                        return Object.values(p).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
                      }
                      return p || test.offerPrice || test.price || "N/A";
                    })()}
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-[#D32F2F] to-[#feba50] hover:shadow-[0_12px_24px_rgba(211,47,47,0.25)] text-white font-semibold text-xs rounded-xl h-11 px-8 flex items-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95 border-0">
                  <ShoppingCart className="h-4 w-4" /> Book Now
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
