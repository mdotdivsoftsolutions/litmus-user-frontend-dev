"use client";

import { Clock, Plus, ArrowRight, Search } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CategoryStrip } from "./CategoryStrip";
import { SectionHeader } from "../home/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedTest {
  id: string;
  name: string;
  method?: string;
  price: number;
  mrp: number;
  tat: string;
  type?: string;
  tests: number;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  slug?: string;
}

interface MostBookedTestsProps {
  tests: FeaturedTest[];
  discountPct: (price: number, mrp: number) => number;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: Category[];
  iconMap: Record<string, React.ElementType>;
  cn: (...args: (string | undefined | false | null)[]) => string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isFetchingNextPage?: boolean;
}

export const MostBookedTests = ({
  tests,
  discountPct,
  selectedCategory,
  setSelectedCategory,
  categories,
  iconMap,
  cn,
  isLoading,
  hasMore,
  onLoadMore,
  isFetchingNextPage
}: MostBookedTestsProps) => {

  return (
    <div className="bg-slate-50 pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-6 md:space-y-12">
        <SectionHeader
          title={
            <>
              Most Booked{" "}
              <span className="text-gradient-brand">
                Diagnostics
              </span>
            </>
          }
          subtitle="Clinically verified specialized tests across major industry verticals."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={(i % 6) * 100} className="bg-white rounded-[1rem] p-6 shadow-sm border-2 border-slate-50 flex items-center gap-6 relative overflow-hidden">
                <div className="flex-1 min-w-0 space-y-3 relative z-10">
                  <div className="h-5 md:h-6 w-3/4 bg-slate-200 rounded-md animate-pulse" />
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-28 bg-red-50 rounded-full animate-pulse border border-red-50" />
                    <div className="h-4 w-24 bg-slate-100 rounded-md animate-pulse" />
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-1.5 relative z-10">
                  <div className="h-3 w-12 bg-slate-100 rounded-md animate-pulse" />
                  <div className="h-7 w-20 bg-slate-200 rounded-md animate-pulse" />
                  <div className="h-4 w-16 bg-emerald-50 rounded-md animate-pulse" />
                </div>
                <div className="hidden sm:block shrink-0 h-12 w-12 rounded-2xl bg-slate-100 animate-pulse relative z-10" />
              </div>
            ))
          ) : (
            <>
              {tests.length > 0 ? tests.map((t, i) => (
                <Link to={`/tests/${t.id}`} key={t.id} data-aos="fade-up" data-aos-delay={(i % 10) * 50} className="group bg-white rounded-[1rem] p-6 shadow-sm border-2 border-slate-50 flex items-center gap-6 hover:border-brand-action/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500">
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="text-[17px] font-bold text-slate-800 tracking-tight leading-snug group-hover:text-brand-action transition-colors">{t.name}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-brand-primary/20">{t.tests} specialized tests</span>
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wide"><Clock className="h-4 w-4 text-brand-action" />Reports in {t.tat}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-baseline justify-end gap-2 text-slate-400 line-through text-xs font-medium">₹{t.mrp?.toLocaleString()}</div>
                    <div className="font-black text-slate-800 text-2xl tracking-tighter">₹{t.price?.toLocaleString()}</div>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md mt-1 inline-block uppercase tracking-widest border border-emerald-100">{discountPct(t.price, t.mrp)}% Off</span>
                  </div>
                </Link>
              )) : (
                <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50 min-h-[300px]">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No diagnostics found</h3>
                  <p className="text-slate-500 max-w-sm">We couldn't find any tests matching your current search or category filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-6 border-slate-200 text-slate-600 hover:text-slate-900"
                    onClick={() => {
                      setSelectedCategory('All');
                      window.location.href = '/tests';
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
              {hasMore && (
                <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
                  <Button
                    onClick={onLoadMore}
                    disabled={isFetchingNextPage}
                    className="bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-bold px-8 h-12 rounded-xl transition-all shadow-sm"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More Tests"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
