"use client";

import { DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Mail, Phone, Building2, X, Loader2, MessageSquare } from "lucide-react";

interface ConsultationFormViewProps {
  serviceName: string;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function ConsultationFormView({
  serviceName,
  formData,
  handleChange,
  handleSubmit,
  isPending,
}: ConsultationFormViewProps) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-card border-b border-border p-6 relative text-center sm:text-left">
        <DialogTitle className="text-xl font-bold text-foreground tracking-tight mb-1">Book Consultation</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground font-medium">{serviceName}</DialogDescription>

        <DialogClose asChild>
          <button className="absolute right-6 top-6 h-8 w-8 rounded-full border-2 border-red-200 bg-white text-red-500 hover:text-red-700 hover:border-red-400 hover:bg-red-50/50 flex items-center justify-center transition-all shadow-sm focus:outline-none">
            <X className="h-4 w-4 stroke-[3]" />
          </button>
        </DialogClose>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-slate-50/50">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="pl-9 h-10 rounded-lg bg-card"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Business Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="business"
                value={formData.business}
                onChange={handleChange}
                placeholder="Company Ltd."
                className="pl-9 h-10 rounded-lg bg-card"
              />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
                placeholder="john@example.com"
                className="pl-9 h-10 rounded-lg bg-card"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                type="tel"
                placeholder="+91 98765 43210"
                className="pl-9 h-10 rounded-lg bg-card"
              />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 border-t border-border pt-5 mt-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Preferred Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                min={new Date().toISOString().split("T")[0]}
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                type="date"
                className="pl-9 h-10 rounded-lg bg-card"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Preferred Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
              >
                <option value="" disabled>
                  Select a time
                </option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="04:30 PM">04:30 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <Label className="text-xs font-semibold text-muted-foreground">Additional Notes (Optional)</Label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              className="pl-9 min-h-[80px] rounded-lg bg-card resize-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-11 bg-brand-action hover:bg-brand-action-hover text-white font-semibold rounded-xl text-sm shadow-md transition-all duration-300 active:scale-95"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Confirm Booking Request"
            )}
          </Button>
          <p className="text-center text-[10px] text-muted-foreground mt-3 font-medium">
            By booking, you agree to our Advisory Terms of Service.
          </p>
        </div>
      </form>
    </div>
  );
}
