"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Home as HomeIcon, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingFormData } from "./booking-types";

interface BookingStep3CollectionProps {
  formData: BookingFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  minDateString: string;
  isAvailabilityLoading: boolean;
  dateError: string | null;
  timeError: string | null;
}

export function BookingStep3Collection({
  formData,
  handleInputChange,
  minDateString,
  isAvailabilityLoading,
  dateError,
  timeError,
}: BookingStep3CollectionProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Collection Details</h1>
        <p className="text-slate-500 text-sm font-medium">Where should we collect the samples from?</p>
      </div>

      <Card className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 text-sm uppercase tracking-wide">
              <UserIcon className="h-4 w-4 text-brand-action" /> Contact Information
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</Label>
                <Input name="phone" value={formData.phone} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</Label>
                <Input name="email" value={formData.email} onChange={handleInputChange} type="email" className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 text-sm uppercase tracking-wide">
              <HomeIcon className="h-4 w-4 text-brand-action" /> Pickup Address
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Complete Address</Label>
                <Input name="address" value={formData.address} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">City</Label>
                <Input name="city" value={formData.city} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pincode</Label>
                <Input name="pincode" value={formData.pincode} onChange={handleInputChange} className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 text-sm uppercase tracking-wide">
              <CalendarIcon className="h-4 w-4 text-brand-action" /> Preferred Schedule
            </h4>
            <p className="text-xs text-slate-600 font-medium bg-blue-50/50 p-3 rounded border border-blue-100">
              <span className="font-bold text-blue-700">Note:</span> Preferred collection time. Our collection agent will coordinate promptly.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pickup Date</Label>
                <Input name="pickupDate" min={minDateString} type="date" value={formData.pickupDate} onChange={handleInputChange} className={cn("h-10 bg-slate-50 border-slate-200 rounded-lg text-sm", dateError ? "border-red-500 focus-visible:ring-red-500" : "")} />
                {isAvailabilityLoading && <p className="text-xs text-brand-action animate-pulse mt-1">Checking lab availability...</p>}
                {dateError && <p className="text-xs text-red-500 font-bold mt-1">{dateError}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pickup Time</Label>
                <select 
                  name="pickupTime" 
                  value={formData.pickupTime} 
                  onChange={handleInputChange} 
                  className={cn("flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", timeError ? "border-red-500 focus-visible:ring-red-500" : "")}
                >
                  <option value="" disabled>Select Time</option>
                  {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {timeError && <p className="text-xs text-red-500 font-bold mt-1">{timeError}</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
