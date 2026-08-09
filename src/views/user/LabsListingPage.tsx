"use client";

import { useState, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { laboratories } from "@/lib/placeholder-data";
import { LabsHero } from "./components/labs-listing/LabsHero";
import { LabsGrid } from "./components/labs-listing/LabsGrid";
import { ConsultationServices } from "./components/consultation/ConsultationServices";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { labApi } from "@/lib/api/lab";

export default function LabsListingPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [visibleCount, setVisibleCount] = useState(10); // kept for any un-removed refs but replaced by backend pagination

  const debouncedSearch = useDebounce(search, 300);

  const { 
    data: labsResponse, 
    isLoading: labsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["publicLabs", { location: selectedCity !== "All Cities" ? selectedCity : undefined, search: debouncedSearch }],
    queryFn: ({ pageParam = 1 }) => labApi.getLabsPublic({ 
      location: selectedCity !== "All Cities" ? selectedCity : undefined,
      search: debouncedSearch,
      page: pageParam,
      limit: 12
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
  });

  const rawLabs = labsResponse?.pages.flatMap(p => p.data || []) || [];

  const mappedLabs = rawLabs.map((l: any) => ({
      id: l._id,
      name: l.labName,
      city: l.location?.city || "Unknown",
      nabl: l.isNablAccredited,
      fssai: l.isFssaiApproved,
      rating: l.reviews?.length > 0 ? (l.reviews.reduce((acc: any, curr: any) => acc + curr.rating, 0) / l.reviews.length) : 0,
      reviewCount: l.reviews?.length || 0,
      priceFrom: l.pricing ? Math.min(...Object.values(l.pricing as Record<string, number>).filter(v => typeof v === 'number')) : 500,
      testsCount: l.tests?.length || 0,
      expertiseArea: l.expertiseArea || [],
  }));

  const filtered = mappedLabs;
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="animate-fade-in min-h-screen bg-white">
      <LabsHero
        search={search}
        setSearch={setSearch}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        labs={mappedLabs}
        onSearch={handleSearch}
      />
      <div ref={resultsRef} className="bg-slate-50 scroll-mt-6">
        <LabsGrid
          filtered={filtered}
          visibleCount={visibleCount}
          setVisibleCount={setVisibleCount}
          isLoading={!labsResponse && labsLoading}
          hasMore={hasNextPage}
          onLoadMore={() => fetchNextPage()}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
      <ConsultationServices />
    </div>
  );
}
