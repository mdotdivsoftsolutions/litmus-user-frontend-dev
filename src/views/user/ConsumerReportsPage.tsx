"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Download, FileText, Calendar, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "@/lib/api/booking";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function isImageFile(url: string) {
  return /\.(jpe?g|png|gif|webp)$/i.test(url);
}

function isPdfFile(url: string, type?: string) {
  return type === "application/pdf" || /\.pdf$/i.test(url);
}

export default function ConsumerReportsPage() {
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<{ title: string; blobUrl: string; type: string; sourceUrl: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["myBookings"],
    queryFn: bookingApi.getMyBookings,
  });

  const bookings = data?.data || [];

  const apiReports = bookings
    .filter((b: any) => b.reportFiles?.length > 0)
    .flatMap((b: any) => {
      return (
        b.items?.map((item: any) => ({
          id: `${b._id}-${item._id || item.testId?._id || Math.random().toString()}`,
          bookingId: b._id,
          testName: item.testId?.testName || item.packageId?.name || item.samples?.[0]?.productName || "Custom Testing",
          lab: b.labId?.labName || "Litmus Partner Lab",
          date: new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          status: b.status === "COMPLETED" || b.status === "Completed" ? "Verified" : "Pending",
          product: item.samples?.[0]?.productName || item.testId?.testName || "Custom",
          reportUrl: b.reportFiles?.[0],
        })) || []
      );
    });

  const filtered = apiReports.filter(
    (r: any) =>
      !search ||
      r.testName.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase())
  );

  const fetchReportBlob = async (bookingId: string) => {
    const blob = await bookingApi.downloadReport(bookingId);
    if (blob.type === "application/json") throw new Error("unavailable");
    return blob;
  };

  const handlePreview = async (r: any) => {
    if (!r.bookingId) return;
    setBusyId(`preview-${r.id}`);
    try {
      const blob = await fetchReportBlob(r.bookingId);
      const blobUrl = URL.createObjectURL(blob);
      setPreview({ title: r.testName, blobUrl, type: blob.type, sourceUrl: r.reportUrl });
    } catch {
      toast.error("Unable to preview this report.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDownload = async (r: any) => {
    if (!r.bookingId) return;
    setBusyId(`download-${r.id}`);
    try {
      const blob = await fetchReportBlob(r.bookingId);
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${r.testName.replace(/[^\w.-]+/g, "-")}-report`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    } catch {
      toast.error("Download failed. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const closePreview = () => {
    if (preview?.blobUrl) URL.revokeObjectURL(preview.blobUrl);
    setPreview(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-16 md:pb-20 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Diagnostic Reports</h1>
          <p className="text-sm text-muted-foreground">View and download your certified test reports.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search reports or products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 rounded-lg bg-transparent border-border shadow-none"
          />
        </div>
      </div>

      <div className="grid gap-3">
        {isLoading ? (
          <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-border">
            <Loader2 className="h-8 w-8 animate-spin text-brand-action mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Loading your reports...</p>
          </div>
        ) : (
          <>
            {filtered.map((r: any) => (
              <div
                key={r.id}
                className="bg-card rounded-xl border border-border shadow-sm p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-accent transition-colors"
              >
                <div className="flex-1 min-w-0 w-full flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="shrink-0 flex items-center justify-center h-10 w-10 bg-brand-action/10 rounded-lg text-brand-action">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-foreground truncate">{r.testName}</h3>
                      <div
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1",
                          r.status === "Verified" ? "bg-brand-action/10 text-brand-action" : "bg-flame-amber-tint/50 text-accent"
                        )}
                      >
                        {r.status === "Verified" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {r.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 truncate">
                        <span className="font-medium text-foreground">Product:</span> {r.product}
                      </span>
                      <span className="flex items-center gap-1 truncate border-l border-border pl-3">
                        <Calendar className="h-3.5 w-3.5" /> {r.date}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 w-48 text-xs text-muted-foreground hidden lg:block">{r.lab}</div>
                </div>

                <div className="shrink-0 flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-border pt-3 md:pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none h-8 rounded-lg gap-1.5 text-xs text-foreground"
                    disabled={!r.bookingId || busyId === `preview-${r.id}`}
                    onClick={() => handlePreview(r)}
                  >
                    {busyId === `preview-${r.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 md:flex-none h-8 rounded-lg gap-1.5 text-xs bg-brand-action hover:bg-brand-action-hover text-white"
                    disabled={!r.bookingId || busyId === `download-${r.id}`}
                    onClick={() => handleDownload(r)}
                  >
                    {busyId === `download-${r.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    Download
                  </Button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-border">
                <p className="text-muted-foreground text-sm">No reports found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={!!preview} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-6">{preview?.title || "Report"}</DialogTitle>
          </DialogHeader>
          <div className="min-h-[240px] max-h-[70vh] overflow-auto rounded-lg border border-border bg-slate-50 flex items-center justify-center">
            {preview && isImageFile(preview.sourceUrl) ? (
              <img src={preview.blobUrl} alt={preview.title} className="max-h-[70vh] w-auto object-contain" />
            ) : preview && isPdfFile(preview.sourceUrl, preview.type) ? (
              <iframe src={preview.blobUrl} title={preview.title} className="w-full h-[70vh] rounded-lg" />
            ) : (
              <div className="p-8 text-center space-y-3">
                <FileText className="h-10 w-10 text-brand-action mx-auto" />
                <p className="text-sm text-muted-foreground">Inline preview is not available for this file type.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
