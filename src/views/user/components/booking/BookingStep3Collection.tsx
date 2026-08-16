"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Home as HomeIcon, Calendar as CalendarIcon, Truck, Bike, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingFormData, CollectionMethod } from "./booking-types";

interface BookingStep3CollectionProps {
  formData: BookingFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setCollectionMethod: (method: CollectionMethod) => void;
  minDateString: string;
  isAvailabilityLoading: boolean;
  dateError: string | null;
  timeError: string | null;
  pickupCities: string[];
  isPickupCovered: boolean;
}

export function BookingStep3Collection({
  formData,
  handleInputChange,
  setCollectionMethod,
  minDateString,
  isAvailabilityLoading,
  dateError,
  timeError,
  pickupCities,
  isPickupCovered,
}: BookingStep3CollectionProps) {
  const coverageLabel = pickupCities.length ? pickupCities.join(", ") : "no cities yet";

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
              <HomeIcon className="h-4 w-4 text-brand-action" /> Collection Address
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
              <Truck className="h-4 w-4 text-brand-action" /> How should we collect samples?
            </h4>
            <p className="text-sm text-slate-500">
              Choose pickup only if a Litmus agent can collect from your city. Otherwise send samples by courier.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCollectionMethod("COURIER")}
                className={cn(
                  "text-left rounded-xl border-2 p-4 transition-all",
                  formData.collectionMethod === "COURIER"
                    ? "border-brand-action bg-brand-action/5"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Truck className="h-5 w-5" />
                  </div>
                  {formData.collectionMethod === "COURIER" && (
                    <span className="h-5 w-5 rounded-full bg-brand-action text-white flex items-center justify-center">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
                <p className="mt-3 font-bold text-slate-900">Courier service</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Pack the samples and ship them to the assigned lab. Available nationwide. No pickup slot needed.
                </p>
              </button>

              <button
                type="button"
                onClick={() => isPickupCovered && setCollectionMethod("PICKUP")}
                disabled={!isPickupCovered}
                className={cn(
                  "text-left rounded-xl border-2 p-4 transition-all",
                  !isPickupCovered && "opacity-60 cursor-not-allowed bg-slate-50",
                  formData.collectionMethod === "PICKUP"
                    ? "border-brand-action bg-brand-action/5"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Bike className="h-5 w-5" />
                  </div>
                  {formData.collectionMethod === "PICKUP" && (
                    <span className="h-5 w-5 rounded-full bg-brand-action text-white flex items-center justify-center">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
                <p className="mt-3 font-bold text-slate-900">Pickup service</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  A Litmus agent collects from your address. Currently available in {coverageLabel}.
                </p>
                {!isPickupCovered && (
                  <p className="mt-2 text-[11px] font-semibold text-amber-700">
                    Not available for {formData.city || "your city"}. Use courier, or change the city above.
                  </p>
                )}
              </button>
            </div>
          </div>

          {formData.collectionMethod === "COURIER" && (
            <div className="rounded-lg border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-slate-700 space-y-1.5">
              <p>
                After payment, pack the samples and ship them to the lab address we share. No collection slot is required.
              </p>
              <p className="font-semibold text-slate-900">
                Then open this order and add the courier tracking ID, partner name, and any shipping notes so we can confirm the shipment.
              </p>
            </div>
          )}

          {formData.collectionMethod === "PICKUP" && (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
