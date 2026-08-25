"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 as CheckCircle2Icon, Building2 as BuildingIcon } from "lucide-react";
import { CartLine } from "./booking-types";
import { CourierAddressCard } from "./CourierAddressCard";

interface BookingStep5ConfirmationProps {
  orderId: string;
  selectedLab: string | null;
  eligibleLabs: any[];
  items: CartLine[];
  subtotal: number;
  gst: number;
  total: number;
  calculateItemPrice: (item: CartLine) => number;
}

export function BookingStep5Confirmation({
  orderId,
  selectedLab,
  eligibleLabs,
  items,
  subtotal,
  gst,
  total,
  calculateItemPrice,
}: BookingStep5ConfirmationProps) {
  const router = useRouter();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-1000 space-y-8 py-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-lg bg-litmus-mint/30 text-litmus-teal mb-2 relative">
          <div className="absolute inset-0 rounded-lg animate-ping bg-litmus-teal/20"></div>
          <CheckCircle2Icon className="h-10 w-10 relative z-10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto text-sm">
            Thank you for choosing Litmus Food Analytics. Your order{" "}
            <span className="text-slate-900 font-bold font-mono">
              #{orderId.substring(orderId.length - 8).toUpperCase()}
            </span>{" "}
            has been received.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <Card className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
            <span className="font-bold text-[10px] uppercase tracking-widest opacity-80">Order Details</span>
            <Badge className="bg-white/20 text-white border-0 font-bold text-[10px]">Confirmed</Badge>
          </div>
          <CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
                <p className="font-bold text-slate-900 text-base font-mono">BKG-{orderId.substring(orderId.length - 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</p>
                <p className="font-bold text-slate-900 text-sm">{new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3 text-sm uppercase tracking-wide">
                <BuildingIcon className="h-4 w-4 text-brand-action" /> Fulfilment Partner
              </h4>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                {selectedLab === "admin" ? (
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-sm">Litmus Smart Allocation</p>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">Our team will assign the best lab within 2 hours.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-sm">
                      {eligibleLabs?.find((l: any) => l._id === selectedLab)?.labName || "Selected Laboratory"}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium">Lab has been notified.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden h-fit">
          <div className="bg-slate-50 border-b border-slate-200 p-4">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Final Billing</h4>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 p-5 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{item.product} Panel</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {item.samples.reduce((acc, s) => acc + s.selectedParameters.length, 0)} Tests
                    </p>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">₹{calculateItemPrice(item).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500">GST (18%)</span>
                <span className="text-slate-900">₹{gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 mt-1">
                <span className="font-bold text-slate-900">Total Paid</span>
                <span className="font-bold text-brand-action text-xl tracking-tight">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-5xl mx-auto">
        <CourierAddressCard orderId={`BKG-${orderId.substring(orderId.length - 8).toUpperCase()}`} />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center py-6">
        <Button onClick={() => router.push("/orders")} className="w-full sm:w-auto h-12 px-10 rounded-lg bg-brand-action hover:bg-brand-action-hover text-white font-bold">
          Track My Order
        </Button>
        <Button variant="outline" onClick={() => router.push("/home")} className="w-full sm:w-auto h-12 px-10 rounded-lg font-bold text-slate-600 border-slate-200 hover:bg-slate-50">
          Return to Home
        </Button>
      </div>
    </div>
  );
}
