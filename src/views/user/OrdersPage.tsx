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
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Order History
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track progress, view lab assignment, and open reports — search by order ID or test name.
          </p>
        </div>
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search ID or Test..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="h-10 pl-9 rounded-xl bg-white border-slate-200 shadow-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={cn(
              "shrink-0 px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all",
              activeTab === tab
                ? "bg-brand-action text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
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
              className="block bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-brand-action/30 hover:shadow-md transition-all p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div className="shrink-0 h-11 w-11 rounded-xl bg-brand-action/10 flex items-center justify-center">
                    <FlaskConical className="h-5 w-5 text-brand-action" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{b.product}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="font-mono font-medium text-slate-500">{b.id}</span>
                      <span className="flex items-center gap-1">
                        <FlaskConical className="h-3 w-3" /> {b.testsCount} Tests
                      </span>
                      <span className="flex items-center gap-1 truncate hidden sm:flex">
                        <MapPin className="h-3 w-3" /> {b.lab}
                      </span>
                    </div>
                    {b.isCourier && (
                      <p className={cn("mt-1.5 text-[11px] font-semibold", b.hasTracking ? "text-emerald-700" : "text-amber-700")}>
                        {b.hasTracking ? "✓ Courier tracking submitted" : "⚠ Add courier tracking ID"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">{b.date}</p>
                    <p className="font-bold text-slate-900 text-base">₹{b.amount.toLocaleString()}</p>
                  </div>

                  {b.reportUrl ? (
                    <Button
                      size="sm"
                      onClick={(e) => handleDownloadReport(e, b.originalId, b.product)}
                      disabled={downloadingId === b.originalId}
                      className="bg-brand-action hover:bg-brand-action-hover text-white h-9 rounded-xl gap-1.5 text-xs font-semibold px-4"
                    >
                      {downloadingId === b.originalId ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      Report
                    </Button>
                  ) : b.isCourier && !b.hasTracking ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                      <Truck className="h-3.5 w-3.5" /> Add Tracking
                    </span>
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </div>
            </Link>
          ))}

          {formattedBookings.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">No orders found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}

      <ListPagination page={currentPage} pages={pages} onPageChange={setPage} />
    </div>
  );
}
