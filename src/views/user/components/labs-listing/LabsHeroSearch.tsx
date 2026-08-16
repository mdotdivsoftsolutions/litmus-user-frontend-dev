"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, FlaskConical, MapPin, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const cities = ["All Cities", "Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

interface LabsHeroSearchProps {
  search: string;
  setSearch: (val: string) => void;
  selectedCity: string;
  setSelectedCity: (val: string) => void;
  labs?: any[];
  onSearch?: () => void;
}

export function LabsHeroSearch({
  search,
  setSearch,
  selectedCity,
  setSelectedCity,
  labs = [],
  onSearch,
}: LabsHeroSearchProps) {
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

  const filteredSuggestions =
    search.trim() === ""
      ? []
      : labs
          .filter(
            (l) =>
              l.name?.toLowerCase().includes(search.toLowerCase()) ||
              l.city?.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 5);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (id: string) => {
    router.push(`/labs/${id}`);
    setShowSuggestions(false);
  };

  const handleExploreClick = () => {
    setShowSuggestions(false);
    if (onSearch) onSearch();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
      <div ref={wrapperRef} className="relative flex-1 group z-50">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D32F2F] transition-colors" />
        <Input
          placeholder="Search labs or cities..."
          className="font-body pl-10 h-10 rounded-xl text-sm border-slate-100 bg-white shadow-sm focus:border-[#D32F2F]/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-all font-normal"
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleExploreClick();
          }}
        />

        {showSuggestions && search.trim() !== "" && (
          <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
            {filteredSuggestions.length > 0 ? (
              <div className="py-2">
                {filteredSuggestions.map((lab) => (
                  <div
                    key={lab.id}
                    onClick={() => handleSuggestionClick(lab.id)}
                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#D32F2F]/10 transition-colors">
                        <FlaskConical className="h-4 w-4 text-slate-400 group-hover:text-[#D32F2F]" />
                      </div>
                      <div>
                        <p className="font-heading text-sm font-bold text-slate-800 leading-[1.3]">{lab.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-data text-xs font-normal text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#D32F2F]" /> {lab.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-body p-4 text-center text-sm font-normal text-slate-500">
                No labs found matching &quot;{search}&quot;
              </div>
            )}
          </div>
        )}
      </div>
      <Select value={selectedCity} onValueChange={setSelectedCity}>
        <SelectTrigger className="w-full sm:w-40 lg:w-44 h-10 rounded-xl border-slate-100 bg-white shadow-sm font-semibold text-xs tracking-widest text-slate-600 uppercase focus:ring-0 focus:ring-offset-0 focus:outline-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {cities.map((c) => (
            <SelectItem key={c} value={c} className="font-body text-xs font-semibold uppercase tracking-widest">
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleExploreClick}
        className="w-full sm:w-auto h-10 px-5 bg-gradient-to-r from-[#D32F2F] to-[#F06C00] text-white font-body font-semibold text-sm rounded-xl shadow-[0_12px_24px_rgba(211,47,47,0.25)] transition-all flex items-center gap-2 group/btn hover:scale-[1.02] active:scale-95"
      >
        Explore <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
