"use client";

import { Microscope } from "lucide-react";

interface LabFacilityTabProps {
  lab: any;
}

export function LabFacilityTab({ lab }: LabFacilityTabProps) {
  return (
    <div className="mt-0 animate-slide-up space-y-12">
      <div className="space-y-8">
        <h2 className="text-3xl lg:text-2xl font-semibold text-slate-800 tracking-tight leading-tight">
          Infrastructure <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">&amp; Logistics.</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {lab.infrastructure?.length > 0 ? (
            lab.infrastructure.map((item: any, i: number) => (
              <div key={i} className="group p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#D32F2F] group-hover:scale-110 transition-transform">
                  <Microscope className="h-6 w-6" />
                </div>
                <div className="mt-6 space-y-2">
                  <p className="font-semibold text-slate-800 tracking-tight">{item.title}</p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 border rounded-xl border-dashed">
              No infrastructure details available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
