"use client";

import { TrustCarouselCard } from "./TrustCarouselCard";
import { EasyOrderingCard } from "./EasyOrderingCard";

export const TrustAndOrdering = () => {
  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <TrustCarouselCard />
          <EasyOrderingCard />
        </div>
      </div>
    </section>
  );
};
