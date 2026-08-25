"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Home as HomeIcon, Calendar as CalendarIcon, Truck, Bike, Check, BookmarkCheck, BookmarkPlus, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { BookingFormData, CollectionMethod } from "./booking-types";
import { CourierAddressCard } from "./CourierAddressCard";

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
  enablePickupSlotSelection?: boolean;
  savedProfileAddress?: { street: string; city: string; state: string; pincode: string } | null;
  hasSavedAddress: boolean;
  isUsingSavedAddress: boolean;
  handleToggleUseSavedAddress: () => void;
  saveAddressToProfile: boolean;
  setSaveAddressToProfile: (save: boolean) => void;
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
  enablePickupSlotSelection = false,
  savedProfileAddress,
  hasSavedAddress,
  isUsingSavedAddress,
  handleToggleUseSavedAddress,
  saveAddressToProfile,
  setSaveAddressToProfile,
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
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                <HomeIcon className="h-4 w-4 text-brand-action" /> Collection Address
              </h4>
              {hasSavedAddress && (
                <button
                  type="button"
                  onClick={handleToggleUseSavedAddress}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all border",
                    isUsingSavedAddress
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <BookmarkCheck className={cn("h-3.5 w-3.5", isUsingSavedAddress ? "text-emerald-600" : "text-slate-400")} />
                  {isUsingSavedAddress ? "Using Saved Profile Address" : "Use Saved Profile Address"}
                </button>
              )}
            </div>

            {hasSavedAddress && (
              <div
                onClick={handleToggleUseSavedAddress}
                className={cn(
                  "cursor-pointer rounded-xl border p-3.5 transition-all flex items-start gap-3 select-none",
                  isUsingSavedAddress
                    ? "border-emerald-500/40 bg-emerald-50/40 shadow-xs"
                    : "border-slate-200 bg-slate-50/70 hover:bg-slate-100/70"
                )}
              >
                <Checkbox
                  id="use-saved-address"
                  checked={isUsingSavedAddress}
                  onCheckedChange={handleToggleUseSavedAddress}
                  className="mt-0.5 border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <label htmlFor="use-saved-address" className="font-bold text-slate-900 cursor-pointer">
                      Use saved address from profile
                    </label>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      Profile Saved
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    <MapPin className="inline h-3.5 w-3.5 text-slate-400 mr-1 -mt-0.5" />
                    {savedProfileAddress?.street}
                    {savedProfileAddress?.city ? `, ${savedProfileAddress.city}` : ""}
                    {savedProfileAddress?.state ? `, ${savedProfileAddress.state}` : ""}
                    {savedProfileAddress?.pincode ? ` - ${savedProfileAddress.pincode}` : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Complete Address</Label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House/Flat no, Building, Street name, Area"
                  className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">City</Label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Adur, Chennai"
                  className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pincode</Label>
                <Input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit PIN code"
                  className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Save / Update to Profile Checkbox */}
            {(!isUsingSavedAddress || !hasSavedAddress) && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-3.5 transition-all">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="save-address-profile"
                    checked={saveAddressToProfile}
                    onCheckedChange={(checked) => setSaveAddressToProfile(!!checked)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 text-xs">
                    <label htmlFor="save-address-profile" className="font-bold text-slate-900 cursor-pointer flex items-center gap-1.5">
                      <BookmarkPlus className="h-3.5 w-3.5 text-brand-action" />
                      {hasSavedAddress
                        ? "Update this new address in my profile"
                        : "Save this address to my profile for future bookings"}
                    </label>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                      {hasSavedAddress
                        ? "Replaces your currently saved profile address with this address."
                        : "Save this address to your account so it automatically fills on your next booking."}
                    </p>
                  </div>
                </div>
              </div>
            )}
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
            <CourierAddressCard />
          )}

          {formData.collectionMethod === "PICKUP" && enablePickupSlotSelection && (
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

          {formData.collectionMethod === "PICKUP" && !enablePickupSlotSelection && (
            <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-4 text-sm text-slate-700 space-y-1.5">
              <p className="font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-brand-action" /> Sample Collection
              </p>
              <p className="font-semibold text-slate-800">
                Sample will be collected within 24 - 48 hours.
              </p>
              <p className="text-xs text-slate-600">
                Our collection agent will coordinate promptly with you to collect your samples from the specified address.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
