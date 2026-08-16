"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Share2, Heart } from "lucide-react";

interface LabHeroHeaderProps {
  lab: any;
  rating: string;
}

export function LabHeroHeader({ lab, rating }: LabHeroHeaderProps) {
  return (
    <section className="relative pt-12 pb-12 bg-slate-50 border-b border-slate-100 overflow-hidden">
      <div className="absolute top-0 right-0 w-[45%] h-full bg-white skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10">
          <div className="h-28 w-28 rounded-[2rem] bg-white shadow-xl border border-slate-100 flex items-center justify-center font-bold text-2xl text-[#D32F2F] shrink-0 transform -rotate-3 transition-transform hover:rotate-0 duration-500 overflow-hidden">
            {lab.metadata?.images?.[0] ? (
              <img src={lab.metadata.images[0]} alt={lab.labName} className="w-full h-full object-cover" />
            ) : (
              lab.labName?.split(" ").map((w: string) => w[0]).slice(0, 2).join("")
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {lab.isTrusted && (
                <Badge className="bg-slate-900 border-0 text-[10px] uppercase font-semibold tracking-widest px-3 h-6">
                  Verified Facility
                </Badge>
              )}
              {lab.isNablAccredited && (
                <Badge className="bg-[#D32F2F] border-0 text-[10px] uppercase font-semibold tracking-widest px-3 h-6">
                  NABL Accredited
                </Badge>
              )}
              {lab.isFssaiApproved && (
                <Badge className="bg-blue-600 border-0 text-[10px] uppercase font-semibold tracking-widest px-3 h-6">
                  FSSAI Approved
                </Badge>
              )}
              <div className="flex items-center gap-1.5 px-3 h-6 rounded-full bg-white border border-slate-200">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span className="text-[10px] font-semibold text-slate-700">{rating} Rating</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-4xl font-semibold text-slate-800 tracking-tight leading-tight">
              {lab.labName}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#D32F2F]" />
                <span>{lab.location?.city || "India"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600 font-semibold tracking-tight">
                  {lab.activityStatus || "Operational Now"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-[#D32F2F] shadow-sm">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 shadow-sm">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
