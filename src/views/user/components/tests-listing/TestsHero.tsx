"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield } from "lucide-react";
import { TestsHeroSearch } from "./TestsHeroSearch";
import banner1 from "@/assets/banner-hero-1.jpg";
import banner2 from "@/assets/banner-hero-2.jpg";
import banner3 from "@/assets/banner-hero-3.jpg";

const carouselImages = [
  { src: typeof banner1 === "string" ? banner1 : (banner1 as any).src, alt: "NABL Accredited Lab Testing" },
  { src: typeof banner2 === "string" ? banner2 : (banner2 as any).src, alt: "Food Safety Testing" },
  { src: typeof banner3 === "string" ? banner3 : (banner3 as any).src, alt: "Certified Lab Results" },
];

interface TestsHeroProps {
  search: string;
  setSearch: (val: string) => void;
  tests?: any[];
  onSearch?: () => void;
}

export const TestsHero = ({ search, setSearch, tests = [], onSearch }: TestsHeroProps) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % carouselImages.length);
  }, []);

  // Auto-advance every 3 seconds
  useEffect(() => {
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative bg-white pt-20 md:pt-28 pb-8 md:pb-10 flex flex-col justify-center border-b border-slate-100/60">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50/50 skew-x-[-12deg] translate-x-1/4 pointer-events-none border-l border-slate-100" />
        <div className="absolute -top-[10%] -left-[5%] w-[600px] h-[600px] bg-red-50/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-50/40 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text Content */}
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
                  Testing Labs
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Horizontal Dot Carousel */}
          <div className="flex-1 relative w-full lg:w-auto">
            <div className="relative w-full max-w-[500px] mx-auto lg:ml-auto lg:mr-0">
              {/* Image frame */}
              <div className="relative h-[250px] sm:h-[300px] md:h-[350px] rounded-[1.25rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.1)] border-[5px] border-white bg-slate-100">
                {/* Slides */}
                <div
                  className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {carouselImages.map((img, i) => (
                    <img
                      key={i}
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover shrink-0"
                      style={{ minWidth: "100%" }}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  ))}
                </div>

                {/* Subtle gradient overlay at bottom for dots visibility */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none rounded-b-[1.1rem]" />

                {/* Dot navigation */}
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                  {carouselImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`transition-all duration-300 rounded-full ${
                        i === current
                          ? "w-6 h-2 bg-white"
                          : "w-2 h-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

