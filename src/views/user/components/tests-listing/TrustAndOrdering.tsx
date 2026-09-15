"use client";

import { TrustCarouselCard } from "./TrustCarouselCard";
import { EasyOrderingCard } from "./EasyOrderingCard";

export const TrustAndOrdering = () => {
  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full min-w-0">
          <TrustCarouselCard />
          <EasyOrderingCard />
        </div>
      </div>
    </section>
  );
};
