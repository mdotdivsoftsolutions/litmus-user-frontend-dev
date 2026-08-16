"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PackagesHeroSearchProps {
  search: string;
  setSearch: (val: string) => void;
  packages?: any[];
  onSearch?: () => void;
}

export function PackagesHeroSearch({
  search,
  setSearch,
  packages = [],
  onSearch,
}: PackagesHeroSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (packageId: string) => {
    setShowSuggestions(false);
    router.push(`/packages/${packageId}`);
  };

  const handleExploreClick = () => {
    setShowSuggestions(false);
    if (onSearch) onSearch();
  };

  const filteredSuggestions =
    search.trim() === ""
      ? []
      : packages.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase())).slice(0, 5);

  return (
    <div ref={wrapperRef} className="relative z-50">
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-slate-100 max-w-xl mx-auto lg:mx-0 ring-4 ring-slate-400/5 hover:ring-slate-400/10 transition-all">
        <div className="relative flex-1 w-full pl-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-hover:text-[#D32F2F] transition-colors" />
          <Input
            placeholder="Search diagnostic packages..."
            className="font-body h-10 sm:h-10 pl-12 pr-6 border-none bg-transparent text-slate-800 placeholder:text-slate-400 text-base focus-visible:ring-0 shadow-none font-normal"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleExploreClick();
            }}
          />
        </div>
        <Button
          onClick={handleExploreClick}
          className="w-full sm:w-auto h-11 px-6 bg-gradient-to-r from-[#D32F2F] to-[#F06C00] text-white font-body font-semibold text-base rounded-2xl shadow-[0_12px_24px_rgba(211,47,47,0.25)] transition-all flex items-center gap-3 group/btn hover:scale-[1.02] active:scale-95"
        >
          Explore <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>

      {showSuggestions && search.trim() !== "" && (
        <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
          {filteredSuggestions.length > 0 ? (
            <div className="py-2">
              {filteredSuggestions.map((pkg) => (
                <div
                  key={pkg._id}
                  onClick={() => handleSuggestionClick(pkg._id)}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#D32F2F]/10 transition-colors">
                      <Search className="h-4 w-4 text-slate-400 group-hover:text-[#D32F2F]" />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-bold text-slate-800 leading-[1.3]">{pkg.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-data-badge text-xs font-semibold uppercase tracking-wider text-[#D32F2F]">
                          {pkg.category?.name || "PACKAGE"}
                        </span>
                        {pkg.tat && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="font-data text-xs font-normal text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {pkg.tat}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {pkg.mrp && pkg.mrp > pkg.price && (
                      <span className="text-[10px] text-slate-400 line-through mr-2">₹{pkg.mrp}</span>
                    )}
                    <span className="text-sm font-black text-slate-800">₹{pkg.price}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm font-medium text-slate-500">
              No packages found matching &quot;{search}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
