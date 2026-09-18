"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const trustCarouselSlides = [
  {
    heading: "Why Litmus?",
    subheading: "Controlled Sample Collection",
    highlightLine1: "100% on time",
    highlightLine2: "sample collection",
    body: "From collection to analysis, every sample is monitored under controlled temperature conditions to maintain quality, traceability, and testing accuracy",
    packagesEyebrow: "Curated bundles",
    packagesCaption: "NABL-aligned food safety panels tailored to manufacturers, retailers, and cloud kitchens.",
  },
  {
    heading: "Why Litmus?",
    subheading: "Seamless Process",
    highlightLine1: "Accredited labs",
    highlightLine2: "Pan-India coverage",
    body: "From sample collection to final report, every step is standardized, traceable, and managed through certified laboratories for complete compliance confidence.",
    packagesEyebrow: "Structured programmes",
    packagesCaption: "Choose from compliance packs covering microbiology, adulteration, label validation, and shelf-life studies.",
  },
  {
    heading: "Why Litmus?",
    subheading: "Digital Transparency",
    highlightLine1: "Compliance-ready",
    highlightLine2: "reports & tracking",
    body: "Track every stage of your testing journey with real-time updates, clear turnaround timelines, and instantly accessible digital reports.",
    packagesEyebrow: "Operational clarity",
    packagesCaption: "Compare bundles by parameters and turnaround, then route straight into booking.",
  },
];

export function TrustCarouselCard() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const n = trustCarouselSlides.length;

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % n), 5000);
    return () => clearInterval(timer);
  }, [n]);

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % n);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + n) % n);
  };

  const slide = trustCarouselSlides[currentSlide];

  return (
    <div className="lg:col-span-6 rounded-[2.5rem] relative min-h-[400px] md:min-h-[460px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.12)] bg-[#0d3028] group">
      <div className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full bg-[#feba50]/35 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.04]" />

      <button
        type="button"
        aria-label="Previous slide"
        onClick={goPrev}
        className="absolute left-3 md:left-5 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white opacity-70 group-hover:opacity-100"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={goNext}
        className="absolute right-3 md:right-5 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white opacity-70 group-hover:opacity-100"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.75} />
      </button>

      <div
        key={currentSlide}
        className="relative z-10 flex h-full min-h-[400px] md:min-h-[460px] flex-col justify-between p-8 md:p-10 md:px-20 pb-28 md:pb-28 animate-in fade-in slide-in-from-right-2 duration-500"
      >
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#feba50]">{slide.heading}</h2>
          <p className="mt-2 text-xl md:text-2xl font-bold text-white leading-snug">{slide.subheading}</p>

          <div className="mt-7 md:mt-8 flex max-w-md flex-col gap-3 rounded-2xl border border-white/12 bg-black/20 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#feba50]/95 shadow-sm">
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white">
                  <Check className="h-3 w-3 text-[#0d3028]" strokeWidth={3.5} />
                </span>
              </div>
              <div className="text-left leading-tight">
                <p className="text-sm font-semibold tracking-wide text-white">{slide.highlightLine1}</p>
                <p className="text-sm font-medium text-white/85">{slide.highlightLine2}</p>
              </div>
            </div>
            <div className="h-px w-full bg-white/10 sm:hidden" />
            <div className="flex min-w-0 flex-col gap-2 border-t border-white/10 pt-3 sm:flex-1 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#feba50]/95">{slide.packagesEyebrow}</p>
              <p className="text-[12px] leading-snug text-white/65">{slide.packagesCaption}</p>
              <button
                type="button"
                onClick={() => router.push("/packages")}
                className="group mt-1 inline-flex w-fit items-center gap-2 rounded-lg border border-white/25 bg-white/[0.07] px-3.5 py-2 text-left text-[13px] font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.12]"
              >
                Explore packages
                <ArrowRight className="h-3.5 w-3.5 opacity-80 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm md:text-[15px] leading-relaxed text-white/85 max-w-lg mt-5">{slide.body}</p>
      </div>

      <div className="absolute bottom-6 left-6 md:left-8 z-20 flex items-center gap-2">
        {trustCarouselSlides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(idx);
            }}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              idx === currentSlide
                ? "w-9 bg-[#feba50]"
                : idx === n - 1
                  ? "w-7 bg-[#2d5248]"
                  : "w-7 bg-white/35 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
