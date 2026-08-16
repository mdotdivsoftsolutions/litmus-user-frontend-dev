"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Download, FileText, ChevronRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingApi } from "@/lib/api/booking";
import { formatBookingStatus, getOrderTimelineStep } from "@/lib/payment-status";
import { OrderTrackingTimeline } from "./components/order-detail/OrderTrackingTimeline";
import { OrderInfoCards } from "./components/order-detail/OrderInfoCards";
import { OrderSampleBreakdown } from "./components/order-detail/OrderSampleBreakdown";
import { OrderCourierTracking } from "./components/order-detail/OrderCourierTracking";
import { OrderDetailSkeleton } from "./components/order-detail/OrderDetailSkeleton";

export default function OrderDetailPage({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || (params?.id as string);
  const [downloading, setDownloading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingApi.getBookingById(id as string),
    enabled: !!id,
  });

  const apiBooking = data?.data;

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (!apiBooking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-muted-foreground font-medium">Booking not found.</p>
        <Link href="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const currentStep = getOrderTimelineStep(apiBooking.status, apiBooking.paymentStatus);
  const reportAvailable = Boolean(apiBooking.reportFiles?.length);

  let totalSamples = 0;
  const products = new Set<string>();
  apiBooking.items?.forEach((item: any) => {
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

  const handleDownloadReport = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const blob = await bookingApi.downloadReport(apiBooking._id);
      if (blob.type === "application/json") throw new Error("unavailable");
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${String(mainProduct).replace(/[^\w.-]+/g, "-")}-report`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    } catch {
      toast.error("Report is not available yet.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-16 md:pb-20 space-y-6">
      <div>
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/orders" className="hover:text-foreground transition-colors">
            Orders
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-mono font-medium break-all">{apiBooking._id}</span>
        </nav>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-5">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground leading-tight">{mainProduct}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Placed on {new Date(apiBooking.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
          <StatusBadge status={formatBookingStatus(apiBooking.status)} />
        </div>

        <OrderTrackingTimeline currentStep={currentStep} />
      </div>

      <OrderInfoCards
        mainProduct={mainProduct}
        totalSamples={totalSamples}
        labName={apiBooking.labId?.labName}
        labCity={apiBooking.labId?.location?.city}
        totalAmount={apiBooking.totalAmount}
        paymentStatus={apiBooking.paymentStatus}
        bookingStatus={apiBooking.status}
      />

      <OrderCourierTracking
        bookingId={apiBooking._id}
        collectionMethod={apiBooking.collectionMethod || apiBooking.metadata?.collectionMethod}
        courierDetails={apiBooking.courierDetails}
      />

      <OrderSampleBreakdown items={apiBooking.items} />

      {reportAvailable && (
        <div className="bg-litmus-mint/20 border border-litmus-teal/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shrink-0 text-brand-action shadow-sm border border-brand-action/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Report Ready</h3>
              <p className="text-sm text-brand-action font-medium">Your certified report is available for download.</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleDownloadReport}
            disabled={downloading}
            className="w-full sm:w-auto h-10 px-6 bg-brand-action hover:bg-brand-action-hover text-white rounded-lg gap-2 text-sm shadow-sm"
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download PDF
          </Button>
        </div>
      )}
    </div>
  );
}
