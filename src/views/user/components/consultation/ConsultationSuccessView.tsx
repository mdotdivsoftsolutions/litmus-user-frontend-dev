"use client";

import { CheckCircle2, X } from "lucide-react";
import { DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ConsultationSuccessViewProps {
  serviceName: string;
}

export function ConsultationSuccessView({ serviceName }: ConsultationSuccessViewProps) {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-500 fill-mode-forwards relative">
      <DialogClose asChild>
        <button className="absolute right-6 top-6 h-8 w-8 rounded-full border-2 border-red-200 bg-white text-red-500 hover:text-red-700 hover:border-red-400 hover:bg-red-50/50 flex items-center justify-center transition-all shadow-sm focus:outline-none">
          <X className="h-4 w-4 stroke-[3]" />
        </button>
      </DialogClose>
      <div className="h-20 w-20 bg-litmus-mint/20 text-litmus-teal rounded-full flex items-center justify-center mb-2">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">Booking Confirmed</DialogTitle>
      <DialogDescription className="text-sm font-medium text-muted-foreground">
        Your consultation request for <span className="font-bold text-foreground">{serviceName}</span> has been received.
        Our advisory team will contact you shortly to confirm the schedule.
      </DialogDescription>
    </div>
  );
}
