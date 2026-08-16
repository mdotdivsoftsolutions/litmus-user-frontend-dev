"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock as LockIcon } from "lucide-react";
import { CartLine } from "./booking-types";

interface BookingStep4PaymentProps {
  items: CartLine[];
  calculateItemPrice: (item: CartLine) => number;
}

export function BookingStep4Payment({ items, calculateItemPrice }: BookingStep4PaymentProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Secure Payment</h1>
        <p className="text-slate-500 text-sm font-medium">Your transaction is encrypted and secured.</p>
      </div>

      <Card className="rounded-lg border border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
          <h4 className="font-bold text-slate-900 text-sm uppercase">Order Summary</h4>
          <Badge className="bg-brand-action/10 text-brand-action border-0 font-bold">{items.length} Products</Badge>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="px-5 py-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                <div>
                  <p className="font-bold text-slate-900">{item.product} Panel</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    {item.samples.reduce((acc, s) => acc + s.selectedParameters.length, 0)} Critical Parameters ({item.samples.length} Products)
                  </p>
                </div>
                <p className="font-bold text-slate-900">₹{calculateItemPrice(item).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <LockIcon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">Encrypted Transaction</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  We use industry-standard 256-bit SSL encryption. We do not store your full card details.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
