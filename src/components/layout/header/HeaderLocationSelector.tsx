"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const cities = ["Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

interface HeaderLocationSelectorProps {
  city: string;
  setCity: (city: string) => void;
}

export function HeaderLocationSelector({ city, setCity }: HeaderLocationSelectorProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-xs hover:bg-transparent px-2 ml-1">
          <MapPin className="h-3.5 w-3.5 text-brand-action" />
          <div className="text-left hidden sm:block">
            <span className="block text-[10px] text-muted-foreground leading-none">MY LOCATION</span>
            <span className="block text-sm font-semibold text-foreground leading-tight">{city}</span>
          </div>
          <span className="sm:hidden text-sm font-semibold text-foreground">{city}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {cities.map((c) => (
          <DropdownMenuItem
            key={c}
            onClick={() => setCity(c)}
            className={cn(c === city && "bg-muted font-medium")}
          >
            {c}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
