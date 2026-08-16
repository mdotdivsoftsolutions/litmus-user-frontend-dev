"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  fssaiNo: string;
}

interface ProfileInfoTabProps {
  formData: ProfileFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  isUpdating: boolean;
}

export function ProfileInfoTab({ formData, handleInputChange, onSave, isUpdating }: ProfileInfoTabProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Profile Information</h2>
        <p className="text-sm text-muted-foreground">Manage your personal and business details.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">First Name</Label>
          <Input name="firstName" value={formData.firstName} onChange={handleInputChange} className="h-10 rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Last Name</Label>
          <Input name="lastName" value={formData.lastName} onChange={handleInputChange} className="h-10 rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Email Address</Label>
          <Input name="email" value={formData.email} onChange={handleInputChange} className="h-10 rounded-lg" disabled />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Phone Number</Label>
          <Input name="phone" value={formData.phone} onChange={handleInputChange} className="h-10 rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Business Name</Label>
          <Input name="businessName" value={formData.businessName} onChange={handleInputChange} className="h-10 rounded-lg" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-semibold text-muted-foreground">FSSAI License No.</Label>
          <Input name="fssaiNo" value={formData.fssaiNo} onChange={handleInputChange} className="h-10 rounded-lg" />
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button disabled={isUpdating} onClick={onSave} className="bg-brand-action hover:bg-brand-action-hover text-white rounded-lg h-10 px-6">
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
