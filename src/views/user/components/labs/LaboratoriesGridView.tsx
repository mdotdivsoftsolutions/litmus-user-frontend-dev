"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star } from "lucide-react";

interface LaboratoriesGridViewProps {
  labs: any[];
  isLoading: boolean;
}

export function LaboratoriesGridView({ labs, isLoading }: LaboratoriesGridViewProps) {
  const getLowestPrice = (pricing?: Record<string, number>) => {
    if (!pricing || Object.keys(pricing).length === 0) return "N/A";
    return `₹${Math.min(...Object.values(pricing))}`;
  };

  const getRating = (reviews?: any[]) => {
    if (!reviews || reviews.length === 0) return "New";
    return (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-5 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full ml-auto" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (labs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-xl bg-white shadow-sm border-dashed">
        No laboratories found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {labs.map((lab: any) => (
        <Card key={lab._id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-foreground line-clamp-1" title={lab.labName}>
              {lab.labName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {lab.location?.city || "Unknown"}
            </div>
            <div className="flex items-center gap-2">
              {lab.isNablAccredited && <Badge variant="nabl">NABL</Badge>}
              {lab.isFssaiApproved && <Badge variant="fssai">FSSAI</Badge>}
              <div className="ml-auto flex items-center gap-1 shrink-0">
                <Star className="h-3.5 w-3.5 fill-status-pending text-status-pending" />
                <span className="text-sm font-medium">{getRating(lab.reviews)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">From {getLowestPrice(lab.pricing)}</span>
              <Button size="sm" asChild className="bg-primary hover:bg-primary-deep">
                <Link href={`/labs/${lab._id}`}>View Lab</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
