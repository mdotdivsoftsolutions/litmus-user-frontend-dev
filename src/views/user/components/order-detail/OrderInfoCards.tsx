"use client";

import { FlaskConical, MapPin, CreditCard, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderInfoCardsProps {
  mainProduct: string;
  totalSamples: number;
  labName?: string;
  labCity?: string;
  totalAmount?: number;
  paymentStatus?: string;
}

export function OrderInfoCards({
  mainProduct,
  totalSamples,
  labName,
  labCity,
  totalAmount = 0,
  paymentStatus,
}: OrderInfoCardsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <FlaskConical className="h-4 w-4 text-accent" /> Order Summary
        </h3>
        <p className="font-semibold text-foreground text-sm">{mainProduct}</p>
        <p className="text-xs text-muted-foreground mt-1">{totalSamples} Samples Total</p>
      </div>

      <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-accent" /> Laboratory
        </h3>
        <p className="font-semibold text-foreground text-sm">{labName || "Litmus Facility"}</p>
        <p className="text-xs text-muted-foreground mt-1">{labCity || "Partner Lab"}</p>
      </div>

      <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <CreditCard className="h-4 w-4 text-accent" /> Payment
        </h3>
        <p className="font-bold text-foreground text-xl mb-1">₹{totalAmount.toLocaleString()}</p>
        <div
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase",
            paymentStatus === "COMPLETED" ? "bg-litmus-mint text-litmus-dark" : "bg-flame-red-tint text-primary"
          )}
        >
          {paymentStatus === "COMPLETED" && <Check className="h-3 w-3" />}
          {paymentStatus === "COMPLETED" ? "Paid" : "Pending"}
        </div>
      </div>
    </div>
  );
}
