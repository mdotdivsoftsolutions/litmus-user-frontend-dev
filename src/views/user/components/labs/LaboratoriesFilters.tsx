"use client";

import { Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const cities = ["Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

interface LaboratoriesFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  cityFilter: string;
  setCityFilter: (val: string) => void;
  accreditationFilter: string;
  setAccreditationFilter: (val: string) => void;
  view: "grid" | "list";
  setView: (val: "grid" | "list") => void;
}

export function LaboratoriesFilters({
  search,
  setSearch,
  cityFilter,
  setCityFilter,
  accreditationFilter,
  setAccreditationFilter,
  view,
  setView,
}: LaboratoriesFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search labs by name or city..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Select value={cityFilter} onValueChange={setCityFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={accreditationFilter} onValueChange={setAccreditationFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Accreditation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="nabl">NABL Accredited</SelectItem>
          <SelectItem value="fssai">FSSAI Approved</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-1 shrink-0">
        <Button variant={view === "grid" ? "default" : "outline"} size="icon" onClick={() => setView("grid")}>
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button variant={view === "list" ? "default" : "outline"} size="icon" onClick={() => setView("list")}>
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
