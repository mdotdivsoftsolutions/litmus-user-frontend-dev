import { FileText, ShieldCheck, Lightbulb, HelpCircle, Sparkles, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderReportInsightsProps {
  reportSummary?: {
    summary?: string;
    recommendations?: string;
    tips?: string;
    additionalNotes?: string;
    updatedAt?: string | Date;
  };
  onDownloadReport?: () => void;
  isDownloading?: boolean;
}

export function OrderReportInsights({
  reportSummary,
  onDownloadReport,
  isDownloading = false,
}: OrderReportInsightsProps) {
  if (!reportSummary) return null;

  const hasContent = Boolean(
    reportSummary.summary ||
    reportSummary.recommendations ||
    reportSummary.tips ||
    reportSummary.additionalNotes
  );

  if (!hasContent) return null;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-border bg-gradient-to-r from-brand-action/5 via-transparent to-litmus-mint/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-action/10 flex items-center justify-center text-brand-action shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">Report Insights & Recommendations</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Technical summary, food safety guidelines, and actionable tips provided by the testing laboratory.
            </p>
          </div>
        </div>

        {onDownloadReport && (
          <Button
            size="sm"
            onClick={onDownloadReport}
            disabled={isDownloading}
            className="bg-brand-action hover:bg-brand-action-hover text-white gap-1.5 text-xs rounded-lg shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Download className="h-3.5 w-3.5" /> Download Full Certificate
          </Button>
        )}
      </div>

      {/* Content Grid */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Executive Summary */}
        {reportSummary.summary && (
          <div className={cn(
            "p-5 rounded-xl border border-border bg-slate-50/70 dark:bg-slate-900/50 shadow-xs flex flex-col",
            !reportSummary.recommendations && !reportSummary.tips && !reportSummary.additionalNotes ? "md:col-span-2" : ""
          )}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="h-7 w-7 rounded-lg bg-brand-action/15 flex items-center justify-center text-brand-action">
                <FileText className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-sm text-foreground">1. Executive Summary</h4>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap flex-1">
              {reportSummary.summary}
            </p>
          </div>
        )}

        {/* 2. Actionable Recommendations */}
        {reportSummary.recommendations && (
          <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-xs flex flex-col">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">2. Actionable Recommendations</h4>
            </div>
            <p className="text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed whitespace-pre-wrap flex-1">
              {reportSummary.recommendations}
            </p>
          </div>
        )}

        {/* 3. Tips & Best Practices */}
        {reportSummary.tips && (
          <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 shadow-xs flex flex-col">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="h-7 w-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300">3. Tips & Best Practices</h4>
            </div>
            <p className="text-sm text-amber-950 dark:text-amber-200 leading-relaxed whitespace-pre-wrap flex-1">
              {reportSummary.tips}
            </p>
          </div>
        )}

        {/* 4. Additional Notes & Disclaimers */}
        {reportSummary.additionalNotes && (
          <div className="p-5 rounded-xl border border-slate-300/70 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40 shadow-xs flex flex-col">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <HelpCircle className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200">4. Additional Notes & Disclaimers</h4>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap flex-1">
              {reportSummary.additionalNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
