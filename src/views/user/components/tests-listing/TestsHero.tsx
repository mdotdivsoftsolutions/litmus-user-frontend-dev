"use client";

import { Shield } from "lucide-react";
import { TestsHeroSearch } from "./TestsHeroSearch";

interface TestsHeroProps {
  search: string;
  setSearch: (val: string) => void;
  tests?: any[];
  onSearch?: () => void;
}

export const TestsHero = ({ search, setSearch, tests = [], onSearch }: TestsHeroProps) => {
  return (
    <div className="relative bg-white pt-20 md:pt-28 pb-8 md:pb-10 flex flex-col justify-center border-b border-slate-100/60">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50/50 skew-x-[-12deg] translate-x-1/4 pointer-events-none border-l border-slate-100" />
        <div className="absolute -top-[10%] -left-[5%] w-[600px] h-[600px] bg-red-50/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-50/40 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left space-y-6 py-8 lg:py-0 group">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-bold uppercase tracking-[0.2em] animate-fade-in">
              <Shield className="h-4 w-4" /> NABL Accredited · FSSAI Certified
            </div>

            <div className="space-y-4">
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.3] animate-slide-up">
                Smart Food Testing. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">
                  Trusted Results.
                </span>
              </h1>
              <p className="font-body text-slate-500 text-base font-normal leading-[1.5] max-w-xl mx-auto lg:mx-0">
                Book tests with certified laboratories, track your samples in real time, and access accurate reports all through one seamless digital platform.
              </p>
            </div>

            <TestsHeroSearch search={search} setSearch={setSearch} tests={tests} onSearch={onSearch} />

            <div className="flex items-center justify-center lg:justify-start gap-6 lg:gap-8 pt-2">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tighter">60+</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1">
                  Parameters
                </span>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tighter">₹800</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1">
                  Starts from
                </span>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-semibold text-emerald-500 tracking-tighter flex items-center gap-1.5">
                  Live <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse border border-emerald-100" />
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1 font-semibold">
                  Diagnostics
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full lg:w-auto">
            <div className="relative group/pano w-full max-w-[500px] h-[250px] sm:h-[300px] md:h-[350px] mx-auto lg:ml-auto lg:mr-0 rounded-[1.25rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.1)] border-[5px] border-white bg-slate-900 flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src="/video/video banner.mp4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
