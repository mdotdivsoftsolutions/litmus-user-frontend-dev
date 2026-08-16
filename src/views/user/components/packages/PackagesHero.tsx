"use client";

import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { PackagesHeroSearch } from "./PackagesHeroSearch";
import { PackagesHeroVideo } from "./PackagesHeroVideo";

interface PackagesHeroProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  search: string;
  setSearch: (val: string) => void;
  packages?: any[];
  onSearch?: () => void;
}

export function PackagesHero({
  categories,
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
  packages = [],
  onSearch,
}: PackagesHeroProps) {
  return (
    <div className="relative bg-white py-16 md:py-24 flex flex-col justify-center border-b border-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50/50 skew-x-[-12deg] translate-x-1/4 pointer-events-none border-l border-slate-100" />
        <div className="absolute -top-[10%] -left-[5%] w-[600px] h-[600px] bg-red-50/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-50/40 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left space-y-6 py-8 lg:py-0 group">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-brand-action text-[10px] font-bold uppercase tracking-[0.2em] animate-fade-in">
              <Shield className="h-4 w-4" /> Curated Diagnostic Bundles
            </div>

            <div className="space-y-4">
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.3] animate-slide-up">
                Recommended. <br />
                <span className="text-gradient-brand">Food Testing Packages</span>
              </h1>
              <p className="font-body text-slate-500 text-base font-normal leading-[1.5] max-w-xl mx-auto lg:mx-0">
                Simplify your testing journey with ready-to-book packages developed by food safety experts. Whether you&apos;re
                launching a new product, meeting regulatory requirements, or conducting routine quality checks, we&apos;ve got
                the right testing panel for you.
              </p>
            </div>

            <PackagesHeroSearch
              search={search}
              setSearch={setSearch}
              packages={packages}
              onSearch={onSearch}
            />

            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-sm border",
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white border-transparent"
                      : "bg-white text-slate-400 hover:text-slate-800 border-slate-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 lg:gap-8 pt-2">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tighter">150+</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1">
                  Parameters
                </span>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tighter">₹2400</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1">
                  Starts from
                </span>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-emerald-500 tracking-tighter flex items-center gap-1.5">
                  Live <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse border border-emerald-100" />
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1">
                  Diagnostics
                </span>
              </div>
            </div>
          </div>

          <PackagesHeroVideo />
        </div>
      </div>
    </div>
  );
}
