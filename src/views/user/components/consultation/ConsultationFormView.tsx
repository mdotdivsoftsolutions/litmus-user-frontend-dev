"use client";

import { DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, X, Loader2 } from "lucide-react";

interface ConsultationFormViewProps {
  serviceName: string;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM",
];

const fieldClass = "h-10 rounded-md bg-background";
const labelClass = "text-sm font-medium text-foreground";

function RequiredMark() {
  return <span className="text-muted-foreground font-normal"> *</span>;
}

export function ConsultationFormView({
  serviceName,
  formData,
  handleChange,
  handleSubmit,
  isPending,
}: ConsultationFormViewProps) {
  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div className="min-w-0">
          <DialogTitle className="text-lg font-semibold text-foreground">Book a consultation</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">{serviceName}</DialogDescription>
        </div>
        <DialogClose asChild>
          <button
            type="button"
            aria-label="Close"
            className="-mr-2 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogClose>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 px-6 py-5">
          <section className="space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="consult-name" className={labelClass}>Full name<RequiredMark /></Label>
                <Input id="consult-name" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" className={fieldClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="consult-business" className={labelClass}>Business name</Label>
                <Input id="consult-business" name="business" value={formData.business} onChange={handleChange} autoComplete="organization" className={fieldClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="consult-email" className={labelClass}>Email<RequiredMark /></Label>
                <Input id="consult-email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" className={fieldClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="consult-phone" className={labelClass}>Phone<RequiredMark /></Label>
                <Input id="consult-phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required autoComplete="tel" placeholder="+91" className={fieldClass} />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Preferred schedule</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="consult-date" className={labelClass}>Date<RequiredMark /></Label>
                <Input
                  id="consult-date"
                  name="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="consult-time" className={labelClass}>Time<RequiredMark /></Label>
                <div className="relative">
                  <select
                    id="consult-time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className={`${fieldClass} flex w-full appearance-none border border-input px-3 pr-9 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${formData.time ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    <option value="" disabled>Select a time</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot} className="text-foreground">{slot}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-1.5">
            <Label htmlFor="consult-message" className={labelClass}>
              Notes <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="consult-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us briefly what you need help with"
              className="min-h-[88px] resize-none rounded-md bg-background"
            />
          </div>
        </div>

        <div className="border-t border-border bg-muted/30 px-6 py-4">
          <Button
            disabled={isPending}
            type="submit"
            className="h-10 w-full rounded-md bg-brand-action text-sm font-medium text-white hover:bg-brand-action-hover"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              "Request consultation"
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            By submitting, you agree to our Advisory Terms of Service.
          </p>
        </div>
      </form>
    </div>
  );
}
