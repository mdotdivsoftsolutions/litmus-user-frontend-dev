"use client";

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
  FileCheck, 
  Info 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  fssaiNo: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface ProfileInfoTabProps {
  formData: ProfileFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  isUpdating: boolean;
}

export function ProfileInfoTab({ formData, handleInputChange, onSave, isUpdating }: ProfileInfoTabProps) {
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
            <Label className="text-xs font-semibold text-slate-700">First Name</Label>
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
            <Label className="text-xs font-semibold text-slate-700">Last Name</Label>
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
            <div className="flex items-center justify-between">
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
            <Label className="text-xs font-semibold text-slate-700">Phone Number</Label>
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
        </div>
      </div>

      {/* 2. Business & Regulatory Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-action/10 text-brand-action flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Business & Compliance</h3>
              <p className="text-xs text-muted-foreground">Commercial entity and food regulatory identifiers</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-brand-action/10 text-brand-action text-[10px] font-semibold border-brand-action/20">
            FSSAI Verified
          </Badge>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Business / Brand Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="e.g. Qmark Labs & Co."
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-slate-700">FSSAI License Number</Label>
              <span className="text-[10px] text-muted-foreground">14-Digit Number</span>
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
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 flex items-start gap-3">
          <Info className="h-4 w-4 text-brand-action shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Your business name and FSSAI license number will be referenced across all test certificates, diagnostic reports, and NABL chain of custody records.
          </p>
        </div>
      </div>

      {/* 3. Address & Location Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-action/10 text-brand-action flex items-center justify-center">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Default Address & Dispatch Location</h3>
              <p className="text-xs text-muted-foreground">Pre-filled during sample collection & doorstep pickup bookings</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-semibold text-slate-700">Street Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="street"
                value={formData.street || ""}
                onChange={handleInputChange}
                placeholder="Flat / Building / Street address"
                className="pl-9 h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">City</Label>
            <Input
              name="city"
              value={formData.city || ""}
              onChange={handleInputChange}
              placeholder="e.g. Chennai"
              className="h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">State</Label>
            <Input
              name="state"
              value={formData.state || ""}
              onChange={handleInputChange}
              placeholder="e.g. Tamil Nadu"
              className="h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-brand-action"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Pincode</Label>
            <Input
              name="pincode"
              value={formData.pincode || ""}
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
