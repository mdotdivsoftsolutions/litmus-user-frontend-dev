"use client";

import { Shield, Award } from "lucide-react";

interface LabOverviewTabProps {
  lab: any;
}

export function LabOverviewTab({ lab }: LabOverviewTabProps) {
  return (
    <div className="mt-0 animate-slide-up space-y-10">
      <div className="space-y-6 text-area-professional">
        <h2 className="text-3xl lg:text-2xl font-semibold text-slate-800 tracking-tight leading-tight">
          Diagnostic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Excellence.</span>
        </h2>
        <p className="text-slate-500 font-medium leading-relaxed text-lg">
          {lab.overview ||
            `${lab.labName} stands as a cornerstone of diagnostic excellence in ${lab.location?.city || "India"}. With a legacy of precision testing, we provide critical nutritional and safety analytics to enterprise food brands and producers.`}
        </p>
        <div className="grid sm:grid-cols-3 gap-6 pt-6">
          {[
            { label: "Tests Conducted", val: lab.testsConducted !== undefined ? `${lab.testsConducted}+` : "0+" },
            { label: "Accuracy Rate", val: lab.accuracyRate ? `${lab.accuracyRate}%` : "99.9%" },
            { label: "Employees", val: lab.employeeCount !== undefined ? `${lab.employeeCount}+` : "0+" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 tracking-tighter">{stat.val}</p>
            </div>
          ))}
        </div>
      </div>

      {(lab.isFssaiApproved || lab.isNablAccredited) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {lab.isFssaiApproved && (
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 flex items-start gap-5 hover:border-[#D32F2F]/20 transition-all shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-[#D32F2F]/5 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-[#D32F2F]" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-slate-800 tracking-tight">FSSAI Protocol Compliance</p>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Our clinical workflows are strictly mapped to FSSAI 2024 revised testing standards.
                </p>
              </div>
            </div>
          )}
          {lab.isNablAccredited && (
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 flex items-start gap-5 hover:border-blue-200 transition-all shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <Award className="h-6 w-6 text-blue-500" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-slate-800 tracking-tight">ISO 17025 Accreditation</p>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Globally recognized quality management systems ensuring result legal validity.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
