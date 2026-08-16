"use client";

import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star, MapPin, ArrowRight, Activity } from "lucide-react";
import { laboratories } from "@/lib/placeholder-data";
import { SectionHeader } from "../home/SectionHeader";

interface LabItem {
  id: string;
  name: string;
  city: string;
  nabl: boolean;
  fssai: boolean;
  rating: number;
  reviewCount?: number;
  priceFrom: number;
  testsCount: number;
  expertiseArea?: string[];
  [key: string]: any; // Allow other properties
}

interface LabsGridProps {
  filtered: LabItem[];
  visibleCount: number;
  setVisibleCount?: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isFetchingNextPage?: boolean;
}

export function LabsGrid({ filtered, visibleCount, setVisibleCount, isLoading, hasMore, onLoadMore, isFetchingNextPage }: LabsGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <SectionHeader
        title={
          <>
            Accredited{" "}
            <span className="text-gradient-brand">
              Laboratories
            </span>
          </>
        }
        subtitle="Clinically certified labs with verified NABL & FSSAI accreditations across India."
        className="mb-8"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card suppressHydrationWarning key={`skeleton-${i}`} data-aos="fade-up" data-aos-delay={(i % 4) * 100} className="border-1 border-slate-50 shadow-sm rounded-[1rem] overflow-hidden bg-white">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 border-y border-slate-50 py-3">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-10" />
                    <div className="flex gap-1"><Skeleton className="h-4 w-8" /><Skeleton className="h-4 w-8" /></div>
                  </div>
                  <div className="space-y-2 border-l border-slate-50 pl-3">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <div className="space-y-2 border-l border-slate-50 pl-3">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-1.5 w-1.5 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-8 w-28 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filtered.map((lab, i) => (
          <Link suppressHydrationWarning key={lab.id} href={`/labs/${lab.id}`} data-aos="fade-up" data-aos-delay={(i % 10) * 50} className="block group decoration-transparent">
            <Card className="h-full border border-slate-100 shadow-sm hover:border-[#D32F2F]/20 hover:shadow-xl transition-all duration-300 rounded-[1rem] overflow-hidden bg-white">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-red-50/70 border border-red-100/60 text-[#D32F2F] flex items-center justify-center font-bold text-sm shrink-0 shadow-sm transition-transform group-hover:-rotate-6">
                      {lab.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-heading text-lg font-bold text-slate-900 tracking-tight leading-[1.3] group-hover:text-[#D32F2F] transition-colors">{lab.name}</h3>
                      <p className="font-data text-xs font-semibold text-slate-400 flex items-center gap-1 uppercase tracking-wider"><MapPin className="h-3 w-3 text-[#D32F2F]" />{lab.city}, India</p>
                    </div>
                  </div>
                     <div className="flex flex-col items-end gap-1">
                     <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                        <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                        <span className="font-data text-xs font-bold text-amber-700">{lab.rating?.toFixed(1) || '0.0'}</span>
                     </div>
                     <p className="font-data text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{lab.reviewCount || 0} Reviews</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-y border-slate-50 py-3">
                  <div className="space-y-1">
                     <p className="font-data text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Status</p>
                     <div className="flex flex-wrap gap-1 mt-1">
                        {lab.nabl && <Badge className="font-data-badge bg-slate-900 text-white border-0 text-[10px] px-1.5 py-0 h-4 tracking-tight">NABL</Badge>}
                        {lab.fssai && <Badge className="font-data-badge bg-[#D32F2F] text-white border-0 text-[10px] px-1.5 py-0 h-4 tracking-tight">FSSAI</Badge>}
                     </div>
                  </div>
                   <div className="space-y-1 border-l border-slate-50 pl-3">
                      <p className="font-data text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Starting</p>
                      <p className="font-data text-sm font-bold text-slate-900 mt-1">₹{lab.priceFrom}</p>
                   </div>
                   <div className="space-y-1 border-l border-slate-50 pl-3">
                     <p className="font-data text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Expertise</p>
                     <div className="flex items-center gap-1 mt-1">
                        <Activity className="h-3 w-3 text-brand-action" />
                        <span className="font-body text-xs font-medium text-slate-700">
                          {lab.expertiseArea?.length > 0 ? (
                            <>
                              {lab.expertiseArea[0]} 
                              {lab.expertiseArea.length > 1 && <span className="text-slate-400"> +{lab.expertiseArea.length - 1}</span>}
                            </>
                          ) : "General"}
                        </span>
                     </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-action animate-pulse" />
                      <span className="font-data text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Now</span>
                   </div>
                   <div className="flex items-center justify-center h-8 px-3 rounded-lg group-hover:bg-red-50 text-slate-600 group-hover:text-[#D32F2F] font-body font-semibold text-xs transition-all gap-1.5">
                     Explore Laboratory <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {hasMore && (
         <div className="mt-12 flex justify-center">
            <Button 
              onClick={onLoadMore}
              disabled={isFetchingNextPage}
              variant="outline" 
              className="h-11 px-8 rounded-xl border-slate-200 text-slate-700 hover:text-white hover:bg-gradient-to-r hover:from-[#D32F2F] hover:to-[#F06C00] hover:border-transparent font-body font-semibold text-sm transition-all flex items-center gap-2 bg-white shadow-sm hover:shadow-md active:scale-95"
            >
              {isFetchingNextPage ? "Loading..." : "Load More"} <ArrowRight className="h-4 w-4" />
            </Button>
         </div>
      )}

      {!isLoading && filtered.length === 0 && (
         <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-fade-in">
            <div className="h-24 w-24 rounded-[3rem] bg-slate-100 flex items-center justify-center opacity-40">
               <Search className="h-10 w-10 text-slate-400" />
            </div>
            <div className="text-center space-y-2">
               <p className="text-xl font-semibold text-slate-800">No laboratories found</p>
               <p className="text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
            </div>
         </div>
      )}
    </div>
  );
}
