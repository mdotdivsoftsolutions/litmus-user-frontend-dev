"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Eye, 
  Download, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  ShieldCheck, 
  Lightbulb, 
  HelpCircle, 
  FileCheck, 
  Sparkles,
  ExternalLink
} from "lucide-react";
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
import { useDebounce } from "@/hooks/use-debounce";
import { ListPagination } from "@/components/common/ListPagination";
import { ReportListSkeleton } from "./components/list-skeletons";

const PAGE_SIZE = 10;

function isImageFile(url?: string) {
  if (!url) return false;
  return /\.(jpe?g|png|gif|webp)$/i.test(url);
}

function isPdfFile(url?: string, type?: string) {
  if (!url) return false;
  return type === "application/pdf" || /\.pdf$/i.test(url);
}

export default function ConsumerReportsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 350);
  const [activeTab, setActiveTab] = useState<"summary" | "document">("summary");
  const [preview, setPreview] = useState<{
    id: string;
    bookingId: string;
    title: string;
    product: string;
    lab: string;
    date: string;
    blobUrl: string;
    type: string;
    sourceUrl?: string;
    reportSummary?: {
      summary?: string;
      recommendations?: string;
      tips?: string;
      additionalNotes?: string;
    };
  } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["myReports", page, PAGE_SIZE, debouncedSearch],
    queryFn: () =>
      bookingApi.getMyBookings({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        reportsOnly: true,
      }),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const bookings = data?.data || [];
  const pages = data?.pages || 1;
  const currentPage = data?.page || page;

  const reports = bookings.map((b: any) => {
    const item = b.items?.[0];
    const extra = Math.max((b.items?.length || 1) - 1, 0);
    const testName = item?.testId?.testName || item?.packageId?.name || item?.samples?.[0]?.productName || "Custom Testing";
    return {
      id: b._id,
      bookingId: b._id,
      testName: extra > 0 ? `${testName} + ${extra} more` : testName,
      lab: b.labId?.labName || "Litmus Partner Lab",
      date: new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: b.status === "COMPLETED" || b.status === "Completed" ? "Verified" : "Pending",
      product: item?.samples?.[0]?.productName || item?.testId?.testName || "Custom",
      reportUrl: b.reportFiles?.[0],
      reportSummary: b.reportSummary || {},
    };
  });

  const fetchReportBlob = async (bookingId: string) => {
    const blob = await bookingApi.downloadReport(bookingId);
    if (blob.type === "application/json") throw new Error("unavailable");
    return blob;
  };

  const handlePreview = async (r: (typeof reports)[number]) => {
    setBusyId(`preview-${r.id}`);
    try {
      const blob = await fetchReportBlob(r.bookingId);
      const blobUrl = URL.createObjectURL(blob);
      setPreview({
        id: r.id,
        bookingId: r.bookingId,
        title: r.testName,
        product: r.product,
        lab: r.lab,
        date: r.date,
        blobUrl,
        type: blob.type,
        sourceUrl: r.reportUrl,
        reportSummary: r.reportSummary,
      });
      // Default to summary tab if summary exists, else document
      const hasSummary = Boolean(
        r.reportSummary?.summary || 
        r.reportSummary?.recommendations || 
        r.reportSummary?.tips || 
        r.reportSummary?.additionalNotes
      );
      setActiveTab(hasSummary ? "summary" : "document");
    } catch {
      toast.error("Unable to preview this report.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDownload = async (r: (typeof reports)[number]) => {
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
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Diagnostic Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">View verified test certificates, executive summaries, recommendations, and tips.</p>
        </div>
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search reports or products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 pl-9 rounded-xl bg-white border-slate-200 shadow-sm"
          />
        </div>
      </div>

      {isPending ? (
        <ReportListSkeleton />
      ) : (
        <div className="grid gap-3">
          {reports.map((r) => {
            const hasRemarks = Boolean(
              r.reportSummary?.summary || 
              r.reportSummary?.recommendations || 
              r.reportSummary?.tips || 
              r.reportSummary?.additionalNotes
            );

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 hover:border-brand-action/30 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Icon */}
                    <div className="shrink-0 h-11 w-11 rounded-xl bg-brand-action/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-brand-action" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{r.testName}</h3>
                        <div
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 border",
                            r.status === "Verified"
                              ? "bg-brand-action/10 text-brand-action border-brand-action/20"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          )}
                        >
                          {r.status === "Verified" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {r.status}
                        </div>

                        {hasRemarks && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-action/10 text-brand-action border border-brand-action/20">
                            <Sparkles className="h-2.5 w-2.5" /> AI Insights
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 truncate">
                          <span className="font-semibold text-slate-600">Product:</span> {r.product}
                        </span>
                        <span className="flex items-center gap-1 border-l border-slate-200 pl-3 hidden sm:flex">
                          <Calendar className="h-3.5 w-3.5" /> {r.date}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 hidden lg:block">{r.lab}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none h-9 rounded-xl gap-1.5 text-xs font-semibold text-slate-700 border-slate-200 hover:border-brand-action hover:text-brand-action"
                      disabled={busyId === `preview-${r.id}`}
                      onClick={() => handlePreview(r)}
                    >
                      {busyId === `preview-${r.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 sm:flex-none h-9 rounded-xl gap-1.5 text-xs font-semibold bg-brand-action hover:bg-brand-action-hover text-white px-4"
                      disabled={busyId === `download-${r.id}`}
                      onClick={() => handleDownload(r)}
                    >
                      {busyId === `download-${r.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {reports.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <FileCheck className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">No reports found</p>
              <p className="text-xs text-muted-foreground mt-1">Reports will appear here once your tests are completed and certified.</p>
            </div>
          )}
        </div>
      )}

      <ListPagination page={currentPage} pages={pages} onPageChange={setPage} />

      {/* Comprehensive Report Preview Dialog */}
      <Dialog open={!!preview} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl">
          {preview && (
            <div>
              {/* Header */}
              <div className="p-6 border-b border-border bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-background">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-brand-action/10 text-brand-action flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Certified Report
                      </span>
                      <span className="text-xs text-muted-foreground">{preview.date}</span>
                    </div>
                    <DialogTitle className="text-xl font-bold text-foreground leading-tight">
                      {preview.title}
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Performed by <span className="font-medium text-foreground">{preview.lab}</span>
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="bg-brand-action hover:bg-brand-action-hover text-white gap-2 shadow-sm rounded-lg h-9 px-4 shrink-0"
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = preview.blobUrl;
                      a.download = `${preview.title.replace(/[^\w.-]+/g, "-")}-report`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                    }}
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 mt-5 border-b border-border">
                  <button
                    onClick={() => setActiveTab("summary")}
                    className={cn(
                      "pb-2 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5",
                      activeTab === "summary"
                        ? "border-brand-action text-brand-action"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <FileCheck className="h-4 w-4" /> Summary & Recommendations
                  </button>
                  <button
                    onClick={() => setActiveTab("document")}
                    className={cn(
                      "pb-2 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5",
                      activeTab === "document"
                        ? "border-brand-action text-brand-action"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <FileText className="h-4 w-4" /> Official Document
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {activeTab === "summary" ? (
                  <div className="space-y-4">
                    {/* 1. Summary */}
                    {preview.reportSummary?.summary ? (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border shadow-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-7 w-7 rounded-lg bg-brand-action/10 flex items-center justify-center text-brand-action">
                            <FileText className="h-4 w-4" />
                          </div>
                          <h4 className="font-bold text-sm text-foreground">Executive Summary</h4>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-9">
                          {preview.reportSummary.summary}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-50 border border-border text-xs text-muted-foreground">
                        No executive summary provided. Please see the official document tab for test analytical parameters.
                      </div>
                    )}

                    {/* 2. Recommendations */}
                    {preview.reportSummary?.recommendations && (
                      <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 shadow-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-7 w-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                            <ShieldCheck className="h-4 w-4" />
                          </div>
                          <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">Actionable Recommendations</h4>
                        </div>
                        <p className="text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed whitespace-pre-wrap pl-9">
                          {preview.reportSummary.recommendations}
                        </p>
                      </div>
                    )}

                    {/* 3. Tips */}
                    {preview.reportSummary?.tips && (
                      <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 shadow-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-7 w-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400">
                            <Lightbulb className="h-4 w-4" />
                          </div>
                          <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300">Tips & Best Practices</h4>
                        </div>
                        <p className="text-sm text-amber-950 dark:text-amber-200 leading-relaxed whitespace-pre-wrap pl-9">
                          {preview.reportSummary.tips}
                        </p>
                      </div>
                    )}

                    {/* 4. Additional Notes */}
                    {preview.reportSummary?.additionalNotes && (
                      <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-300/60 dark:border-slate-700 shadow-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                            <HelpCircle className="h-4 w-4" />
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200">Additional Notes & Disclaimers</h4>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-9">
                          {preview.reportSummary.additionalNotes}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="min-h-[350px] max-h-[65vh] overflow-auto rounded-xl border border-border bg-slate-50 flex items-center justify-center">
                    {preview && isImageFile(preview.sourceUrl) ? (
                      <img src={preview.blobUrl} alt={preview.title} className="max-h-[65vh] w-auto object-contain rounded-lg" />
                    ) : preview && isPdfFile(preview.sourceUrl, preview.type) ? (
                      <iframe src={preview.blobUrl} title={preview.title} className="w-full h-[65vh] rounded-lg border-0" />
                    ) : (
                      <div className="p-8 text-center space-y-3">
                        <FileText className="h-12 w-12 text-brand-action mx-auto" />
                        <p className="text-sm font-medium text-foreground">Document viewer is ready</p>
                        <p className="text-xs text-muted-foreground">Click the download button above to view the complete analytical certificate.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
