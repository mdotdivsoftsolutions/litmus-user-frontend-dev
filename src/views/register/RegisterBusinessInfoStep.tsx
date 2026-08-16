"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RegisterBusinessInfoStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function RegisterBusinessInfoStep({ formData, handleChange, setFormData }: RegisterBusinessInfoStepProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Business Name</Label>
          <Input name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Kumar Dairy Foods" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Owner Name</Label>
          <Input name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Rajesh Kumar" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Mobile Number</Label>
          <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Email</Label>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Business Type</Label>
        <Select
          value={formData.businessType || undefined}
          onValueChange={(val) => setFormData((prev: any) => ({ ...prev, businessType: val }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {["Manufacturer", "Trader", "Importer", "Retailer"].map((t) => (
              <SelectItem key={t} value={t.toLowerCase()}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Address</Label>
        <Input name="address" value={formData.address} onChange={handleChange} placeholder="123, Industrial Area" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">City</Label>
          <Input name="city" value={formData.city} onChange={handleChange} placeholder="Chennai" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">State</Label>
          <Input name="state" value={formData.state} onChange={handleChange} placeholder="Tamil Nadu" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">PIN Code</Label>
          <Input name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="600001" />
        </div>
      </div>
    </>
  );
}
