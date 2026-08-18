"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  MapPin,
  Lock,
  CheckCircle2,
  Loader2,
  Info,
  Truck,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  businessName: string;
  industryCategory?: string;
  customerSegment?: string;
  fssaiNo: string;
  gstNumber?: string;
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingPincode?: string;
  shippingStreet?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
}

interface ProfileInfoTabProps {
  formData: ProfileFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  isUpdating: boolean;
}

export function ProfileInfoTab({ formData, handleInputChange, onSave, isUpdating }: ProfileInfoTabProps) {
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const handleSameAsBillingToggle = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked) {
      handleInputChange({
        target: { name: "shippingStreet", value: formData.billingStreet || "" },
      } as any);
      handleInputChange({
        target: { name: "shippingCity", value: formData.billingCity || "" },
      } as any);
      handleInputChange({
        target: { name: "shippingState", value: formData.billingState || "" },
      } as any);
      handleInputChange({
        target: { name: "shippingPincode", value: formData.billingPincode || "" },
      } as any);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Personal Details Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-action/10 text-brand-action flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
              <p className="text-xs text-muted-foreground">Your primary identification and contact credentials</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-slate-50 text-slate-600 text-[10px] font-semibold border-slate-200">
            Account Holder
          </Badge>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">First Name</Label>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">Last Name</Label>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">Email Address</Label>
              <span className="text-[10px] font-medium text-brand-action flex items-center gap-1">
                <Lock className="h-3 w-3" /> Verified Login
              </span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                className="pl-9 h-10 rounded-xl bg-slate-50/80 border-slate-200 text-sm text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">Mobile Number</Label>
              <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                <Check className="h-3 w-3" /> Primary Contact
              </span>
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit mobile number"
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">Alternate Phone / Secondary Contact (Optional)</Label>
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="alternatePhone"
                value={formData.alternatePhone || ""}
                onChange={handleInputChange}
                placeholder="+91... (e.g. Lab Coordinator or Facility Supervisor)"
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Business & Regulatory Details Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-action/10 text-brand-action flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Business & Regulatory Details</h3>
              <p className="text-xs text-muted-foreground">Commercial entity, GSTIN, and food safety regulatory identifiers</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-brand-action/10 text-brand-action text-[10px] font-semibold border-brand-action/20">
            NABL / FSSAI Compliant
          </Badge>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">Company / Organization / Brand Name</Label>
            </div>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="e.g. Acme Organic Foods Pvt Ltd"
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">Industry / Product Category</Label>
            </div>
            <select
              name="industryCategory"
              value={formData.industryCategory || "General Food & Beverage"}
              onChange={handleInputChange}
              className="w-full h-10 rounded-xl bg-white border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-action"
            >
              <option value="General Food & Beverage">General Food & Beverage</option>
              <option value="Dairy Products & Milk">Dairy Products & Milk</option>
              <option value="Spices, Condiments & Seasonings">Spices, Condiments & Seasonings</option>
              <option value="Edible Oils, Fats & Ghee">Edible Oils, Fats & Ghee</option>
              <option value="Meat, Poultry & Seafood">Meat, Poultry & Seafood</option>
              <option value="Packaged Foods & Snacks">Packaged Foods & Snacks</option>
              <option value="Beverages & Bottled Water">Beverages & Bottled Water</option>
              <option value="Nutraceuticals & Dietary Supplements">Nutraceuticals & Dietary Supplements</option>
              <option value="Hospitality, Bakery & HoReCa">Hospitality, Bakery & HoReCa</option>
              <option value="Agriculture & Raw Ingredients">Agriculture & Raw Ingredients</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">FSSAI License Number</Label>
              <span className="text-[10px] text-muted-foreground font-mono">14-Digit License</span>
            </div>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="fssaiNo"
                value={formData.fssaiNo}
                onChange={handleInputChange}
                placeholder="e.g. 10018021003456"
                maxLength={14}
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm font-mono focus-visible:ring-brand-action"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">GSTIN Tax Identification Number</Label>
              <span className="text-[10px] text-muted-foreground font-mono">15-Digit GSTIN</span>
            </div>
            <div className="relative">
              <FileSpreadsheet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="gstNumber"
                value={formData.gstNumber || ""}
                onChange={handleInputChange}
                placeholder="e.g. 29ABCDE1234F1Z5"
                maxLength={15}
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm font-mono uppercase focus-visible:ring-brand-action"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">Customer Segment</Label>
            </div>
            <select
              name="customerSegment"
              value={formData.customerSegment || "INDIVIDUAL"}
              onChange={handleInputChange}
              className="w-full h-10 rounded-xl bg-white border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-action"
            >
              <option value="INDIVIDUAL">Individual Consumer / Home Business</option>
              <option value="FOOD_BUSINESS">Commercial Food Manufacturer / Brand</option>
              <option value="ENTERPRISE">Enterprise / Exporter / Bulk Processor</option>
              <option value="LAB_PARTNER">Accredited Laboratory Partner</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 flex items-start gap-3">
          <Info className="h-4 w-4 text-brand-action shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Your business name, GSTIN, and FSSAI license number will be automatically printed on tax invoices, NABL test certificates, and official regulatory lab reports.
          </p>
        </div>
      </div>

      {/* 3. Primary Billing Address Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-action/10 text-brand-action flex items-center justify-center">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Primary Billing Address</h3>
              <p className="text-xs text-muted-foreground">Used for official tax invoices and financial billing</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">Street Address / Facility</Label>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="billingStreet"
                value={formData.billingStreet || ""}
                onChange={handleInputChange}
                placeholder="Unit, Building, Industrial Area or Street"
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">City</Label>
            </div>
            <Input
              name="billingCity"
              value={formData.billingCity || ""}
              onChange={handleInputChange}
              placeholder="e.g. Chennai"
              className="h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">State</Label>
            </div>
            <Input
              name="billingState"
              value={formData.billingState || ""}
              onChange={handleInputChange}
              placeholder="e.g. Tamil Nadu"
              className="h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">Pincode</Label>
            </div>
            <Input
              name="billingPincode"
              value={formData.billingPincode || ""}
              onChange={handleInputChange}
              placeholder="e.g. 600001"
              maxLength={6}
              className="h-10 rounded-xl bg-white border-slate-200 text-sm font-mono focus-visible:ring-brand-action"
            />
          </div>
        </div>
      </div>

      {/* 4. Sample Pickup Address Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3.5 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-action/10 text-brand-action flex items-center justify-center">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sample Pickup Address</h3>
              <p className="text-xs text-muted-foreground">Default physical collection hub for sample logistics and field dispatch</p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-action hover:underline">
            <Checkbox
              checked={sameAsBilling}
              onCheckedChange={handleSameAsBillingToggle}
              className="data-[state=checked]:bg-brand-action"
            />
            <span>Same as Billing Address</span>
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">Pickup Street / Factory / Collection Hub</Label>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="shippingStreet"
                value={formData.shippingStreet || ""}
                onChange={handleInputChange}
                placeholder="Factory Gate, Warehouse, Lab Delivery Hub or Pickup Street"
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">City</Label>
            </div>
            <Input
              name="shippingCity"
              value={formData.shippingCity || ""}
              onChange={handleInputChange}
              placeholder="e.g. Chennai"
              className="h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">State</Label>
            </div>
            <Input
              name="shippingState"
              value={formData.shippingState || ""}
              onChange={handleInputChange}
              placeholder="e.g. Tamil Nadu"
              className="h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between h-5">
              <Label className="text-xs font-semibold text-slate-700">Pincode</Label>
            </div>
            <Input
              name="shippingPincode"
              value={formData.shippingPincode || ""}
              onChange={handleInputChange}
              placeholder="e.g. 600001"
              maxLength={6}
              className="h-10 rounded-xl bg-white border-slate-200 text-sm font-mono focus-visible:ring-brand-action"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <p className="text-xs text-slate-500 font-medium">
          Make sure all changes are accurate before saving.
        </p>
        <Button
          disabled={isUpdating}
          onClick={onSave}
          className="bg-brand-action hover:bg-brand-action-hover text-white rounded-xl h-10 px-6 font-semibold shadow-xs flex items-center gap-2"
        >
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Save Profile Changes
        </Button>
      </div>
    </div>
  );
}
