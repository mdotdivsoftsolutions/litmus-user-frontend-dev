"use client";

import { useState } from "react";
import { User, Phone, Mail, ArrowRight, Shield, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GuestAuthFormProps {
  onSubmit: (data: { name: string; phone: string; email?: string }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function GuestAuthForm({ onSubmit, onCancel, isSubmitting = false }: GuestAuthFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide your name");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    onSubmit({ name: name.trim(), phone: phone.trim(), email: email.trim() || undefined });
  };

  return (
    <div
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="absolute inset-0 p-4 sm:p-5 bg-white text-slate-900 flex flex-col overflow-y-auto overscroll-contain z-10"
    >
      <div className="flex-1 flex flex-col justify-center min-h-max py-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight leading-tight">Connect with a Specialist</h3>
            <p className="text-[11px] text-slate-500">We will connect you directly with a lab expert</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Your Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="pl-9 h-9 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:ring-brand-action text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                type="tel"
                className="pl-9 h-9 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:ring-brand-action text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address (Optional)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@company.com"
                type="email"
                className="pl-9 h-9 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:ring-brand-action text-xs"
              />
            </div>
          </div>

          {error && <p className="text-[10px] text-rose-500 font-medium px-1">{error}</p>}

          <div className="pt-2 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-9 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
            >
              Back to Bot
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] h-9 rounded-xl bg-brand-action hover:bg-brand-action-hover text-white font-bold text-xs shadow-md shadow-brand-action/20 border-0 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Start Live Chat</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-[9px] text-slate-400 font-medium text-center">
            <Shield className="h-3 w-3 shrink-0" />
            <span className="leading-tight">Your contact info is strictly confidential and used for lab coordination.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
