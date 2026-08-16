"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

function ReviewCard({ r }: { r: any }) {
   return (
      <div className="w-[420px] shrink-0 bg-white p-8 rounded-[1.5rem] border border-slate-100 flex flex-col relative group hover:border-emerald-100 transition-all duration-500">
         <div className="flex items-center gap-1.5 mb-6 relative z-10">
            {[1, 2, 3, 4, 5].map(s => (
               <Star
                  key={s}
                  className={cn("h-4 w-4", s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")}
               />
            ))}
         </div>
         {/* Review text — Manrope (Body: 16px/14px, Regular, Line-height: 1.5) */}
         <p className="font-body text-sm sm:text-base text-slate-600 leading-[1.5] flex-1 relative z-10">&ldquo;{r.text}&rdquo;</p>

         <div className="mt-8 pt-5 border-t border-slate-100 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-body font-bold text-sm">
                  {r.name?.charAt(0) || "U"}
               </div>
               <div>
                  <p className="font-body text-sm font-bold text-slate-900 leading-[1.3]">{r.name}</p>
                  <p className="font-data-badge text-xs font-semibold text-brand-primary leading-[1.4]">{r.city}</p>
               </div>
            </div>
            {r.dateText && <span className="font-data-caption text-xs font-normal text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full leading-[1.4]">{r.dateText}</span>}
         </div>
      </div>
   );
}

export function CustomerReviews({ initialReviews }: { initialReviews?: any }) {
   const reviews = Array.isArray(initialReviews?.data) 
      ? initialReviews.data 
      : (Array.isArray(initialReviews) ? initialReviews : (initialReviews?.data?.data || []));

   // Duplicate for seamless infinite scroll
   const marqueeItems = [...reviews, ...reviews];

   return (
      <section className="py-8 md:py-12 relative overflow-hidden min-h-full flex flex-col justify-center">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

         <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
            <SectionHeader
               title={
                  <>
                     Customer <span className="text-gradient-brand">Reviews</span>
                  </>
               }
               subtitle="See why thousands of businesses trust Litmus for their uncompromising food safety testing."
            />
         </div>

         {/* Marquee — infinite horizontal scroll */}
         <div className="relative w-full overflow-hidden mt-8">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent" />

            <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused] px-4">
               {reviews.length > 0 ? (
                  marqueeItems.map((r, i) => (
                     <ReviewCard key={`review-${i}`} r={r} />
                  ))
               ) : (
                  <div className="w-full text-center py-12 text-slate-500">
                     No reviews available yet.
                  </div>
               )}
            </div>
         </div>
      </section>
   );
}
