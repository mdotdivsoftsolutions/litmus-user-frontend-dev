"use client";

import { useMemo } from "react";
import { Clock, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface TimelineStepItem {
  label: string;
  done: boolean;
  state: "completed" | "rejected" | "warning" | "failed" | "refunded" | "pending";
  sub?: string;
  message?: string;
}

interface OrderTrackingTimelineProps {
  booking?: any;
  currentStep?: number;
}

const formatDateSafe = (dateVal: any, formatStr = "MMM d, yyyy • h:mm a") => {
  if (!dateVal) return null;
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    return format(d, formatStr);
  } catch {
    return null;
  }
};

export function OrderTrackingTimeline({ booking, currentStep = 0 }: OrderTrackingTimelineProps) {
  const timelineSteps = useMemo<TimelineStepItem[]>(() => {
    if (!booking) {
      // Fallback if booking object is not provided (e.g. mock unit tests)
      const defaultLabels = [
        "Booking Placed",
        "Payment Confirmed (Paid)",
        "Admin Approved",
        "Lab Assigned",
        "Collector Assigned",
        "Sample Collected",
        "Testing in Progress",
        "Certified Report Uploaded",
      ];
      return defaultLabels.map((label, idx) => ({
        label,
        done: idx <= currentStep,
        state: idx <= currentStep ? ("completed" as const) : ("pending" as const),
      }));
    }

    const b = booking;
    const status = b.status || "PENDING";
    const paymentStatus = b.paymentStatus || "PENDING";
    const collectionDetails = b.metadata?.collectionDetails || b.collectionDetails || {};

    const isCourierMethod =
      b.collectionMethod === "COURIER" ||
      b.metadata?.collectionMethod === "COURIER" ||
      collectionDetails.collectionMethod === "COURIER" ||
      Boolean(b.courierDetails?.trackingId);

    const isRejected = status?.toUpperCase() === "REJECTED";
    const isCancelled = status?.toUpperCase() === "CANCELLED";

    const payStatusUpper = (paymentStatus || "").toUpperCase();
    const isPaymentPaid =
      ["SUCCESS", "PAID"].includes(payStatusUpper) ||
      ["APPROVED", "IN_PROGRESS", "COMPLETED"].includes(status?.toUpperCase() || "");
    const isPaymentFailed = payStatusUpper === "FAILED";
    const isPaymentRefunded = payStatusUpper === "REFUNDED";
    const isPaymentRefundInitiated = payStatusUpper === "REFUND_INITIATED";

    const bookingCreatedDate = formatDateSafe(b.createdAt);
    const paymentConfirmedDate =
      formatDateSafe(b.paymentDetails?.paidAt) ||
      formatDateSafe(b.metadata?.paymentConfirmedAt) ||
      (isPaymentPaid ? formatDateSafe(b.createdAt) : null);

    let paymentTimelineStep: TimelineStepItem;

    if (isPaymentPaid) {
      paymentTimelineStep = {
        label: "Payment Confirmed (Paid)",
        done: true,
        state: "completed",
        sub: paymentConfirmedDate || undefined,
      };
    } else if (isPaymentRefunded) {
      paymentTimelineStep = {
        label: "Payment Refunded",
        done: true,
        state: "refunded",
        sub: formatDateSafe(b.updatedAt) || undefined,
      };
    } else if (isPaymentRefundInitiated) {
      paymentTimelineStep = {
        label: "Refund Initiated",
        done: true,
        state: "warning",
        sub: formatDateSafe(b.updatedAt) || undefined,
      };
    } else if (isPaymentFailed) {
      paymentTimelineStep = {
        label: "Payment Failed",
        done: false,
        state: "failed",
        message: "Transaction unverified / failed",
      };
    } else {
      paymentTimelineStep = {
        label: "Payment Pending",
        done: false,
        state: "warning",
        message: "Awaiting customer payment",
      };
    }

    if (isRejected) {
      return [
        { label: "Booking Placed", done: true, state: "completed", sub: bookingCreatedDate || undefined },
        paymentTimelineStep,
        {
          label: "Booking Rejected by Admin",
          done: true,
          state: "rejected",
          sub: formatDateSafe(b.updatedAt) || undefined,
          message: b.metadata?.rejectionReason || "Order rejected",
        },
      ];
    }

    if (isCancelled) {
      return [
        { label: "Booking Placed", done: true, state: "completed", sub: bookingCreatedDate || undefined },
        paymentTimelineStep,
        {
          label: "Booking Cancelled",
          done: true,
          state: "rejected",
          sub: formatDateSafe(b.updatedAt) || undefined,
          message: "Cancelled by user / administrator",
        },
      ];
    }

    const isAdminApproved = ["approved", "in_progress", "completed"].includes(status?.toLowerCase() || "");
    const adminApprovedDate = formatDateSafe(b.metadata?.adminApprovedAt) || (isAdminApproved ? formatDateSafe(b.updatedAt) : null);

    const isLabAssigned =
      Boolean(b.labId?._id || b.labId?.labName || b.metadata?.isLitmusDirect) ||
      ["in_progress", "completed"].includes(status?.toLowerCase() || "");
    const labAssignedDate = formatDateSafe(b.metadata?.labAssignedAt) || (isLabAssigned ? formatDateSafe(b.updatedAt) : null);
    const labNameDisplay = b.labId?.labName
      ? `Assigned to: ${b.labId.labName}`
      : b.metadata?.isLitmusDirect
      ? "Assigned to Litmus Central Lab"
      : undefined;

    const isCollectorAssigned = Boolean(
      b.assignedCollector?.name ||
        ["ASSIGNED", "REACHED", "COLLECTED", "SHIPPED"].includes(b.collectionStatus?.toUpperCase() || "") ||
        b.courierDetails?.trackingId ||
        ["in_progress", "completed"].includes(status?.toLowerCase() || "")
    );
    const collectorAssignedDate =
      formatDateSafe(b.metadata?.collectorAssignedAt) ||
      formatDateSafe(b.courierDetails?.submittedAt) ||
      (isCollectorAssigned ? formatDateSafe(b.updatedAt) : null);
    const collectorDisplayMsg = b.assignedCollector?.name
      ? `Collector: ${b.assignedCollector.name}${b.assignedCollector.contact ? ` (${b.assignedCollector.contact})` : ""}`
      : b.courierDetails?.trackingId
      ? `Courier: ${b.courierDetails.courierName || "Shipped"} (${b.courierDetails.trackingId})`
      : isCollectorAssigned
      ? "Pickup / dispatch partner assigned"
      : undefined;

    const isSampleCollected = Boolean(
      ["COLLECTED", "REACHED", "SHIPPED"].includes(b.collectionStatus?.toUpperCase() || "") ||
        ["in_progress", "completed"].includes(status?.toLowerCase() || "")
    );
    const sampleCollectedDate = formatDateSafe(b.metadata?.sampleCollectedAt) || (isSampleCollected ? formatDateSafe(b.updatedAt) : null);
    const sampleCollectedMsg = isSampleCollected
      ? isCourierMethod
        ? "Sample in transit / received at lab"
        : "Sample collected & verified from client"
      : undefined;

    const isTestingInProgress = ["in_progress", "completed"].includes(status?.toLowerCase() || "");
    const testingStartedDate = formatDateSafe(b.metadata?.testingStartedAt) || (isTestingInProgress ? formatDateSafe(b.updatedAt) : null);

    const isReportUploaded =
      (b.reportFiles && b.reportFiles.length > 0) || Boolean(b.reportSummary?.summary) || status?.toLowerCase() === "completed";
    const reportUploadedDate =
      formatDateSafe(b.reportSummary?.updatedAt) || formatDateSafe(b.metadata?.reportUploadedAt) || (isReportUploaded ? formatDateSafe(b.updatedAt) : null);
    const reportDisplayMsg = b.isReportApprovedByAdmin
      ? "Certified report verified & released"
      : b.reportFiles && b.reportFiles.length > 0
      ? "Report document uploaded"
      : undefined;

    return [
      {
        label: "Booking Placed",
        done: true,
        state: "completed",
        sub: bookingCreatedDate || undefined,
        message: "Order registered in system",
      },
      paymentTimelineStep,
      {
        label: "Admin Approved",
        done: isAdminApproved,
        state: isAdminApproved ? "completed" : "pending",
        sub: adminApprovedDate || undefined,
        message: isAdminApproved ? "Approved for execution" : undefined,
      },
      {
        label: "Lab Assigned",
        done: isLabAssigned,
        state: isLabAssigned ? "completed" : "pending",
        sub: labAssignedDate || undefined,
        message: labNameDisplay,
      },
      {
        label: isCourierMethod ? "Courier Dispatched" : "Collector Assigned",
        done: isCollectorAssigned,
        state: isCollectorAssigned ? "completed" : "pending",
        sub: collectorAssignedDate || undefined,
        message: collectorDisplayMsg,
      },
      {
        label: isCourierMethod ? "Sample Received at Lab" : "Sample Collected",
        done: isSampleCollected,
        state: isSampleCollected ? "completed" : "pending",
        sub: sampleCollectedDate || undefined,
        message: sampleCollectedMsg,
      },
      {
        label: "Testing in Progress",
        done: isTestingInProgress,
        state: isTestingInProgress ? "completed" : "pending",
        sub: testingStartedDate || undefined,
        message: isTestingInProgress ? "Laboratory food testing analysis underway" : undefined,
      },
      {
        label: "Certified Report Uploaded",
        done: isReportUploaded,
        state: isReportUploaded ? "completed" : "pending",
        sub: reportUploadedDate || undefined,
        message: reportDisplayMsg,
      },
    ];
  }, [booking, currentStep]);

  return (
    <div className="bg-white border border-slate-200/90 shadow-xs rounded-2xl overflow-hidden p-5 sm:p-6 transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-700" />
          Fulfillment Stepper
        </h3>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
          Live State
        </span>
      </div>

      <div className="space-y-0 relative pl-1">
        {timelineSteps.map((step, idx) => {
          const isCompleted = step.state === "completed" || step.done;
          const isCurrent = !isCompleted && (idx === 0 || timelineSteps[idx - 1]?.done);
          const isWarn = step.state === "warning";
          const isRej = step.state === "rejected" || step.state === "failed";

          return (
            <div key={idx} className="flex items-start gap-3.5 relative">
              {/* Vertical Connector Line */}
              {idx < timelineSteps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[11px] top-6 bottom-0 w-[2px]",
                    isCompleted ? "bg-emerald-500" : "bg-slate-200"
                  )}
                />
              )}

              {/* Step Node Icon */}
              <div
                className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 transition-all",
                  isRej
                    ? "bg-rose-600 border-rose-600 text-white shadow-xs"
                    : isWarn
                    ? "bg-amber-500 border-amber-500 text-white shadow-xs"
                    : isCompleted
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                    : isCurrent
                    ? "bg-white border-brand-action text-brand-action animate-pulse shadow-xs ring-2 ring-brand-action/20"
                    : "bg-white border-slate-300 text-slate-400"
                )}
              >
                {isRej ? (
                  <XCircle className="h-3.5 w-3.5" />
                ) : isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <span className="text-[10px] font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="pb-6 pt-0.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <p
                    className={cn(
                      "text-xs",
                      isRej
                        ? "font-bold text-rose-700"
                        : isCompleted
                        ? "font-bold text-slate-900"
                        : isCurrent
                        ? "font-bold text-brand-action"
                        : "font-medium text-slate-400"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.sub && (
                    <span
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 font-semibold shrink-0",
                        isCompleted
                          ? "bg-slate-100 text-slate-700 border border-slate-200/70"
                          : isRej
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-slate-50 text-slate-400"
                      )}
                    >
                      <Calendar className="h-2.5 w-2.5 opacity-70" />
                      {step.sub}
                    </span>
                  )}
                </div>
                {step.message && (
                  <p className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200/80 rounded px-2.5 py-1 mt-1 font-medium leading-relaxed">
                    {step.message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
