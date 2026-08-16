"use client";

import { FlaskConical, MapPin, CreditCard, Check, X } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { paymentStatusLabel } from "@/lib/payment-status";

interface OrderInfoCardsProps {
  mainProduct: string;
  totalSamples: number;
  labName?: string;
  labCity?: string;
  totalAmount?: number;
  paymentStatus?: string;
  bookingStatus?: string;
}

export function OrderInfoCards({
  mainProduct,
  totalSamples,
  labName,
  labCity,
  totalAmount = 0,
  paymentStatus,
  bookingStatus,
}: OrderInfoCardsProps) {
  const label = paymentStatusLabel(paymentStatus, bookingStatus);
  const isPaid = label === "Paid";
  const isFailed = label === "Failed";

  return (
    <div className="grid md:grid-cols-3 gap-4 items-stretch">
      <div className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <FlaskConical className="h-4 w-4 text-accent" /> Order Summary
        </h3>
        <p className="font-semibold text-foreground text-sm leading-snug">{mainProduct}</p>
        <p className="text-xs text-muted-foreground mt-auto pt-2">{totalSamples} Samples Total</p>
      </div>

      <div className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-accent" /> Laboratory
        </h3>
        <p className="font-semibold text-foreground text-sm leading-snug">{labName || "Litmus Facility"}</p>
        <p className="text-xs text-muted-foreground mt-auto pt-2">{labCity || "Partner Lab"}</p>
      </div>

      <div className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <CreditCard className="h-4 w-4 text-accent" /> Payment
        </h3>
        <p className="font-bold text-foreground text-xl">₹{formatCurrency(totalAmount)}</p>
        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Inclusive of GST</p>
        <div
          className={cn(
            "mt-3 inline-flex w-fit items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase",
            isPaid && "bg-litmus-mint text-litmus-dark",
            isFailed && "bg-flame-red-tint text-primary",
            !isPaid && !isFailed && "bg-flame-red-tint text-primary"
          )}
        >
          {isPaid && <Check className="h-3 w-3" />}
          {isFailed && <X className="h-3 w-3" />}
          {label}
        </div>
      </div>
    </div>
  );
}
