"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthLoginFormProps {
  onSubmit: (emailOrPhone: string, pass: string) => void;
  onGoToRegister: () => void;
  onGoToForgot: () => void;
  isLoading: boolean;
}

export function AuthLoginForm({ onSubmit, onGoToRegister, onGoToForgot, isLoading }: AuthLoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(identifier, password);
  };

  const isFormValid = !!(identifier.trim() && password);

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="h-12 pl-10 pr-10 border-slate-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onGoToForgot}
            className="text-xs font-semibold text-slate-500 hover:text-brand-primary transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !isFormValid}
          className={cn(
            "w-full h-12 font-bold rounded-lg transition-all",
            isLoading || !isFormValid
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-gradient-brand text-white hover:opacity-90 shadow-md"
          )}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onGoToRegister} className="text-brand-primary font-bold hover:underline">
          Register now
        </button>
      </p>
    </div>
  );
}
