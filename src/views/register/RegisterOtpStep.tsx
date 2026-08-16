"use client";

import { Input } from "@/components/ui/input";

interface RegisterOtpStepProps {
  email: string;
  otp: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RegisterOtpStep({ email, otp, handleChange }: RegisterOtpStepProps) {
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-muted-foreground">Enter the 6-digit OTP sent to {email}</p>
      <Input
        name="otp"
        value={otp}
        onChange={handleChange}
        placeholder="123456"
        className="text-center text-xl tracking-[0.5em]"
        maxLength={6}
      />
    </div>
  );
}
