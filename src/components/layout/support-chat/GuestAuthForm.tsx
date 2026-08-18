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
    <div className="p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col justify-center h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Connect with a Specialist</h3>
          <p className="text-xs text-slate-400">We will connect you directly with a lab expert</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Your Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="pl-10 h-11 bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-cyan-500 text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              type="tel"
              className="pl-10 h-11 bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-cyan-500 text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email Address (Optional)</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@company.com"
              type="email"
              className="pl-10 h-11 bg-slate-800/60 border-slate-700/60 text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-cyan-500 text-sm"
            />
          </div>
        </div>

        {error && <p className="text-xs text-rose-400 font-medium px-1">{error}</p>}

        <div className="pt-2 flex items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold"
          >
            Back to Bot
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 border-0 flex items-center justify-center gap-1.5"
          >
            <span>Start Live Chat</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] text-slate-500">
          <Shield className="h-3 w-3" />
          <span>Your contact info is strictly confidential and used for lab coordination.</span>
        </div>
      </form>
    </div>
  );
}
