"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthResetPasswordFormProps {
  onSubmit: (password: string) => void;
  isLoading: boolean;
}

export function AuthResetPasswordForm({ onSubmit, isLoading }: AuthResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirm, setShowNewConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newConfirmPassword) return;
    onSubmit(newPassword);
  };

  const isMismatch = newConfirmPassword && newPassword !== newConfirmPassword;
  const isFormValid = newPassword && newConfirmPassword && newPassword === newConfirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type={showNewPassword ? "text" : "password"}
          placeholder="New password"
          className="h-12 pl-10 pr-10 border-slate-200"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type={showNewConfirm ? "text" : "password"}
          placeholder="Confirm new password"
          className={cn("h-12 pl-10 pr-10 border-slate-200", isMismatch && "border-red-400")}
          value={newConfirmPassword}
          onChange={(e) => setNewConfirmPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowNewConfirm(!showNewConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showNewConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {isMismatch && <p className="text-xs text-red-500">Passwords do not match</p>}

      <Button
        type="submit"
        disabled={isLoading || !isFormValid}
        className={cn(
          "w-full h-12 font-bold rounded-lg transition-all",
          isLoading || !isFormValid
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-brand-action hover:bg-brand-action-hover text-white shadow-md active:scale-95"
        )}
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
      </Button>
    </form>
  );
}
