"use client";

import { Activity, FileText, Award } from "lucide-react";

interface PackageDetailHeaderProps {
  pkg: any;
}

export function PackageDetailHeader({ pkg }: PackageDetailHeaderProps) {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D32F2F]/5 to-[#F06C00]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {pkg.category}
        </span>
        {pkg.tag && (
          <span className="bg-blue-50 text-brand-card-from text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
            {pkg.tag}
          </span>
        )}
      </div>

      <h1 className="text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight leading-tight">
        {pkg.name}
      </h1>

      <p className="text-slate-500 mt-1 text-sm font-medium leading-relaxed max-w-3xl">
        {pkg.description}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Activity className="h-5 w-5 text-brand-action" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Parameters</p>
            <p className="text-sm font-black text-slate-800 mt-1">{pkg.testCount}+ Items</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-brand-card-from" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Reports TAT</p>
            <p className="text-sm font-black text-slate-800 mt-1">{pkg.tat}</p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Award className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Accreditation</p>
            <p className="text-sm font-black text-slate-800 mt-1">NABL / FSSAI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
