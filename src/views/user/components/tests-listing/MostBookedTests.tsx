"use client";

import { Clock, Search, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { SectionHeader } from "../home/SectionHeader";

const DEFAULT_TEST_IMAGE = "/placeholder/litmus_placeholder.webp";

interface FeaturedTest {
  id: string;
  name: string;
  method?: string;
  price: number;
  mrp: number;
  tat: string;
  type?: string;
  tests: number;
  imageUrl?: string;
  image?: string;
  icon?: string;
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
  const router = useRouter();
  const { data: userResponse } = useQuery({
    queryKey: ["userMe"],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 60 * 1000,
  });
  const user = userResponse?.data;

  const handleBookNow = (testId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.dispatchEvent(new Event("openAuthModal"));
    } else {
      router.push(`/bookings/new?testId=${testId}`);
    }
  };

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
              <div
                suppressHydrationWarning
                key={i}
                data-aos="fade-up"
                data-aos-delay={(i % 6) * 100}
                className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs border-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                  <div className="shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-slate-100 animate-pulse border border-slate-100" />
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="h-5 md:h-6 w-3/4 bg-slate-200 rounded-md animate-pulse" />
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-28 bg-brand-primary/10 rounded-full animate-pulse border border-brand-primary/15" />
                      <div className="h-4 w-24 bg-slate-100 rounded-md animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end justify-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:border-slate-100 sm:pl-5 w-full sm:w-auto">
                  <div className="h-9 sm:h-10 w-full sm:w-28 rounded-xl bg-slate-200 animate-pulse shrink-0" />
                  <div className="flex items-baseline gap-2">
                    <div className="h-6 w-16 bg-slate-200 rounded-md animate-pulse" />
                    <div className="h-4 w-12 bg-slate-100 rounded-md animate-pulse" />
                    <div className="h-4 w-14 bg-emerald-50 rounded-md animate-pulse" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              {tests.length > 0 ? (
                tests.map((t, i) => {
                  const testImg = t.imageUrl || t.image || t.icon || DEFAULT_TEST_IMAGE;
                  return (
                    <Link
                      suppressHydrationWarning
                      href={`/tests/${t.id}`}
                      key={t.id}
                      data-aos="fade-up"
                      data-aos-delay={(i % 10) * 50}
                      className="group bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs border-2 border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-action/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {/* Left: Test Image & Details */}
                      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                        {/* Image Container with Fallback to Litmus Placeholder */}
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={testImg}
                            alt={t.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = DEFAULT_TEST_IMAGE;
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <h3 className="text-base sm:text-[17px] font-bold text-slate-800 tracking-tight leading-snug group-hover:text-brand-action transition-colors truncate">
                            {t.name}
                          </h3>
                          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                            <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-brand-primary/20 shrink-0">
                              {t.tests} specialized tests
                            </span>
                            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-wide shrink-0">
                              <Clock className="h-3.5 w-3.5 text-brand-action" />
                              Reports in {t.tat}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Book Now Button on Top, Amount in flex at Bottom */}
                      <div className="flex flex-col items-start sm:items-end justify-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:border-slate-100 sm:pl-5 w-full sm:w-auto">
                        {/* Book Now Button on Top */}
                        <Button
                          type="button"
                          onClick={(e) => handleBookNow(t.id, e)}
                          className="bg-brand-action hover:bg-brand-action-hover text-white font-bold text-xs sm:text-sm px-5 h-9 sm:h-10 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center"
                        >
                          <Zap className="h-3.5 w-3.5 fill-current" />
                          <span>Book Now</span>
                        </Button>

                        {/* Amount in flex at Bottom: Offer value, Real value, Discount */}
                        <div className="flex items-baseline gap-2 flex-wrap sm:justify-end">
                          {/* Offer value */}
                          <span suppressHydrationWarning className="font-black text-slate-900 text-xl sm:text-2xl tracking-tight leading-none">
                            ₹{formatCurrency(t.price)}
                          </span>

                          {/* Real value & discount badge */}
                          {t.mrp && t.mrp > t.price ? (
                            <>
                              <span suppressHydrationWarning className="text-slate-400 line-through text-xs sm:text-sm font-medium">
                                ₹{formatCurrency(t.mrp)}
                              </span>
                              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider border border-emerald-100">
                                {discountPct(t.price, t.mrp)}% Off
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
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
