"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthForgotPasswordFormProps {
  onSubmit: (identifier: string) => void;
  onGoToLogin: () => void;
  isLoading: boolean;
}

export function AuthForgotPasswordForm({ onSubmit, onGoToLogin, isLoading }: AuthForgotPasswordFormProps) {
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(identifier);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Email or phone number"
          className="h-12 pl-10 border-slate-200 placeholder:text-slate-400"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !identifier.trim()}
        className={cn(
          "w-full h-12 font-bold rounded-lg transition-all",
          isLoading || !identifier.trim()
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-gradient-brand text-white hover:opacity-90 shadow-md"
        )}
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Code"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Remember your password?{" "}
        <button type="button" onClick={onGoToLogin} className="text-brand-primary font-bold hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}
