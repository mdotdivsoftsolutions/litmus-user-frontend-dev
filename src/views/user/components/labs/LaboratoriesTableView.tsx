"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";

interface LaboratoriesTableViewProps {
  labs: any[];
  isLoading: boolean;
}

export function LaboratoriesTableView({ labs, isLoading }: LaboratoriesTableViewProps) {
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
      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lab Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Accreditation</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Price From</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lab Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Accreditation</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Price From</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labs.map((lab: any) => (
            <TableRow key={lab._id}>
              <TableCell className="font-medium max-w-[200px] truncate" title={lab.labName}>
                {lab.labName}
              </TableCell>
              <TableCell>{lab.location?.city || "Unknown"}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {lab.isNablAccredited && <Badge variant="nabl">NABL</Badge>}
                  {lab.isFssaiApproved && <Badge variant="fssai">FSSAI</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-status-pending text-status-pending" />
                  {getRating(lab.reviews)}
                </div>
              </TableCell>
              <TableCell>{getLowestPrice(lab.pricing)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary-deep hover:bg-primary/10">
                  <Link href={`/labs/${lab._id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
