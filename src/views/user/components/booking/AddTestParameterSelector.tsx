"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Check, Loader2, Sparkles, Beaker, X } from "lucide-react";
import { testApi } from "@/lib/api/test";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AddTestParameterSelectorProps {
  itemId: string;
  sampleId: string;
  selectedParameters: string[];
  onAddParam: (itemId: string, sampleId: string, paramName: string) => void;
}

export function AddTestParameterSelector({
  itemId,
  sampleId,
  selectedParameters,
  onAddParam,
}: AddTestParameterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce search input for snappy performance on 1000+ tests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 200);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch tests matching the search from API
  const { data: testsResponse, isLoading } = useQuery({
    queryKey: ["searchTestsForScope", debouncedSearch],
    queryFn: () => testApi.getTests({ search: debouncedSearch, limit: 25 }),
    enabled: isOpen,
    staleTime: 60 * 1000,
  });

  const rawTests: any[] = testsResponse?.data || [];

  // Extract individual parameters and test names
  const testResults = rawTests.map((t) => {
    const paramsList: string[] = Array.isArray(t.metadata?.parameters)
      ? t.metadata.parameters.map((p: any) => (typeof p === "string" ? p : p.name)).filter(Boolean)
      : Array.isArray(t.parameters)
      ? t.parameters
      : [];

    return {
      id: t._id,
      name: t.testName || t.name,
      price: t.price || t.offerPrice || 0,
      parameters: paramsList,
    };
  });

  const handleSelectParam = (paramName: string) => {
    if (!paramName.trim()) return;
    onAddParam(itemId, sampleId, paramName.trim());
    setSearchTerm("");
    setIsOpen(false);
  };

  const isAlreadySelected = (name: string) =>
    selectedParameters.some((p) => p.toLowerCase() === name.toLowerCase());

  return (
    <div ref={wrapperRef} className="relative mt-3 pt-3 border-t border-slate-200/70">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchTerm}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search from 1,000+ available tests &amp; parameters to add..."
            className="pl-9 pr-8 h-10 text-xs sm:text-sm bg-white border-slate-200 shadow-2xs rounded-lg focus-visible:ring-brand-action"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Button
          type="button"
          onClick={() => {
            if (searchTerm.trim()) {
              handleSelectParam(searchTerm.trim());
            } else {
              setIsOpen(!isOpen);
            }
          }}
          className="h-10 px-4 text-xs font-bold bg-slate-900 hover:bg-black text-white shrink-0 gap-1.5 rounded-lg shadow-sm"
        >
          <Plus className="h-4 w-4" />
          {searchTerm.trim() ? "Add Custom" : "Browse Tests"}
        </Button>
      </div>

      {/* Scalable Search Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Beaker className="h-3.5 w-3.5 text-brand-action" />
              Available Catalogue Tests &amp; Parameters
            </span>
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1">
            {/* Custom write-in option if user typed something */}
            {searchTerm.trim() && !isAlreadySelected(searchTerm.trim()) && (
              <div
                onClick={() => handleSelectParam(searchTerm.trim())}
                className="p-3 hover:bg-brand-action/5 rounded-lg cursor-pointer transition-colors flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-action shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-brand-action">
                      Add &ldquo;{searchTerm.trim()}&rdquo; as custom parameter
                    </p>
                    <p className="text-[10px] text-slate-400">Custom user-specified test parameter</p>
                  </div>
                </div>
                <Badge className="bg-brand-action text-white hover:bg-brand-action text-[10px] font-bold">
                  + Add
                </Badge>
              </div>
            )}

            {/* Catalogue Test Results */}
            {testResults.length > 0 ? (
              testResults.map((test) => {
                const testSelected = isAlreadySelected(test.name);

                return (
                  <div key={test.id} className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate">{test.name}</span>
                        {test.price > 0 && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            ₹{test.price}
                          </span>
                        )}
                      </div>

                      {testSelected ? (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <Check className="h-3 w-3" /> Added
                        </span>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSelectParam(test.name)}
                          className="h-7 px-2 text-xs font-bold text-brand-action hover:bg-brand-action/10"
                        >
                          + Add Test
                        </Button>
                      )}
                    </div>

                    {/* Sub-parameters if available */}
                    {test.parameters.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pl-2 pt-0.5">
                        {test.parameters.map((param) => {
                          const paramSelected = isAlreadySelected(param);
                          return (
                            <button
                              key={param}
                              type="button"
                              disabled={paramSelected}
                              onClick={() => handleSelectParam(param)}
                              className={cn(
                                "text-[11px] px-2 py-0.5 rounded-md border text-left transition-all",
                                paramSelected
                                  ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                                  : "bg-white border-slate-200 text-slate-700 hover:border-brand-action hover:text-brand-action cursor-pointer"
                              )}
                            >
                              {paramSelected ? `✓ ${param}` : `+ ${param}`}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : !isLoading ? (
              <div className="p-6 text-center text-slate-500 text-xs space-y-2">
                <p>No catalog tests matched &ldquo;{searchTerm}&rdquo;.</p>
                {searchTerm.trim() && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleSelectParam(searchTerm.trim())}
                    className="h-8 text-xs font-bold bg-brand-action hover:bg-brand-action-hover text-white"
                  >
                    Add &ldquo;{searchTerm.trim()}&rdquo; as Custom Parameter
                  </Button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
