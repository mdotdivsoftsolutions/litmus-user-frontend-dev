"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "./home/SectionHeader";
import { TestCard, TestItemType } from "./TestCard";
import { Skeleton } from "@/components/ui/skeleton";

export type HomeTestsProps = {
  initialPackages?: any;
};

function PackagesSectionHeader({ rightContent }: { rightContent?: ReactNode }) {
  return (
    <SectionHeader
      title={
        <>
          Popular Food Testing <span className="text-gradient-brand">Packages</span>
        </>
      }
      subtitle="Our curated packages simplify food testing with pre-designed testing packages tailored to different product categories and help you save time, reduce costs, and ensure that critical parameters are not overlooked."
      action={{
        label: "View All Packages",
        href: "/packages",
      }}
      rightContent={rightContent}
    />
  );
}

export function HomeTestsSkeleton() {
  return (
    <section className="pt-8 lg:pt-16 pb-10 md:pb-18 relative overflow-hidden bg-white" aria-busy="true" aria-label="Loading popular packages">
      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <PackagesSectionHeader
          rightContent={
            <div className="hidden md:flex gap-2">
              <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200" />
              <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200" />
            </div>
          }
        />
        <div className="relative">
          <div className="flex overflow-hidden pb-5 pt-2 -mx-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="m-2 flex w-[280px] min-h-[280px] shrink-0 flex-col rounded-2xl border border-slate-100 bg-white p-5"
              >
                <Skeleton className="h-14 w-14 rounded-lg mb-4" />
                <Skeleton className="h-5 w-[85%] mb-2" />
                <Skeleton className="h-5 w-[60%] mb-4" />
                <Skeleton className="h-4 w-[70%] mb-2" />
                <Skeleton className="h-3 w-[50%] mb-8" />
                <div className="mt-auto flex items-end justify-between gap-4">
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-10 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export const HomeTests = ({ initialPackages }: HomeTestsProps) => {
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

  const popularPackages = Array.isArray(initialPackages?.data)
    ? initialPackages.data
    : Array.isArray(initialPackages)
      ? initialPackages
      : initialPackages?.data?.data || [];

  const displayPackages = popularPackages.slice(0, 5);

  return (
    <section className="pt-8 lg:pt-16 pb-10 md:pb-18 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <PackagesSectionHeader
          rightContent={
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 transition-all duration-300 hover:shadow-md hover:text-brand-action hover:border-brand-action/30"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 transition-all duration-300 hover:shadow-md hover:text-brand-action hover:border-brand-action/30"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          }
        />

        <div className="relative">
          <div ref={scrollRef} className="flex overflow-x-auto scrollbar-hide pb-5 pt-2 -mx-2 scroll-smooth">
            {displayPackages.length > 0 ? (
              displayPackages.map((t: TestItemType, index: number) => (
                <div suppressHydrationWarning key={`popular-pkg-${t._id || index}`} data-aos="fade-up" data-aos-delay={index * 100}>
                  <TestCard t={t} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-10 text-muted-foreground">No popular packages found.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HomeTests;
