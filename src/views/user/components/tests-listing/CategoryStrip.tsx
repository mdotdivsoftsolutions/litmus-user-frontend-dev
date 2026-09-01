"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { SectionHeader } from "../home/SectionHeader";

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400";
const ALL_IMAGE = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=400";

interface CategoryStripProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: any[];
  isLoading?: boolean;
}

function StripCardImage({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const effectiveSrc = (!hasError && src) ? src : DEFAULT_FALLBACK;

  return (
    <div className="absolute inset-0 bg-slate-800 overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <ImageIcon className="h-6 w-6 text-slate-600" />
        </div>
      )}
      <img
        src={effectiveSrc}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transform-gpu will-change-transform group-hover:scale-105 transition-all duration-300 ease-out",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        alt={alt}
      />
    </div>
  );
}

interface CategoryItem {
  name: string;
  img: string;
  isLink?: boolean;
  href?: string;
}

export const CategoryStrip = ({ selectedCategory, setSelectedCategory, categories, isLoading }: CategoryStripProps) => {
  const pathname = usePathname();
  const isPackages = pathname === "/packages";

  const displayCategories = useMemo<CategoryItem[]>(() => {
    if (!categories || categories.length === 0) {
      return [{ name: "All", img: ALL_IMAGE, isLink: false }];
    }
    return [
      { name: "All", img: ALL_IMAGE, isLink: false },
      ...categories.map((c: any) => ({
        name: c.name,
        img: c.imageUrl || DEFAULT_FALLBACK,
        isLink: false,
      }))
    ];
  }, [categories]);

  return (
    <div className="w-full pt-6 pb-2 md:pt-20 md:pb-14">
      <div className="max-w-7xl mx-auto px-4">
        {isPackages && (
          <SectionHeader
            title={
              <>
                Browse by{" "}
                <span className="text-gradient-brand">
                  Category
                </span>
              </>
            }
            subtitle={<>Here are our most frequently selected packages. If you don't see what you need, <Link href="/contact" className="text-brand-primary hover:underline font-bold">reach out</Link> for a custom solution.</>}
            className="mb-10"
          />
        )}

        <div className="flex flex-col gap-6">
          {/* Container for categories */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="relative h-[140px] md:h-[180px] w-[110px] shrink-0 md:w-full rounded-2xl overflow-hidden bg-slate-100 flex flex-col justify-end p-4 border-2 border-slate-50/50 snap-start">
                   <div className="absolute inset-0 bg-slate-200/50 animate-pulse" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-300/50 to-transparent" />
                   <div className="relative z-10">
                      <div className="h-2.5 md:h-3 w-16 bg-slate-300 rounded-full animate-pulse" />
                   </div>
                </div>
              ))
            ) : (
              displayCategories.map((cat) => {
                const innerContent = (
                  <>
                    <StripCardImage src={cat.img} alt={cat.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="relative z-10">
                      <p className={cn(
                        "text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight transition-colors flex items-center justify-between w-full gap-1",
                        selectedCategory === cat.name ? "text-white" : "text-white/90"
                      )}>
                        <span className="flex-1">{cat.name}</span>
                        <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 shrink-0" />
                      </p>
                    </div>

                    {/* Active Indicator Pips */}
                    {selectedCategory === cat.name && (
                      <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-brand-action flex items-center justify-center shadow-md border-2 border-white">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </>
                );

                const buttonClass = cn(
                  "group relative h-[140px] md:h-[180px] w-[110px] shrink-0 md:w-full rounded-2xl overflow-hidden flex flex-col justify-end p-4 transition-all duration-300 border-2 text-left snap-start outline-none focus:outline-none focus-visible:outline-none cursor-pointer",
                  selectedCategory === cat.name
                    ? "border-brand-action shadow-md"
                    : "border-transparent hover:border-slate-200 hover:-translate-y-1"
                );

                if (cat.isLink && cat.href) {
                  return (
                    <Link key={cat.name} href={cat.href} className={buttonClass}>
                      {innerContent}
                    </Link>
                  );
                }

                return (
                  <button key={cat.name} type="button" onClick={() => setSelectedCategory(cat.name)} className={buttonClass}>
                    {innerContent}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
