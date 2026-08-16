"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";

interface LabSidebarCardProps {
  lab: any;
}

export function LabSidebarCard({ lab }: LabSidebarCardProps) {
  return (
    <div className="space-y-8">
      <Card className="rounded-[2.5rem] border-2 border-slate-50 bg-white p-8 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#D32F2F]/5 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-[#D32F2F]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Lab Location</p>
              <p className="text-sm font-semibold text-slate-800">{lab.location?.city || "India"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Phone className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Direct Sample Support</p>
              <p className="text-sm font-semibold text-slate-800">{lab.contactPhone || "Not provided"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Administrative Email</p>
              <p className="text-sm font-semibold text-slate-800">{lab.contactEmail || `info@${lab.labName?.toLowerCase().replace(/\s+/g, "")}.ai`}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-50">
          <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-widest mb-6">Service Area &amp; Logistics</h4>
          <div className="space-y-4">
            {lab.serviceAreaLogistics?.length > 0 ? (
              lab.serviceAreaLogistics.map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-500">{typeof s === "string" ? s : s.method}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 italic">No logistics info available.</div>
            )}
          </div>
        </div>

        <Button className="w-full mt-10 h-14 bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-sm rounded-xl shadow-[0_24px_48px_rgba(211,47,47,0.3)] hover:shadow-[0_32px_64px_rgba(211,47,47,0.4)] transition-all flex items-center justify-center gap-3 group border-0">
          Select Laboratory <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Card>

      <div className="rounded-[2rem] bg-slate-900 p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <p className="text-[10px] font-semibold text-brand-primary uppercase tracking-[0.3em]">Institutional Verification</p>
        <p className="text-xs font-normal text-white leading-normal tracking-wide">
          Every diagnostic result from this facility is clinical-grade and legally valid for FSSAI audits.
        </p>
        <Link href="/support" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
          Learn about our standards <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
