"use client";

import { useState, useRef, type MouseEvent } from "react";
import { useDebounce } from "@/hooks/use-debounce";

import { useSearchParams } from "next/navigation";
import { Package, Milk, Coffee, Wheat, Flame, Drumstick, Droplets, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { testApi } from "@/lib/api/test";
import { categoryApi } from "@/lib/api/category";
import { Skeleton } from "@/components/ui/skeleton";

// Sub-components
import { TestsHero } from "./components/tests-listing/TestsHero";
import { TestsStatsStrip } from "./components/tests-listing/TestsStatsStrip";
import { MostBookedTests } from "./components/tests-listing/MostBookedTests";
import { CategoryStrip } from "./components/tests-listing/CategoryStrip";
import { TestsGrid } from "./components/tests-listing/TestsGrid";
import { PromoBanner } from "./components/home/PromoBanner";
import { TrustAndOrdering } from "./components/tests-listing/TrustAndOrdering";

const testTypes = ["Physical", "Chemical", "Microbiological"];
const categoryPills = ["All", "Dairy", "Beverages", "Grains & Cereals", "Spices", "Meat & Poultry", "Oils & Fats", "Processed Foods", "Snacks"];

const iconMap: Record<string, React.ElementType> = {
  milk: Milk, coffee: Coffee, wheat: Wheat, flame: Flame,
  drumstick: Drumstick, droplets: Droplets, package: Package, cookie: Cookie,
};

export default function TestsListingPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "";
  const initialSearch = searchParams?.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState("");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [visibleItems, setVisibleItems] = useState(12);

  const { data: catRes, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
  });

  const rawData = catRes?.data?.data || catRes?.data || catRes || [];
  const categoriesData = Array.isArray(rawData) ? rawData : [];

  let selectedCategoryId: string | undefined = undefined;
  let activeCategoryName = selectedCategory;

  const activeCategoryObj = categoriesData.find((c: any) => {
    if (selectedCategory === "All") return false;
    const isId = /^[0-9a-fA-F]{24}$/.test(selectedCategory);
    return isId ? c._id === selectedCategory : c.name === selectedCategory;
  });

  if (activeCategoryObj) {
    selectedCategoryId = activeCategoryObj._id;
    activeCategoryName = activeCategoryObj.name;
  } else if (selectedCategory !== "All" && /^[0-9a-fA-F]{24}$/.test(selectedCategory)) {
    selectedCategoryId = selectedCategory;
  }

  const activeSubcategories = activeCategoryObj?.subcategories || [];

  const debouncedSearch = useDebounce(search, 300);
  const activeSubcategoryParam = selectedSubcategory !== "All" ? selectedSubcategory : undefined;

  const { 
    data: testsRes, 
    isLoading: testsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['tests', debouncedSearch, selectedCategoryId, activeSubcategoryParam],
    queryFn: ({ pageParam }) => testApi.getTests({
      search: debouncedSearch,
      category: selectedCategoryId,
      subcategory: activeSubcategoryParam,
      page: pageParam,
      limit: 12
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
  });

  const testsData = testsRes?.pages.flatMap(p => p.data || []) || [];
  const filtered = testsData;

  const formattedTests = filtered.map((t: any) => ({
    id: t._id,
    name: t.testName,
    price: t.offerPrice || t.price,
    mrp: t.price || t.offerPrice,
    tat: t.turnAroundTime || "3 days",
    tests: t.metadata?.parameters?.length || 0,
  }));

  const hasMore = visibleItems < filtered.length;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory("All");
    setVisibleItems(12);
  };

  const handleSeeMore = () => setVisibleItems(prev => prev + 6);

  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);
  const addToCart = (id: string, e?: MouseEvent<HTMLButtonElement>) => { e?.preventDefault(); setCartItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 })); };
  const removeFromCart = (id: string, e?: MouseEvent<HTMLButtonElement>) => { e?.preventDefault(); setCartItems(prev => {
    const next = { ...prev };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  }); };

  const filters = [
    ...(selectedCategory && selectedCategory !== "All" ? [{ label: selectedCategory, clear: () => { setSelectedCategory("All"); setSelectedSubcategory("All"); } }] : []),
    ...(selectedSubcategory && selectedSubcategory !== "All" ? [{ label: selectedSubcategory, clear: () => setSelectedSubcategory("All") }] : []),
    ...(selectedType ? [{ label: selectedType, clear: () => setSelectedType("") }] : []),
  ];

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">

      {/* 1. PANORAMIC HERO */}
      <div suppressHydrationWarning className="relative z-20" data-aos="fade-up">
        <TestsHero search={search} setSearch={setSearch} tests={testsData} onSearch={handleSearch} />
      </div>

      {/* 2. STATS STRIP */}
      <div suppressHydrationWarning data-aos="fade-up" data-aos-delay="100">
        <TestsStatsStrip /> 
      </div>

      {/* 3. CATEGORY STRIP — always at top for filtering */}
      <div suppressHydrationWarning data-aos="fade-up" data-aos-delay="150">
        <CategoryStrip
          selectedCategory={activeCategoryName}
          setSelectedCategory={handleCategoryChange}
          categories={categoriesData}
          isLoading={catLoading}
        />
      </div>

      {/* 4 & 5. TESTS SECTION (Sticky Subcategories Bar is bounded strictly to this section) */}
      <section className="relative">
        {/* SUB-CATEGORIES STRIP (Dynamically displays and sticks under navbar ONLY while scrolling test section) */}
        {selectedCategory !== "All" && activeSubcategories.length > 0 && (
          <div className="sticky top-[68px] md:top-[94px] z-30 max-w-7xl mx-auto px-4 -mt-2 mb-6 pointer-events-none">
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-md flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden transition-all">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider px-2 shrink-0 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-primary" />
                Subcategories:
              </span>
              <button
                onClick={() => setSelectedSubcategory("All")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs",
                  selectedSubcategory === "All"
                    ? "bg-brand-primary text-white shadow-xs"
                    : "bg-slate-100/90 text-slate-700 hover:bg-slate-200"
                )}
              >
                All {activeCategoryName}
              </button>
              {activeSubcategories.map((sub: any, idx: number) => {
                const isSubActive = selectedSubcategory === sub.name;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubcategory(sub.name)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 shadow-2xs",
                      isSubActive
                        ? "bg-brand-primary text-white shadow-xs"
                        : "bg-slate-100/90 text-slate-700 hover:bg-slate-200"
                    )}
                  >
                    <span>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. MOST BOOKED DIAGNOSTICS */}
        <div ref={resultsRef} className="scroll-mt-6">
          <MostBookedTests
            tests={formattedTests}
            discountPct={discountPct}
            selectedCategory={activeCategoryName}
            setSelectedCategory={handleCategoryChange}
            categories={categoriesData}
            iconMap={iconMap}
            cn={cn}
            isLoading={testsLoading}
            hasMore={hasNextPage}
            onLoadMore={() => fetchNextPage()}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      </section>

      {/* TRUST & ORDERING SECTION (Customized for Litmus) */}
      <div suppressHydrationWarning data-aos="fade-up">
        <TrustAndOrdering />
      </div>

      {/* PROMO BANNER CAROUSEL (From Home Page) */}
      <div suppressHydrationWarning data-aos="fade-up">
        <PromoBanner className="py-12 bg-slate-50 md:py-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Empty state is now handled inside MostBookedTests */}
      </div>
    </div>
  );
}
