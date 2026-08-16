"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface StepConfirmationProps {
  booking: any;
}

export function StepConfirmation({ booking }: StepConfirmationProps) {
  const router = useRouter();

  return (
    <div className="text-center py-12 max-w-xl mx-auto space-y-6 animate-fade-in">
      <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 leading-[1.3]">
          Booking Request Confirmed!
        </h2>
        <p className="font-body text-slate-600 text-base leading-[1.5]">
          Your sample collection request has been securely registered. Our field coordinator will contact you shortly to confirm pickup logistics.
        </p>
      </div>

      {booking?._id && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 inline-block">
          <p className="font-body text-xs text-slate-400 font-semibold uppercase tracking-wider">Tracking Reference</p>
          <p className="font-data text-base font-bold text-brand-action mt-0.5">{booking._id}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Button
          onClick={() => router.push("/orders")}
          className="w-full sm:w-auto bg-brand-action hover:bg-brand-action-hover text-white rounded-xl h-12 px-8 font-body font-semibold text-base shadow-md active:scale-95"
        >
          Track My Bookings
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-12 px-8 font-body font-semibold text-base"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
