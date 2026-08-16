"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, FlaskConical, Package, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/lib/api/search";
import { cn } from "@/lib/utils";

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  hideIcon?: boolean;
  dropdownPosition?: "top" | "bottom";
  children?: React.ReactNode;
}

export function SearchAutocomplete({
  placeholder = "Search for tests, products...",
  className = "",
  inputClassName = "",
  hideIcon = false,
  dropdownPosition = "bottom",
  children,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ["searchSuggestions", debouncedQuery],
    queryFn: () => searchApi.getSuggestions(debouncedQuery),
    enabled: debouncedQuery.length > 1,
    staleTime: 60000,
  });

  const suggestions = data?.data || [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsOpen(false);
      router.push(`/tests?search=${encodeURIComponent(query)}`);
    }
  };

  const handleSelect = (item: any) => {
    setIsOpen(false);
    setQuery("");

    if (item.type === "test") router.push(`/tests/${item.id}`);
    else if (item.type === "package") router.push(`/packages/${item.id}`);
    else if (item.type === "category") router.push(`/tests?category=${encodeURIComponent(item.name)}`);
    else router.push(`/tests?search=${encodeURIComponent(item.name)}`);
  };

  const getItemIcon = (type: string) => {
    if (type === "test") return <FlaskConical className="h-4 w-4 text-brand-action" />;
    if (type === "package") return <Package className="h-4 w-4 text-emerald-600" />;
    return <Layers className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div ref={wrapperRef} className={`relative flex-1 ${className}`}>
      {!hideIcon && <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />}
      <Input
        type="text"
        placeholder={placeholder}
        className={`${!hideIcon ? "pl-9" : ""} ${inputClassName}`}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {children}

      {isOpen && query.length > 1 && (
        <div
          className={cn(
            "absolute left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in duration-200",
            dropdownPosition === "top" ? "bottom-full mb-3" : "top-full mt-2"
          )}
        >
          {isLoading ? (
            <div className="p-4 flex items-center justify-center text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span className="text-sm font-medium">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-[280px] overflow-y-auto py-2 divide-y divide-slate-50">
              {suggestions.map((item: any, idx: number) => (
                <li key={`${item.type}-${item.id}-${idx}`}>
                  <button
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {getItemIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{item.type}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm font-medium text-slate-500">No results found for &quot;{query}&quot;</div>
          )}
        </div>
      )}
    </div>
  );
}
