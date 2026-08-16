"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepAddressScheduleProps {
  formData: any;
  onChange: (field: string, value: string) => void;
}

export function StepAddressSchedule({ formData, onChange }: StepAddressScheduleProps) {
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-[1.3]">
          4. Sample Pickup & Contact Details
        </h2>
        <p className="font-body text-slate-500 text-sm mt-1 leading-[1.5]">
          Specify the facility address where our cold-chain specialist will collect the samples.
        </p>
      </div>

      <Card className="border border-slate-100 rounded-2xl bg-white shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Contact Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Facility / Pickup Street Address *</Label>
              <Input
                value={formData.address}
                onChange={(e) => onChange("address", e.target.value)}
                placeholder="Building No, Street, Landmark"
              />
            </div>
            <div className="space-y-1.5">
              <Label>City *</Label>
              <Input
                value={formData.city}
                onChange={(e) => onChange("city", e.target.value)}
                placeholder="Chennai"
              />
            </div>
            <div className="space-y-1.5">
              <Label>PIN Code *</Label>
              <Input
                value={formData.pincode}
                onChange={(e) => onChange("pincode", e.target.value)}
                placeholder="600001"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Preferred Pickup Date *</Label>
              <Input
                type="date"
                min={minDate}
                value={formData.pickupDate}
                onChange={(e) => onChange("pickupDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Preferred Time Window *</Label>
              <select
                value={formData.pickupTime}
                onChange={(e) => onChange("pickupTime", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-action"
              >
                <option value="" disabled>Select a time window</option>
                <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM (Morning)</option>
                <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM (Afternoon)</option>
                <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM (Evening)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
