"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

interface RegisterPasswordStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export function RegisterPasswordStep({
  formData,
  handleChange,
  showPassword,
  setShowPassword,
}: RegisterPasswordStepProps) {
  return (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Password</Label>
        <div className="relative">
          <Input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Confirm Password</Label>
        <Input
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          type="password"
          placeholder="••••••••"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex gap-1">
          <div className="h-1.5 flex-1 rounded-full bg-status-rejected" />
          <div className="h-1.5 flex-1 rounded-full bg-status-inprogress" />
          <div className="h-1.5 flex-1 rounded-full bg-primary" />
          <div className="h-1.5 flex-1 rounded-full bg-muted" />
        </div>
        <p className="text-xs text-muted-foreground">Password strength: Good</p>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="terms" defaultChecked />
        <Label htmlFor="terms" className="text-sm font-normal">
          I agree to the{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms &amp; Conditions
          </Link>
        </Label>
      </div>
    </>
  );
}
