"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuthOtpFormProps {
  otp: string[];
  onChangeOtp: (index: number, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  isLoading: boolean;
  prefix?: string;
  submitLabel?: string;
}

export function AuthOtpForm({
  otp,
  onChangeOtp,
  onSubmit,
  onResend,
  isLoading,
  prefix = "otp",
  submitLabel = "Verify & Proceed",
}: AuthOtpFormProps) {
  const isOtpComplete = otp.every((d) => d.trim().length === 1);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex justify-between gap-3 px-4">
        {otp.map((digit, i) => (
          <Input
            key={i}
            id={`${prefix}-${i}`}
            className="h-12 border-slate-200 text-center text-2xl font-bold"
            value={digit}
            maxLength={1}
            onChange={(e) => onChangeOtp(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digit && i > 0) {
                document.getElementById(`${prefix}-${i - 1}`)?.focus();
              }
            }}
          />
        ))}
      </div>
      <div className="text-center space-y-4">
        <Button
          type="submit"
          disabled={isLoading || !isOtpComplete}
          className="w-full h-12 bg-brand-action hover:bg-brand-action-hover text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : submitLabel}
        </Button>
        <p className="text-sm text-slate-500">
          Didn&apos;t receive the code?{" "}
          <button type="button" onClick={onResend} className="text-brand-action font-bold hover:underline">
            Resend OTP
          </button>
        </p>
      </div>
    </form>
  );
}
