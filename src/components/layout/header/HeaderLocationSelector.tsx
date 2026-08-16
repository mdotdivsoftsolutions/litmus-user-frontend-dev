"use client";

import { MapPin, ChevronDown, Loader2, Navigation, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useUserLocation } from "@/components/location/LocationContext";
import { toast } from "sonner";

export function HeaderLocationSelector() {
  const { city, permission, isDetecting, detectLocation } = useUserLocation();
  const label = city || "Set location";

  const handleDetect = async () => {
    const ok = await detectLocation();
    if (ok) {
      toast.success("Location updated");
      return;
    }
    toast.error("Could not detect location. Allow it in the browser address bar, then tap Detect again.");
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-xs hover:bg-transparent px-2 ml-1">
          <MapPin className="h-3.5 w-3.5 text-brand-action" />
          <div className="text-left hidden sm:block">
            <span className="block text-[10px] text-muted-foreground leading-none">MY LOCATION</span>
            <span className={cn("block text-sm font-semibold leading-tight", city ? "text-foreground" : "text-brand-action")}>
              {isDetecting ? "Detecting..." : label}
            </span>
          </div>
          <span className={cn("sm:hidden text-sm font-semibold", city ? "text-foreground" : "text-brand-action")}>
            {isDetecting ? "..." : label}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <button
          type="button"
          onClick={handleDetect}
          disabled={isDetecting}
          className="flex w-full items-center gap-2 px-2 py-2 text-sm font-semibold text-brand-action hover:bg-muted rounded-sm"
        >
          {isDetecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
          {isDetecting ? "Detecting location..." : "Detect my location"}
        </button>

        {city ? (
          <p className="px-2 pb-2 text-[11px] text-muted-foreground">
            Using GPS: <span className="font-semibold text-foreground">{city}</span>
          </p>
        ) : (
          <p className="px-2 pb-2 text-[11px] text-muted-foreground">
            Location is detected from your device. No city list.
          </p>
        )}

        {permission === "denied" && (
          <div className="mx-2 mb-2 mt-1 flex items-start gap-2 rounded-md bg-amber-50 border border-amber-100 p-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug text-amber-800">
              Browser blocked location. Click the lock icon in the address bar, allow location, then tap Detect again.
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
