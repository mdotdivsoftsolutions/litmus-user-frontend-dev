"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Quote, CheckCircle2 } from "lucide-react";

interface LabReviewsTabProps {
  lab: any;
  rating: string;
  ratingDistribution: number[];
}

export function LabReviewsTab({ lab, rating, ratingDistribution }: LabReviewsTabProps) {
  return (
    <div className="mt-0 animate-slide-up space-y-12">
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="text-3xl lg:text-2xl font-semibold text-slate-800 tracking-tight leading-tight">
            Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Reviews.</span>
          </h2>
          <div className="flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Top Rated Safety Partner</span>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-stretch">
          <div className="md:col-span-4 relative rounded-[2.5rem] bg-slate-900 p-8 flex flex-col items-center justify-center text-center overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D32F2F]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
              <p className="text-6xl font-bold text-white tracking-tighter">{rating}</p>
              <div className="flex items-center justify-center gap-1.5">
                {[...Array(Math.round(Number(rating) || 5))].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#feba50] text-[#feba50]" />
                ))}
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{lab.reviews?.length || 0} Verified Audits</p>
            </div>
          </div>

          <div className="md:col-span-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 p-10 flex flex-col justify-center space-y-4 shadow-sm">
            {ratingDistribution.map((p, i) => (
              <div key={i} className="flex items-center gap-6 group/bar">
                <span className="text-[10px] font-bold text-slate-400 min-w-[50px] uppercase tracking-widest">{5 - i} Stars</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-slate-400 to-slate-600 rounded-full group-hover/bar:from-[#D32F2F] group-hover/bar:to-[#feba50] transition-all duration-500"
                    style={{ width: `${p}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500 min-w-[30px] text-right">{p}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 pb-4">
          {lab.reviews?.length > 0 ? (
            lab.reviews.map((rev: any, i: number) => (
              <Card key={i} className="group relative border border-slate-100 rounded-[2rem] shadow-sm hover:border-[#D32F2F]/20 hover:shadow-xl transition-all duration-500 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <Quote className="h-20 w-20 text-[#D32F2F]" />
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:border-[#D32F2F]/20 group-hover:bg-slate-100 transition-all overflow-hidden">
                        {rev.userImage ? (
                          <img src={rev.userImage} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={rev.reviewerName} />
                        ) : (
                          <span className="text-xl font-bold text-slate-400">{rev.reviewerName?.[0]}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 tracking-tight">{rev.reviewerName}</p>
                          {rev.isLitmusVerified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 border-b border-slate-100 inline-block uppercase tracking-widest">{rev.role || "Client"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating || 5)].map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-[#feba50] text-[#feba50]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed relative z-10 italic">
                    &quot;{rev.comment}&quot;
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
                    {rev.isLitmusVerified ? (
                      <Badge className="bg-slate-50 border-0 text-[10px] font-bold text-slate-400 px-3 uppercase tracking-widest">Litmus Verified</Badge>
                    ) : (
                      <div />
                    )}
                    <p className="text-[10px] text-slate-300 font-bold">{new Date(rev.date).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 border rounded-xl border-dashed">No reviews yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
