"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { MapPin, Download, Search, FlaskConical, ChevronRight, Truck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "@/lib/api/booking";
import { useDebounce } from "@/hooks/use-debounce";
import { ListPagination } from "@/components/common/ListPagination";
import { OrderListSkeleton } from "./components/list-skeletons";
import { toast } from "sonner";

const tabs = ["All Orders", "Active", "Completed", "Reports Ready"] as const;
const PAGE_SIZE = 10;

const tabToStatus: Record<(typeof tabs)[number], string> = {
  "All Orders": "all",
  Active: "active",
  Completed: "completed",
  "Reports Ready": "reports",
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 350);

  const { data, isPending } = useQuery({
    queryKey: ["myBookings", page, PAGE_SIZE, debouncedSearch, tabToStatus[activeTab]],
    queryFn: () =>
      bookingApi.getMyBookings({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: tabToStatus[activeTab],
      }),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const apiBookings = data?.data || [];
  const pages = data?.pages || 1;
  const currentPage = data?.page || page;

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
      status: String(b.status || "")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c: string) => c.toUpperCase()),
      amount: b.totalAmount || b.items?.reduce((acc: number, item: any) => acc + item.price, 0) || 0,
      reportUrl: b.reportFiles?.[0],
      isCourier: (b.collectionMethod || b.metadata?.collectionMethod) === "COURIER",
      hasTracking: Boolean(b.courierDetails?.trackingId),
    };
  });

  const handleDownloadReport = async (e: React.MouseEvent, bookingId: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (downloadingId) return;
    setDownloadingId(bookingId);
    try {
      const blob = await bookingApi.downloadReport(bookingId);
      if (blob.type === "application/json") throw new Error("unavailable");
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${name.replace(/[^\w.-]+/g, "-")}-report`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    } catch {
      toast.error("Report is not available yet.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-16 md:pb-20 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order History</h1>
          <p className="text-sm text-muted-foreground">
            Track progress, view lab assignment, and open reports — search by order ID or test name.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search ID or Test..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="h-10 pl-9 rounded-lg bg-transparent border-border shadow-none"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={cn(
              "shrink-0 px-4 py-2 text-sm font-semibold transition-colors border-b-2",
              activeTab === tab
                ? "border-brand-action text-brand-action"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {isPending ? (
        <OrderListSkeleton />
      ) : (
        <div className="grid gap-3">
          {formattedBookings.map((b: any) => (
            <Link
              href={`/orders/${b.originalId}`}
              key={b.originalId}
              className="block bg-card rounded-xl border border-border shadow-sm hover:border-accent transition-colors p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
            >
              <div className="flex-1 min-w-0 w-full flex flex-col md:flex-row gap-4 md:items-center">
                <div className="shrink-0 space-y-1 w-24">
                  <p className="text-xs font-mono font-medium text-muted-foreground">{b.id}</p>
                  <p className="text-xs text-muted-foreground">{b.date}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground truncate">{b.product}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FlaskConical className="h-3.5 w-3.5" /> {b.testsCount} Tests
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5" /> {b.lab}
                    </span>
                  </div>
                  {b.isCourier && (
                    <p className={cn("mt-1.5 text-[11px] font-semibold", b.hasTracking ? "text-emerald-700" : "text-brand-action")}>
                      {b.hasTracking ? "Courier tracking submitted" : "Add courier tracking ID"}
                    </p>
                  )}
                </div>

                <div className="shrink-0 w-32">
                  <StatusBadge status={b.status} />
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-between w-full md:w-auto md:gap-6 border-t md:border-t-0 border-border pt-3 md:pt-0">
                <span className="font-bold text-foreground text-lg w-20 md:text-right">₹{b.amount.toLocaleString()}</span>

                {b.reportUrl ? (
                  <Button
                    size="sm"
                    onClick={(e) => handleDownloadReport(e, b.originalId, b.product)}
                    disabled={downloadingId === b.originalId}
                    className="bg-brand-action hover:bg-brand-action-hover text-white h-8 rounded-lg gap-1.5 text-xs"
                  >
                    {downloadingId === b.originalId ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    Report
                  </Button>
                ) : b.status === "Completed" ? (
                  <ChevronRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                ) : b.isCourier && !b.hasTracking ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-action">
                    <Truck className="h-3.5 w-3.5" /> Tracking
                  </span>
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                )}
              </div>
            </Link>
          ))}

          {formattedBookings.length === 0 && (
            <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-border">
              <p className="text-muted-foreground text-sm">No orders found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      <ListPagination page={currentPage} pages={pages} onPageChange={setPage} />
    </div>
  );
}
