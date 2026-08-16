"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { labApi } from "@/lib/api/lab";
import { LaboratoriesFilters } from "./components/labs/LaboratoriesFilters";
import { LaboratoriesGridView } from "./components/labs/LaboratoriesGridView";
import { LaboratoriesTableView } from "./components/labs/LaboratoriesTableView";

export default function LaboratoriesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [accreditationFilter, setAccreditationFilter] = useState("all");

  const { data: response, isLoading } = useQuery({
    queryKey: ["publicLabs"],
    queryFn: () => labApi.getLabsPublic(),
  });

  const labs = response?.data || [];

  const filtered = labs.filter((lab: any) => {
    const matchesSearch =
      !search ||
      lab.labName.toLowerCase().includes(search.toLowerCase()) ||
      lab.location?.city?.toLowerCase().includes(search.toLowerCase());
    const matchesCity = cityFilter === "all" || lab.location?.city === cityFilter;
    const matchesAccreditation =
      accreditationFilter === "all" ||
      (accreditationFilter === "nabl" && lab.isNablAccredited) ||
      (accreditationFilter === "fssai" && lab.isFssaiApproved);

    return matchesSearch && matchesCity && matchesAccreditation;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Laboratories</h1>

      <LaboratoriesFilters
        search={search}
        setSearch={setSearch}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        accreditationFilter={accreditationFilter}
        setAccreditationFilter={setAccreditationFilter}
        view={view}
        setView={setView}
      />

      {view === "grid" ? (
        <LaboratoriesGridView labs={filtered} isLoading={isLoading} />
      ) : (
        <LaboratoriesTableView labs={filtered} isLoading={isLoading} />
      )}
    </div>
  );
}
