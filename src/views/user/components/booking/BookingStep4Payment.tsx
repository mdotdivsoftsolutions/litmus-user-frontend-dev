"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock as LockIcon, AlertCircle, ShieldCheck, CreditCard, Smartphone, Building2 } from "lucide-react";
import { CartLine } from "./booking-types";

interface BookingStep4PaymentProps {
  items: CartLine[];
  calculateItemPrice: (item: CartLine) => number;
  paymentError?: string | null;
  isPaymentProcessing?: boolean;
  total?: number;
}

const PAYMENT_METHODS = [
  { icon: CreditCard, label: "Credit / Debit Cards" },
  { icon: Smartphone, label: "UPI & Wallets" },
  { icon: Building2, label: "Net Banking" },
];

export function BookingStep4Payment({
  items,
  calculateItemPrice,
  paymentError,
  isPaymentProcessing,
  total,
}: BookingStep4PaymentProps) {
  return (
    <div className="space-y-5 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Secure Payment</h1>
        <p className="text-slate-500 text-sm font-medium">
          Your transaction is encrypted end-to-end. Amounts are verified server-side.
        </p>
      </div>

      {/* Payment Error Banner */}
      {paymentError && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3.5 animate-in fade-in duration-300">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">Payment Issue</p>
            <p className="text-sm text-red-600 font-medium mt-0.5">{paymentError}</p>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isPaymentProcessing && (
        <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3.5 animate-in fade-in duration-300">
          <span className="relative flex h-5 w-5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500"></span>
          </span>
          <p className="text-sm font-bold text-blue-700">Opening secure payment window...</p>
        </div>
      )}

      {/* Order Summary */}
      <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
          <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Order Summary</h4>
          <Badge className="bg-brand-action/10 text-brand-action border-0 font-bold">
            {items.length} Product{items.length !== 1 ? "s" : ""}
          </Badge>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="px-5 py-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors"
              >
                <div>
                  <p className="font-bold text-slate-900">{item.product} Panel</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    {item.samples.reduce((acc, s) => acc + s.selectedParameters.length, 0)} Parameters ·{" "}
                    {item.samples.length} Sample{item.samples.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <p className="font-bold text-slate-900">₹{calculateItemPrice(item).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Razorpay Section */}
          <div className="px-5 py-5 bg-gradient-to-br from-slate-50 to-blue-50 border-t border-slate-200 space-y-4">
            {/* Razorpay Branding */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Powered by</p>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-[#072654] flex items-center justify-center">
                  <span className="text-white font-black text-[8px]">R</span>
                </div>
                <span className="font-black text-sm text-[#072654]">Razorpay</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-600">{label}</span>
                </div>
              ))}
            </div>

            {/* Total to pay */}
            {total !== undefined && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-700">You will be charged</span>
                <span className="text-xl font-black text-brand-action">₹{total.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Security Footer */}
          <div className="px-5 py-4 bg-white border-t border-slate-100">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-900">256-bit SSL Encrypted</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Your card details are never stored on our servers. Payment amount is verified
                  server-side — it cannot be modified from the browser.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security trust indicators */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: LockIcon, text: "Secure Checkout" },
          { icon: ShieldCheck, text: "PCI DSS Compliant" },
          { icon: CreditCard, text: "No Data Stored" },
        ].map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 bg-white py-3.5 px-2 shadow-sm"
          >
            <Icon className="h-4 w-4 text-brand-action" />
            <span className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-wide">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
