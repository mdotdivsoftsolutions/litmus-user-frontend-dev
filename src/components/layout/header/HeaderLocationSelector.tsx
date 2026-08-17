"use client";

import { useEffect, useState } from "react";
import { MapPin, ChevronDown, Loader2, Navigation, ShieldAlert, Check, Search, Globe, Radio, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useUserLocation } from "@/components/location/LocationContext";
import { searchLocationSuggestions, LocationSuggestion } from "@/lib/location";
import { toast } from "sonner";

export function HeaderLocationSelector() {
  const { city, permission, isDetecting, source, detectLocation, setCity } = useUserLocation();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const label = city || "Set location";

  // Live Location Autocomplete using modular location utility
  useEffect(() => {
    const query = search.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setIsSearchingApi(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      try {
        const results = await searchLocationSuggestions(query, controller.signal, 7);
        setSuggestions(results);
      } finally {
        setIsSearchingApi(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  const handleDetect = async () => {
    const ok = await detectLocation();
    if (ok) {
      toast.success("Location updated successfully");
      return;
    }
    toast.error("Could not detect location. Please search and select your city.");
  };

  const handleSelectCity = (cityName: string) => {
    setCity(cityName);
    setOpen(false);
    setSearch("");
    toast.success(`Location set to ${cityName}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      handleSelectCity(search.trim());
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs hover:bg-slate-100/80 px-2.5 ml-1 rounded-full border border-slate-200/60 bg-white/70 shadow-2xs focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none outline-none"
        >
          <MapPin className="h-3.5 w-3.5 text-brand-action shrink-0" />
          <div className="text-left hidden sm:block">
            <span className="block text-[9px] uppercase tracking-wider font-semibold text-muted-foreground leading-none">MY LOCATION</span>
            <span className={cn("block text-xs font-bold leading-tight truncate max-w-[115px]", city ? "text-foreground" : "text-brand-action")}>
              {isDetecting ? "Detecting..." : label}
            </span>
          </div>
          <span className={cn("sm:hidden text-xs font-bold truncate max-w-[80px]", city ? "text-foreground" : "text-brand-action")}>
            {isDetecting ? "..." : label}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80 p-2.5 space-y-2.5">
        {/* Detect Button */}
        <button
          type="button"
          onClick={handleDetect}
          disabled={isDetecting}
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-bold text-white bg-brand-action hover:bg-brand-action/90 rounded-lg shadow-2xs transition-all duration-200"
        >
          <span className="flex items-center gap-2">
            {isDetecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
            {isDetecting ? "Detecting location..." : "Detect my location"}
          </span>
          <span className="text-[10px] font-normal bg-white/20 px-1.5 py-0.5 rounded">GPS / Auto</span>
        </button>

        {/* Current status tag */}
        {city && (
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-md text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1.5 truncate mr-1">
              {source === "gps" ? (
                <Radio className="h-3 w-3 text-emerald-500 shrink-0" />
              ) : source === "ip" ? (
                <Globe className="h-3 w-3 text-blue-500 shrink-0" />
              ) : (
                <MapPin className="h-3 w-3 text-brand-action shrink-0" />
              )}
              <span className="shrink-0">{source === "gps" ? "GPS:" : source === "ip" ? "Network:" : "Selected:"}</span>
              <strong className="text-foreground font-semibold truncate">{city}</strong>
            </span>
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded shrink-0">
              Active
            </span>
          </div>
        )}

        {/* Permission tip if blocked in browser */}
        {permission === "denied" && (
          <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200/70 p-2 text-amber-900">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-tight">
              Browser GPS is blocked in site settings. Click the lock icon in the address bar to allow exact GPS, or search your city below.
            </p>
          </div>
        )}

        {/* Live Search Input */}
        <div className="pt-1">
          <form onSubmit={handleSearchSubmit} className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search city, town, or area (e.g. Neyyattinkara)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-muted/50 border border-border rounded-md focus:outline-hidden focus:ring-1 focus:ring-brand-action"
            />
            {isSearchingApi && (
              <Loader2 className="absolute right-2.5 top-2.5 h-3.5 w-3.5 animate-spin text-muted-foreground" />
            )}
          </form>

          {/* Real-time API Suggestions */}
          {search.trim().length >= 2 && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-brand-action" /> Suggestions
              </span>
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {suggestions.map((item, idx) => (
                  <button
                    key={`${item.name}-${idx}`}
                    type="button"
                    onClick={() => handleSelectCity(item.name)}
                    className="flex w-full items-start justify-between px-2.5 py-1.5 text-xs rounded-md hover:bg-muted text-foreground transition-colors text-left"
                  >
                    <div>
                      <span className="font-semibold block text-xs">{item.name}</span>
                      {item.state && (
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {[item.state, item.country].filter(Boolean).join(", ")}
                        </span>
                      )}
                    </div>
                    {city?.toLowerCase() === item.name.toLowerCase() && (
                      <Check className="h-3.5 w-3.5 text-brand-action shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}

                {/* Direct use option if typed custom name */}
                {search.trim() && !suggestions.some((s) => s.name.toLowerCase() === search.trim().toLowerCase()) && (
                  <button
                    type="button"
                    onClick={() => handleSelectCity(search.trim())}
                    className="flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-brand-action font-semibold hover:bg-brand-action/10"
                  >
                    <span>Use &quot;{search.trim()}&quot;</span>
                    <Check className="h-3.5 w-3.5 text-brand-action" />
                  </button>
                )}
              </div>
            </div>
          )}

          {search.trim().length < 2 && (
            <p className="px-1 py-1 text-[11px] text-muted-foreground">
              Type at least 2 characters to search any city, town, or area in India.
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
