"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight as ArrowRightIcon, ChevronLeft as ChevronLeftIcon, Shield as ShieldIcon } from "lucide-react";
import { CartLine } from "./booking-types";

interface BookingSidebarSummaryProps {
  step: number;
  items: CartLine[];
  subtotal: number;
  totalMrp: number;
  discount: number;
  gst: number;
  total: number;
  selectedLab: string | null;
  canProceedSampleDetails: boolean;
  isStep3Valid: boolean;
  isCreatingBooking: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function BookingSidebarSummary({
  step,
  items,
  subtotal,
  totalMrp,
  discount,
  gst,
  total,
  selectedLab,
  canProceedSampleDetails,
  isStep3Valid,
  isCreatingBooking,
  onNext,
  onBack,
}: BookingSidebarSummaryProps) {
  if (step >= 5) return null;

  return (
    <div className="lg:col-span-4">
      <div className="lg:sticky lg:top-28 space-y-4">
        <Card className="rounded-lg shadow-sm border border-slate-100 overflow-hidden bg-white">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xl tracking-tight">Order Summary</h3>
              <Badge className="bg-slate-100 text-slate-600 border-0 font-bold px-3 py-1">{items.length} Products</Badge>
            </div>
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
                <span className="text-slate-400">Total MRP</span>
                <span className="text-slate-800">₹{totalMrp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
                <span className="text-litmus-teal">Litmus Discount</span>
                <span className="text-litmus-teal">- ₹{discount.toLocaleString()}</span>
              </div>
              {step >= 4 && (
                <div className="flex justify-between text-xs font-bold uppercase tracking-wide pt-2 border-t border-dashed border-slate-200">
                  <span className="text-slate-400">GST (18%)</span>
                  <span className="text-slate-800">+ ₹{gst.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-4 mt-1 flex flex-col gap-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-900 font-bold text-lg">Total Amount</span>
                  <span className="text-2xl font-bold text-brand-action tracking-tight">
                    ₹{step >= 4 ? total.toLocaleString() : subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">Inc. of all taxes</p>
              </div>
            </div>
            <div className="pt-3 space-y-2">
              {step === 0 && (
                <Button
                  disabled={items.length === 0 || !items.every((item) => item.samples.length > 0)}
                  onClick={onNext}
                  className="w-full bg-brand-action hover:bg-brand-action-hover text-white rounded-lg h-14 font-bold text-base group transition-all"
                >
                  Describe samples &amp; scope <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
              {step === 1 && (
                <>
                  <Button
                    disabled={!canProceedSampleDetails}
                    onClick={onNext}
                    className="w-full bg-brand-action hover:bg-brand-action-hover text-white rounded-lg h-14 font-bold text-base group transition-all"
                  >
                    Select lab partner <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  {!canProceedSampleDetails && items.length > 0 && (
                    <p className="text-[11px] text-center text-slate-500 px-1 leading-snug">Please fill in at least one field to proceed.</p>
                  )}
                </>
              )}
              {step === 2 && (
                <Button
                  disabled={!selectedLab}
                  onClick={onNext}
                  className="w-full bg-brand-action hover:bg-brand-action-hover text-white rounded-lg h-14 font-bold text-base group transition-all"
                >
                  Enter collection details <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
              {step === 3 && (
                <Button
                  disabled={!isStep3Valid}
                  onClick={onNext}
                  className="w-full bg-brand-action hover:bg-brand-action-hover text-white rounded-lg h-14 font-bold text-base group transition-all disabled:opacity-50"
                >
                  Proceed to payment <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
              {step === 4 && (
                <Button
                  disabled={isCreatingBooking}
                  onClick={onNext}
                  className="w-full bg-slate-900 hover:bg-black text-white rounded-lg h-14 font-bold text-base transition-all"
                >
                  {isCreatingBooking ? "Processing..." : `Pay Now ₹${total.toLocaleString()}`}
                </Button>
              )}
              {step > 0 && (
                <Button variant="ghost" onClick={onBack} className="w-full h-10 rounded-lg text-slate-400 hover:text-slate-800 font-bold text-sm">
                  <ChevronLeftIcon className="mr-1 h-4 w-4" /> Back
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-litmus-mint/30 text-litmus-teal flex items-center justify-center shrink-0">
              <ShieldIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Litmus Protected</p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">100% Secure Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
