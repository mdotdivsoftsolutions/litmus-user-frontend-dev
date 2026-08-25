"use client";

import { useState } from "react";
import { Building2, Copy, Check, MapPin, Phone, Mail, Clock, AlertTriangle } from "lucide-react";
import { LITMUS_COURIER_ADDRESS } from "@/constants/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CourierAddressCardProps {
  className?: string;
  orderId?: string;
  compact?: boolean;
}

export function CourierAddressCard({ className, orderId, compact = false }: CourierAddressCardProps) {
  const [copied, setCopied] = useState(false);
  const addr = LITMUS_COURIER_ADDRESS;

  const fullAddressString = [
    addr.facilityName,
    `Attn: ${addr.attention}`,
    orderId ? `Order ID: ${orderId}` : null,
    addr.street,
    `${addr.city}, ${addr.state} - ${addr.pincode}`,
    `Phone: ${addr.phone}`,
    `Email: ${addr.email}`,
  ]
    .filter(Boolean)
    .join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullAddressString);
      setCopied(true);
      toast.success("Courier shipping address copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy address");
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/60 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-indigo-100/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Litmus Sample Dispatch Address
              </h4>
              <Badge variant="outline" className="bg-indigo-100/80 text-indigo-800 border-indigo-200 text-[10px] font-bold">
                Courier Destination
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Ship all physical food/water samples directly to our intake facility
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleCopy}
          className={cn(
            "h-8 px-3 text-xs font-bold gap-1.5 transition-all shadow-sm",
            copied
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy Full Address
            </>
          )}
        </Button>
      </div>

      {/* Address Details Grid */}
      <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div className="space-y-1.5 bg-white/90 p-3.5 rounded-lg border border-indigo-100 shadow-2xs">
          <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-indigo-600 shrink-0" />
            {addr.facilityName}
          </p>
          <p className="text-indigo-950 font-semibold pl-5">
            Attn: {addr.attention}
          </p>
          <p className="text-slate-700 leading-relaxed pl-5 font-medium">
            {addr.street}
          </p>
          <p className="font-bold text-slate-900 pl-5">
            {addr.city}, {addr.state} — <span className="text-indigo-600 tracking-wider">{addr.pincode}</span>
          </p>
        </div>

        <div className="space-y-2 bg-white/90 p-3.5 rounded-lg border border-indigo-100 shadow-2xs flex flex-col justify-center text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Phone className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span>Facility Phone: </span>
            <span className="font-bold text-slate-900">{addr.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Mail className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span>Logistics Desk: </span>
            <span className="font-bold text-slate-900">{addr.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Clock className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span>Receiving Hours: </span>
            <span className="font-semibold text-slate-800">{addr.workingHours}</span>
          </div>
        </div>
      </div>

      {/* Guidelines Box */}
      {!compact && (
        <div className="rounded-lg bg-amber-50/90 border border-amber-200/70 p-3 text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-amber-950">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            Important Sample Packaging Instructions:
          </p>
          <ul className="list-disc pl-5 space-y-0.5 text-[11px] font-medium text-amber-900/90 leading-relaxed">
            <li>Pack samples in sterile, leak-proof airtight containers (use gel ice packs for perishable goods).</li>
            <li>Clearly write your <strong>Order ID</strong> on the outer box.</li>
            <li>Once dispatched via Blue Dart, DTDC, Delhivery, etc., enter your <strong>Tracking AWB number</strong> in the order dashboard.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
