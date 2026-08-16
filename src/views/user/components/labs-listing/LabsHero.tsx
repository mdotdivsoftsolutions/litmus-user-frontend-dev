"use client";

import { Microscope } from "lucide-react";
import { LabsHeroSearch } from "./LabsHeroSearch";

interface LabsHeroProps {
  search: string;
  setSearch: (val: string) => void;
  selectedCity: string;
  setSelectedCity: (val: string) => void;
  labs?: any[];
  onSearch?: () => void;
}

export function LabsHero({
  search,
  setSearch,
  selectedCity,
  setSelectedCity,
  labs = [],
  onSearch,
}: LabsHeroProps) {
  return (
    <section className="relative z-20 pt-20 md:pt-28 pb-8 md:pb-10 bg-white border-b border-slate-100/60">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[55%] h-full bg-slate-50 skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-12">
        <div className="space-y-6 animate-slide-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-bold uppercase tracking-[0.2em]">
            <Microscope className="h-4 w-4" /> Accredited Facilities
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.3]">
            Discover our Trusted <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">
              Laboratory Partners
            </span>
          </h1>
          <p className="font-body text-slate-500 text-base font-normal max-w-xl leading-[1.5]">
            Discover our network of trusted laboratory partners certified to national and international standards,
            including NABL, FSSAI, ISO/IEC 17025, BIS, APEDA, EIC, and other industry-specific accreditations.
          </p>

          <LabsHeroSearch
            search={search}
            setSearch={setSearch}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            labs={labs}
            onSearch={onSearch}
          />
        </div>

        <div className="hidden lg:flex lg:justify-center relative">
          <div className="aspect-square w-[380px] md:h-[280px] rounded-[1rem] bg-gradient-to-br from-slate-100 to-white border border-slate-200 shadow-2xl relative overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400"
              alt="Modern Lab"
              className="w-full h-full object-cover opacity-60 mix-blend-multiply group-hover:scale-110 transition-transform duration-[8000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 space-y-2">
              <p className="text-[9px] font-black text-[#D32F2F] uppercase tracking-[0.2em]">Institutional Standard</p>
              <p className="text-[11px] font-medium text-slate-800 leading-tight">
                All listed facilities undergo strict FSSAI & NABL compliance verification.
              </p>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-red-100 blur-[60px] rounded-full -z-10" />
          <div className="absolute -bottom-12 -left-12 h-36 w-36 bg-orange-100 blur-[80px] rounded-full -z-10" />
        </div>
      </div>
    </section>
  );
}
