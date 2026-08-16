"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList as ClipboardListIcon,
  Trash2 as TrashIcon,
  Clock as ClockIcon,
  Info as InfoIcon,
  Loader2,
} from "lucide-react";
import { CartLine } from "./booking-types";

interface BookingStep0ReviewProps {
  items: CartLine[];
  dataLoaded: boolean;
  isCartLoading: boolean;
  isTestLoading: boolean;
  isPackageLoading: boolean;
  removeItem: (id: string) => void;
  calculateItemPrice: (item: CartLine) => number;
  calculateItemMrp: (item: CartLine) => number;
}

export function BookingStep0Review({
  items,
  dataLoaded,
  isCartLoading,
  isTestLoading,
  isPackageLoading,
  removeItem,
  calculateItemPrice,
  calculateItemMrp,
}: BookingStep0ReviewProps) {
  const isLoading = !dataLoaded || isCartLoading || isTestLoading || isPackageLoading;

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Review Selected Tests</h1>
        <p className="text-slate-500 text-sm font-medium">
          Verify or edit parameters here; next you&apos;ll describe each sample and exactly what needs testing.
        </p>
      </div>

      {isLoading ? (
        <Card className="rounded-lg border-2 border-slate-100 bg-white/50 p-12 text-center flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-action mb-4" />
          <p className="text-slate-500 font-medium">Loading your selection...</p>
        </Card>
      ) : items.length === 0 ? (
        <Card className="rounded-lg border-dashed border-2 border-slate-200 bg-white/50 p-12 text-center">
          <div className="bg-slate-100 h-20 w-20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ClipboardListIcon className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your selection is empty</h3>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">Looks like you haven&apos;t added any tests yet.</p>
          <Button asChild className="mt-6 bg-brand-action hover:bg-brand-action-hover rounded-lg px-8 h-12 font-bold">
            <Link href="/tests">Browse All Tests</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const price = calculateItemPrice(item);
            const mrp = calculateItemMrp(item);
            const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

            return (
              <Card key={item.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-accent/30 transition-all duration-300 shadow-sm">
                <CardContent className="p-0">
                  <div className="flex flex-col">
                    <div className="p-5 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <Badge className="bg-emerald-50 text-brand-primary border-0 mb-1 font-bold uppercase tracking-wider text-[10px]">
                            {item.category}
                          </Badge>
                          <h3 className="font-bold text-lg text-slate-900">{item.product} Test Panel</h3>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <InfoIcon className="h-4 w-4 text-litmus-teal" /> {item.availableParameters?.length || 0} available parameters
                            </span>
                            <span className="flex items-center gap-1.5">
                              <ClockIcon className="h-4 w-4 text-brand-action" /> {item.testObj?.turnAroundTime || '3-5 Days'} TAT
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">Samples and testing parameters are configured in the next step.</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg h-9 w-9">
                          <TrashIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border-t border-slate-100 px-5 py-4 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <p className="font-bold text-slate-900 text-xl">₹{price.toLocaleString()}</p>
                        <span className="text-xs text-slate-400 line-through">₹{mrp.toLocaleString()}</span>
                      </div>
                      {discountPercent > 0 && (
                        <Badge className="bg-litmus-mint/30 text-litmus-teal border-0 font-bold text-[10px] uppercase">
                          {discountPercent}% Discount Applied
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
