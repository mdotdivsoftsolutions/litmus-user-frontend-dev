"use client";

import { BadgePercent, Receipt } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BookingPricing {
  mrpTotal?: number;
  catalogDiscount?: number;
  subtotal?: number;
  specialDiscount?: { discountType?: "FLAT" | "PERCENTAGE"; value?: number; amount?: number };
  taxableAmount?: number;
  gstRate?: number;
  gstAmount?: number;
}

function Row({ label, value, highlight }: { label: React.ReactNode; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-sm ${highlight ? "text-emerald-700 font-semibold bg-emerald-50 -mx-2 px-2 py-1.5 rounded-md" : "text-slate-700"}`}>
      <span className="flex items-center gap-1.5">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

/** Itemised price for bookings that store a pricing breakdown (e.g. booked with Litmus support). */
export function OrderPriceBreakdown({ pricing, totalAmount }: { pricing?: BookingPricing; totalAmount?: number }) {
  if (!pricing || pricing.subtotal == null) return null;
  const special = pricing.specialDiscount;
  const gstPercent = Math.round((pricing.gstRate ?? 0.18) * 100);

  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm max-w-xl">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Receipt className="h-4 w-4 text-accent" /> Price Details
      </h3>
      <div className="space-y-2">
        {pricing.mrpTotal != null && <Row label="Total MRP" value={`₹${formatCurrency(pricing.mrpTotal)}`} />}
        {(pricing.catalogDiscount ?? 0) > 0 && <Row label="Discount" value={`− ₹${formatCurrency(pricing.catalogDiscount)}`} />}
        <Row label="Subtotal" value={`₹${formatCurrency(pricing.subtotal)}`} />
        {(special?.amount ?? 0) > 0 && (
          <Row
            highlight
            label={
              <>
                <BadgePercent className="h-4 w-4" />
                Litmus Special Discount{special?.discountType === "PERCENTAGE" ? ` (${special.value}%)` : ""}
              </>
            }
            value={`− ₹${formatCurrency(special?.amount)}`}
          />
        )}
        <Row label={`GST (${gstPercent}%)`} value={`₹${formatCurrency(pricing.gstAmount)}`} />
        <div className="border-t border-border pt-2 flex items-center justify-between">
          <span className="font-bold text-foreground">Total Amount</span>
          <span className="font-bold text-foreground text-lg tabular-nums">₹{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
