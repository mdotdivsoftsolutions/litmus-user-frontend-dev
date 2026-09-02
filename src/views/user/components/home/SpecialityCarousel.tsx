"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const FALLBACK_IMAGE = "/stock_image/speciality-1.png";

const TINTS = [
  "bg-[#e8f5e9]",
  "bg-[#e3f2fd]",
  "bg-[#e8f4f8]",
  "bg-[#e8eaf0]",
  "bg-[#fff3e0]",
  "bg-[#fce4ec]"
];

function PastelCategoryCard({
  href,
  title,
  subtitle,
  footnote,
  image,
  tint,
}: {
  href: string;
  title: string;
  subtitle: string;
  footnote: string;
  image: string;
  tint: string;
}) {
  const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);

  return (
    <Link
      href={href}
      className="group m-2 flex h-[270px] sm:h-[280px] w-[210px] sm:w-[230px] md:w-[240px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-brand-action/30 transition-all duration-300"
    >
      <div
        className={`relative flex h-[120px] sm:h-[130px] items-center justify-center overflow-hidden shrink-0 ${tint}`}
      >
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transform-gpu will-change-transform transition-transform duration-300 ease-out group-hover:scale-105"
          onError={() => {
            setImgSrc(FALLBACK_IMAGE);
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-4 min-h-0">
        {/* Title — Nunito (H5: 16px, Bold, Line-height: 1.3) */}
        <h3 className="font-heading text-base font-bold leading-[1.3] tracking-tight text-slate-900 line-clamp-1 group-hover:text-brand-action transition-colors">
          {title}
        </h3>
        {/* Subtitle — Manrope (14px/12px, Regular, Line-height: 1.5) */}
        <p className="font-body mt-1 text-xs leading-[1.5] text-slate-500 line-clamp-2">{subtitle}</p>
        {/* Footnote — Inter (Badges/Data: 12px, Semibold, Line-height: 1.4) */}
        <p className="font-data-badge mt-auto pt-2 text-[11px] font-bold uppercase tracking-wider text-brand-primary">
          {footnote}
        </p>
      </div>
    </Link>
  );
}

export function SpecialityCarousel({ initialCategories }: { initialCategories?: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const categories = Array.isArray(initialCategories?.data) 
    ? initialCategories.data 
    : (Array.isArray(initialCategories) ? initialCategories : (initialCategories?.data?.data || []));

  return (
    <section className="relative flex flex-col justify-center overflow-hidden bg-white py-12 md:py-16">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-red-50/30 blur-[120px]" />


      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        <SectionHeader
          badge="Clinical Specialities"
          title={
            <>
              Tests By Food{" "}
              <span className="text-gradient-brand">
                Category
              </span>
            </>
          }
          subtitle="Explore our comprehensive food testing solutions categorized by product type for fast, reliable regulatory compliance."
          action={{
            label: "View All Categories",
            href: "/tests",
          }}
          rightContent={
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 transition-all duration-300 hover:shadow-md hover:text-brand-action hover:border-brand-action/30"
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 transition-all duration-300 hover:shadow-md hover:text-brand-action hover:border-brand-action/30"
                aria-label="Scroll categories right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          }
        />

        <div className="relative">
          <div ref={scrollRef} className="flex overflow-x-auto scrollbar-hide pb-2 pt-1 -mx-2 scroll-smooth">
            {categories.length > 0 ? (
              categories.map((cat: any, i: number) => (
                <div key={cat._id || i} className="shrink-0">
                  <PastelCategoryCard
                    href={`/tests?category=${encodeURIComponent(cat._id)}`}
                    title={cat.name}
                    subtitle={cat.description || "Explore specialized diagnostic tests for this category."}
                    footnote={`${cat.testCount || 0} tests available`}
                    image={cat.imageUrl || FALLBACK_IMAGE}
                    tint={TINTS[i % TINTS.length]}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground w-full">
                No categories available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


