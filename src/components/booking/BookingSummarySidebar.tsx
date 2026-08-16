"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingSummarySidebarProps {
  itemsCount: number;
  totalMrp: number;
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  step: number;
  isNextDisabled: boolean;
  isCreatingBooking: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function BookingSummarySidebar({
  itemsCount,
  totalMrp,
  subtotal,
  discount,
  gst,
  total,
  step,
  isNextDisabled,
  isCreatingBooking,
  onNext,
  onBack,
}: BookingSummarySidebarProps) {
  const getNextLabel = () => {
    if (step === 0) return "Describe samples & scope";
    if (step === 1) return "Select lab partner";
    if (step === 2) return "Enter collection details";
    if (step === 3) return "Proceed to payment";
    if (step === 4) return isCreatingBooking ? "Processing..." : `Pay Now ₹${total.toLocaleString()}`;
    return "Next";
  };

  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      <Card className="rounded-2xl shadow-sm border border-slate-100 bg-white">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-slate-900 text-lg">Order Summary</h3>
            <Badge className="font-data-badge bg-slate-100 text-slate-600 border-0">{itemsCount} Products</Badge>
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-100 text-sm font-body">
            <div className="flex justify-between text-slate-500">
              <span>Total MRP</span>
              <span className="font-data font-medium text-slate-700">₹{totalMrp.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-brand-action font-semibold">
              <span>Litmus Discount</span>
              <span className="font-data text-emerald-600 font-bold">- ₹{discount.toLocaleString()}</span>
            </div>
            {step >= 4 && (
              <div className="flex justify-between text-slate-500 pt-2 border-t border-dashed border-slate-100">
                <span>GST (18%)</span>
                <span className="font-data font-medium text-slate-700">+ ₹{gst.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-heading font-bold text-base text-slate-900">Total Amount</span>
              <span className="font-data text-2xl font-bold text-brand-action">₹{(step >= 4 ? total : subtotal).toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              disabled={isNextDisabled || isCreatingBooking}
              onClick={onNext}
              className="w-full bg-brand-action hover:bg-brand-action-hover text-white rounded-xl h-12 font-body font-semibold text-base shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {getNextLabel()}
              {step < 4 && <ArrowRight className="h-4 w-4" />}
            </Button>

            {step > 0 && (
              <Button variant="ghost" onClick={onBack} className="w-full h-10 rounded-xl text-slate-500 hover:text-slate-900 font-body font-medium text-sm">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
        <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
        <div>
          <p className="font-heading text-xs font-bold text-emerald-950">Litmus Protected</p>
          <p className="font-body text-xs text-emerald-700 font-medium">100% Secure Checkout & Cold Chain Transit</p>
        </div>
      </div>
    </div>
  );
}
