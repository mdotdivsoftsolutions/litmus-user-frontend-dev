"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthResetSuccessProps {
  onGoToLogin: () => void;
}

export function AuthResetSuccess({ onGoToLogin }: AuthResetSuccessProps) {
  return (
    <div className="flex flex-col items-center text-center py-6 gap-5">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
        <CheckCircle2 className="h-9 w-9 text-green-500" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-800">Password Reset!</h3>
        <p className="text-sm text-slate-500">Your password has been updated successfully.</p>
      </div>
      <Button
        onClick={onGoToLogin}
        className="w-full h-12 bg-gradient-brand text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-all"
      >
        Back to Sign In
      </Button>
    </div>
  );
}
