"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubcategoryStripProps {
  categoryName: string;
  subcategories: any[];
  selectedSubcategory: string;
  onSelectSubcategory: (sub: string) => void;
}

export function SubcategoryStrip({
  categoryName,
  subcategories,
  selectedSubcategory,
  onSelectSubcategory,
}: SubcategoryStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Check scroll position and determine if arrows should be visible
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Allow small 2px tolerance for fractional zoom levels
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);

    // Re-check after layout changes / font renders
    const timer = setTimeout(checkScroll, 150);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [subcategories, checkScroll]);

  // Handle clicking left / right navigation arrows
  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    // Scroll by ~60% of the visible container width or fixed 260px
    const distance = Math.max(220, Math.round(el.clientWidth * 0.6));
    const target = direction === "left" ? -distance : distance;
    el.scrollBy({ left: target, behavior: "smooth" });

    // Update arrows after animation
    setTimeout(checkScroll, 320);
  };

  // Convert mouse wheel vertical scroll to horizontal scroll when hovering
  const handleWheel = (e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    // If scrolling vertically and container can scroll horizontally
    if (e.deltaY !== 0 && (el.scrollWidth > el.clientWidth)) {
      el.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  // Mouse Drag-to-Scroll support for desktop mice
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    if (Math.abs(walk) > 4) {
      setHasMoved(true);
    }
    el.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="sticky top-[68px] md:top-[94px] z-30 max-w-7xl mx-auto px-4 -mt-2 mb-6 pointer-events-none select-none">
      <div className="relative pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-slate-200/90 shadow-md transition-all">
        
        {/* Left Scroll Arrow Button & Fade Gradient */}
        <div
          className={cn(
            "absolute left-1.5 top-1/2 -translate-y-1/2 z-20 flex items-center transition-all duration-300",
            canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="h-9 w-8 bg-gradient-to-r from-white via-white to-transparent pointer-events-none" />
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left subcategories"
            className="h-8 w-8 -ml-4 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-brand-primary hover:bg-slate-50 hover:border-brand-primary/40 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Subcategories Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={cn(
            "flex items-center gap-2 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1 py-0.5",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
        >
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider px-2 shrink-0 flex items-center gap-1.5 select-none">
            <span className="h-2 w-2 rounded-full bg-brand-primary shrink-0 animate-pulse" />
            Subcategories:
          </span>

          {/* "All" Option */}
          <button
            type="button"
            onClick={() => {
              if (!hasMoved) onSelectSubcategory("All");
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs whitespace-nowrap",
              selectedSubcategory === "All"
                ? "bg-brand-primary text-white shadow-xs scale-[1.02]"
                : "bg-slate-100/90 text-slate-700 hover:bg-slate-200"
            )}
          >
            All {categoryName}
          </button>

          {/* Subcategory Chips */}
          {subcategories.map((sub: any, idx: number) => {
            const subName = typeof sub === "string" ? sub : (sub?.name || String(sub));
            const isSubActive = selectedSubcategory === subName;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (!hasMoved) onSelectSubcategory(subName);
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap",
                  isSubActive
                    ? "bg-brand-primary text-white shadow-xs scale-[1.02]"
                    : "bg-slate-100/90 text-slate-700 hover:bg-slate-200"
                )}
              >
                <span>{subName}</span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Arrow Button & Fade Gradient */}
        <div
          className={cn(
            "absolute right-1.5 top-1/2 -translate-y-1/2 z-20 flex items-center transition-all duration-300",
            canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right subcategories"
            className="h-8 w-8 -mr-4 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-brand-primary hover:bg-slate-50 hover:border-brand-primary/40 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="h-9 w-8 bg-gradient-to-l from-white via-white to-transparent pointer-events-none" />
        </div>

      </div>
    </div>
  );
}
