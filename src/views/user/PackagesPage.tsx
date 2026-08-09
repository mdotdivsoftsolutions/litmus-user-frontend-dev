"use client";

import { useState, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useNavigate } from "@/lib/router-compat";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api/category";
import { packageApi } from "@/lib/api/package";
import { CategoryStrip } from "./components/tests-listing/CategoryStrip";
import { PackagesHero } from "./components/packages/PackagesHero";
import { PackagesGrid } from "./components/packages/PackagesGrid";
import { PackagesCTA } from "./components/packages/PackagesCTA";

export default function PackagesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const navigate = useNavigate();
  const heroCategories = ["All", "Compliance", "Clinical", "Labeling"];
  const resultsRef = useRef<HTMLDivElement>(null);

  const { data: catRes, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoryApi.getCategories();
      return res.data;
    }
  });

  const debouncedSearch = useDebounce(search, 300);

  const { 
    data: pkgRes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: pkgLoading
  } = useInfiniteQuery({
    queryKey: ['packages', debouncedSearch],
    queryFn: ({ pageParam = 1 }) => packageApi.getAllPackages({ search: debouncedSearch, page: pageParam, limit: 12 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
  });

  const apiCategories = catRes?.data || [];
  const packagesData = pkgRes?.pages.flatMap(p => p.data || []) || [];

  const handleSearch = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      {/* 1. VIBRANT PANORAMIC HERO */}
      <div data-aos="fade-up">
        <PackagesHero
          categories={heroCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          search={search}
          setSearch={setSearch}
          packages={packagesData}
          onSearch={handleSearch}
        />
      </div>

      {/* 2. PACKAGES GRID */}
      <section ref={resultsRef} className="scroll-mt-6">
        <PackagesGrid
          packages={packagesData}
          search={search}
          isLoading={!pkgRes && pkgLoading}
          selectedCategory={selectedCategory}
          hasMore={hasNextPage}
          onLoadMore={() => fetchNextPage()}
          isFetchingNextPage={isFetchingNextPage}
        />
      </section>

      {/* 3. CALL TO ACTION */}
      <section className="bg-white py-10 md:py-20" data-aos="fade-up" data-aos-delay="150">
        <PackagesCTA />
      </section>

      {/* 4. FOOD CATEGORY WISE PACKAGES */}
      <section className="bg-slate-50" data-aos="fade-up">
        <CategoryStrip 
          selectedCategory={""} 
          setSelectedCategory={(cat) => {
            if (cat === "All") {
              navigate("/tests");
            } else {
              navigate(`/tests?category=${encodeURIComponent(cat)}`);
            }
          }} 
          categories={apiCategories}
          isLoading={catLoading}
        />
      </section>
    </div>
  );
}
