"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { bookingApi } from "@/lib/api/booking";

interface OrderCourierTrackingProps {
  bookingId: string;
  collectionMethod?: string;
  courierDetails?: {
    trackingId?: string;
    courierName?: string;
    notes?: string;
    submittedAt?: string;
  };
}

export function OrderCourierTracking({ bookingId, collectionMethod, courierDetails }: OrderCourierTrackingProps) {
  const isCourier = collectionMethod === "COURIER";
  const queryClient = useQueryClient();
  const [trackingId, setTrackingId] = useState(courierDetails?.trackingId || "");
  const [courierName, setCourierName] = useState(courierDetails?.courierName || "");
  const [notes, setNotes] = useState(courierDetails?.notes || "");

  useEffect(() => {
    setTrackingId(courierDetails?.trackingId || "");
    setCourierName(courierDetails?.courierName || "");
    setNotes(courierDetails?.notes || "");
  }, [courierDetails?.trackingId, courierDetails?.courierName, courierDetails?.notes]);

  const mutation = useMutation({
    mutationFn: () =>
      bookingApi.updateCourierTracking(bookingId, {
        trackingId: trackingId.trim(),
        courierName: courierName.trim(),
        notes: notes.trim(),
      }),
    onSuccess: () => {
      toast.success("Tracking details saved");
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to save tracking details");
    },
  });

  if (!isCourier) return null;

  const saved = Boolean(courierDetails?.trackingId);

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-5 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Courier tracking</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            After you ship the samples, add the AWB / tracking ID here so the lab can confirm receipt.
          </p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Tracking on file{courierDetails?.submittedAt ? ` · ${new Date(courierDetails.submittedAt).toLocaleDateString("en-IN")}` : ""}.
          You can update it if the shipment changes.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tracking / AWB ID *</Label>
          <Input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="e.g. 1234 5678 9012" className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Courier partner</Label>
          <Input value={courierName} onChange={(e) => setCourierName(e.target.value)} placeholder="e.g. Blue Dart, DTDC, Delhivery" className="h-10" />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Notes (optional)</Label>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Number of parcels, pickup reference, special handling" className="h-10" />
        </div>
      </div>

      <Button
        onClick={() => mutation.mutate()}
        disabled={!trackingId.trim() || mutation.isPending}
        className="bg-brand-action hover:bg-brand-action-hover text-white h-10 px-5 font-semibold"
      >
        {mutation.isPending ? "Saving..." : saved ? "Update tracking" : "Save tracking ID"}
      </Button>
    </div>
  );
}
