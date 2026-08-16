"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function pageItems(page: number, pages: number): (number | "...")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "...", pages];
  if (page >= pages - 3) return [1, "...", pages - 4, pages - 3, pages - 2, pages - 1, pages];
  return [1, "...", page - 1, page, page + 1, "...", pages];
}

interface ListPaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export function ListPagination({ page, pages, onPageChange }: ListPaginationProps) {
  if (pages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1 pt-2" aria-label="Pagination">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-lg px-3"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      {pageItems(page, pages).map((item, i) =>
        item === "..." ? (
          <span key={`e-${i}`} className="px-2 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={item}
            type="button"
            variant={item === page ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-9 w-9 rounded-lg p-0",
              item === page && "bg-brand-action hover:bg-brand-action-hover text-white border-brand-action"
            )}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        )
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-lg px-3"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
