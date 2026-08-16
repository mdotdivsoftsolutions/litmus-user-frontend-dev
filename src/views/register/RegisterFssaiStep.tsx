"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface RegisterFssaiStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RegisterFssaiStep({ formData, handleChange }: RegisterFssaiStepProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">FSSAI License Number</Label>
          <Input name="fssaiNumber" value={formData.fssaiNumber} onChange={handleChange} placeholder="10012345000123" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">FSSAI Expiry Date</Label>
          <Input type="date" name="fssaiExpiry" value={formData.fssaiExpiry} onChange={handleChange} />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">GST Number</Label>
        <Input name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="33AABCU9603R1ZM" />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Upload FSSAI Certificate</Label>
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary transition-colors cursor-pointer bg-muted/30">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Drag &amp; drop or click to upload</span>
            <span className="text-xs text-muted-foreground/60">PDF, JPG, PNG up to 5MB</span>
          </div>
        </div>
      </div>
    </>
  );
}
