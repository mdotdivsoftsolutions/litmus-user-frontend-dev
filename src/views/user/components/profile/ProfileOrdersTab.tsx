"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { MapPin, FlaskConical, ChevronRight, Loader2, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "@/lib/api/booking";

export function ProfileOrdersTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["myBookings"],
    queryFn: bookingApi.getMyBookings,
  });

  const apiBookings = data?.data || [];

  const formattedBookings = apiBookings.map((b: any) => {
    const products = new Set<string>();
    let totalSamples = 0;

    b.items?.forEach((item: any) => {
      if (item.testId?.testName) products.add(item.testId.testName);
      else if (item.packageId?.name) products.add(item.packageId.name);
      else if (item.samples?.[0]?.productName) products.add(item.samples[0].productName);
      totalSamples += item.samples?.length || 0;
    });

    const productNames = Array.from(products);
    const mainProduct =
      productNames.length > 0
        ? productNames[0] + (productNames.length > 1 ? ` + ${productNames.length - 1} more` : "")
        : "Custom Testing";

    return {
      id: `#LTMS-${b._id.slice(-6).toUpperCase()}`,
      originalId: b._id,
      date: new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      product: mainProduct,
      testsCount: totalSamples,
      lab: b.labId?.labName || "Litmus Partner Lab",
      status: b.status.charAt(0) + b.status.slice(1).toLowerCase(),
      amount: b.totalAmount || b.items?.reduce((acc: number, item: any) => acc + item.price, 0) || 0,
      isCourier: (b.collectionMethod || b.metadata?.collectionMethod) === "COURIER",
      hasTracking: Boolean(b.courierDetails?.trackingId),
    };
  });

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm space-y-4">
      <div className="pb-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Order History</h2>
        <p className="text-sm text-muted-foreground">Track bookings, lab assignment, and reports.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-brand-action" />
        </div>
      ) : formattedBookings.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No orders yet.</p>
      ) : (
        <div className="grid gap-3">
          {formattedBookings.map((b: any) => (
            <Link
              href={`/orders/${b.originalId}`}
              key={b.originalId}
              className="block rounded-xl border border-border bg-slate-50/50 hover:bg-muted transition-colors p-4"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="shrink-0 space-y-0.5 w-28">
                  <p className="text-xs font-mono font-medium text-muted-foreground">{b.id}</p>
                  <p className="text-xs text-muted-foreground">{b.date}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{b.product}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FlaskConical className="h-3.5 w-3.5" /> {b.testsCount} Tests
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5" /> {b.lab}
                    </span>
                  </div>
                  {b.isCourier && (
                    <p className={cn("mt-1 text-[11px] font-semibold", b.hasTracking ? "text-emerald-700" : "text-brand-action")}>
                      {b.hasTracking ? "Courier tracking submitted" : "Add courier tracking ID"}
                    </p>
                  )}
                </div>
                <StatusBadge status={b.status} />
                <span className="font-bold text-foreground text-sm shrink-0">₹{b.amount.toLocaleString()}</span>
                {b.isCourier && !b.hasTracking ? (
                  <Truck className="h-4 w-4 text-brand-action shrink-0 hidden md:block" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 hidden md:block" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="pt-2">
        <Button asChild variant="outline" className="h-9 rounded-lg text-xs">
          <Link href="/orders">Open full order history</Link>
        </Button>
      </div>
    </div>
  );
}
