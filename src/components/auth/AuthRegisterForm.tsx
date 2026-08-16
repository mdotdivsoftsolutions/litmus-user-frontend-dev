"use client";

import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthRegisterFormProps {
  onSubmit: (data: { name: string; email: string; phone: string; pass: string }) => void;
  onGoToLogin: () => void;
  isLoading: boolean;
}

export function AuthRegisterForm({ onSubmit, onGoToLogin, isLoading }: AuthRegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    onSubmit({ name, email, phone, pass: password });
  };

  const isMismatch = confirmPassword && password !== confirmPassword;
  const isFormValid = name && email && phone && password && password === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Full name"
          className="h-12 pl-10 border-slate-200 placeholder:text-slate-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="email"
          placeholder="Email address"
          className="h-12 pl-10 border-slate-200 placeholder:text-slate-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="tel"
          placeholder="Mobile number"
          className="h-12 pl-10 border-slate-200 placeholder:text-slate-400"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Create password"
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

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm password"
          className={cn("h-12 pl-10 pr-10 border-slate-200", isMismatch && "border-red-400")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {isMismatch && <p className="text-xs text-red-500 -mt-2">Passwords do not match</p>}

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
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button type="button" onClick={onGoToLogin} className="text-brand-primary font-bold hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}
