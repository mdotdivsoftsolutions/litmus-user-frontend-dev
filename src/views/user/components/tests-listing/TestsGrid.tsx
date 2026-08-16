"use client";

import { ArrowDown } from "lucide-react";
import type { MouseEvent } from "react";
import { TestCard } from "../TestCard";
import type { Product } from "@/lib/placeholder-data";
import { SectionHeader } from "../home/SectionHeader";

interface TestsGridProps {
  products: Product[];
  cartItems: Record<string, number>;
  addToCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
  removeFromCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
  handleSeeMore: () => void;
  hasMore: boolean;
}

export const TestsGrid = ({
  products,
  cartItems,
  addToCart,
  removeFromCart,
  handleSeeMore,
  hasMore
}: TestsGridProps) => {
  return (
    <div className="space-y-12">
      <SectionHeader
        title={
          <>
            Test Packages <span className="text-gradient-brand">for You</span>
          </>
        }
        subtitle="Industry-compliant multi-parameter testing panels for complete safety verification."
      />

      <div className="flex flex-wrap gap-6 justify-center lg:justify-start -mx-2">
        {products.map((p) => (
          <TestCard
            key={p.id}
            p={p}
            cartItems={cartItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>

      {/* See More Button */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center py-5 gap-4">
          <button
            onClick={handleSeeMore}
            className="group relative flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-slate-100 text-slate-800 font-bold tracking-tight hover:border-brand-action/30 hover:shadow-[0_20px_40px_rgba(0,75,96,0.08)] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative text-sm z-10 font-body">Show More Packages</span>
            <div className="relative z-10 h-8 w-8 rounded-xl bg-brand-action text-white flex items-center justify-center group-hover:rotate-180 transition-transform duration-500 shadow-sm">
              <ArrowDown className="h-4 w-4" />
            </div>
            <div className="absolute inset-0 bg-slate-50 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500 origin-center -z-0" />
          </button>
          <p className="font-data text-[11px] text-slate-400 font-semibold uppercase tracking-widest">Discover more diagnostic capabilities</p>
        </div>
      )}
    </div>
  );
};
