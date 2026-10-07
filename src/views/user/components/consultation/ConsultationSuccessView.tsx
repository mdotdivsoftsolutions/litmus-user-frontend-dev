"use client";

import { CheckCircle2, X } from "lucide-react";
import { DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConsultationSuccessViewProps {
  serviceName: string;
}

export function ConsultationSuccessView({ serviceName }: ConsultationSuccessViewProps) {
  return (
    <div className="relative animate-in fade-in duration-200">
      <DialogClose asChild>
        <button
          type="button"
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>
      </DialogClose>

      <div className="flex flex-col items-center px-8 pb-6 pt-10 text-center">
        <CheckCircle2 className="mb-4 h-10 w-10 text-litmus-teal" strokeWidth={1.75} />
        <DialogTitle className="text-lg font-semibold text-foreground">Request received</DialogTitle>
        <DialogDescription className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thanks — we&apos;ve received your consultation request for{" "}
          <span className="font-medium text-foreground">{serviceName}</span>. Our advisory team will contact you
          shortly to confirm the schedule.
        </DialogDescription>
      </div>

      <div className="border-t border-border bg-muted/30 px-6 py-4">
        <DialogClose asChild>
          <Button variant="outline" className="h-10 w-full rounded-md text-sm font-medium">
            Done
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}
