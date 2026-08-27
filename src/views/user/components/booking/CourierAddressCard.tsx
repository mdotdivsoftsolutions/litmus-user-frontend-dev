"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Copy, Check, MapPin, Phone, Mail, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { LITMUS_COURIER_ADDRESS } from "@/constants/config";
import { settingsApi } from "@/lib/api/settings";
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

  const { data: settingsData } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: settingsApi.getPublicSettings,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  const backendAddr = settingsData?.data?.courierAddress;

  const addr = {
    facilityName: backendAddr?.facilityName || LITMUS_COURIER_ADDRESS.facilityName,
    attention: backendAddr?.attention || LITMUS_COURIER_ADDRESS.attention,
    street: backendAddr?.street || LITMUS_COURIER_ADDRESS.street,
    city: backendAddr?.city || LITMUS_COURIER_ADDRESS.city,
    state: backendAddr?.state || LITMUS_COURIER_ADDRESS.state,
    pincode: backendAddr?.pincode || LITMUS_COURIER_ADDRESS.pincode,
    phone: backendAddr?.phone || LITMUS_COURIER_ADDRESS.phone,
    email: backendAddr?.email || LITMUS_COURIER_ADDRESS.email,
    workingHours: backendAddr?.workingHours || LITMUS_COURIER_ADDRESS.workingHours,
  };

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
        "rounded-xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/40 via-white to-slate-50/60 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-brand-action text-white flex items-center justify-center shadow-xs">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Litmus Sample Dispatch Address
              </h4>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
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
            "h-8 px-3 text-xs font-bold gap-1.5 transition-all shadow-xs",
            copied
              ? "bg-emerald-700 hover:bg-emerald-800 text-white"
              : "bg-brand-action hover:bg-brand-action-hover text-white active:scale-95"
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
        <div className="space-y-1.5 bg-white/95 p-3.5 rounded-lg border border-emerald-100/90 shadow-2xs">
          <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-action shrink-0" />
            {addr.facilityName}
          </p>
          <p className="text-slate-800 font-semibold pl-5 text-xs">
            Attn: {addr.attention}
          </p>
          <p className="text-slate-600 leading-relaxed pl-5 font-medium text-xs">
            {addr.street}
          </p>
          <p className="font-bold text-slate-900 pl-5 text-xs">
            {addr.city}, {addr.state} — <span className="text-brand-action tracking-wider font-extrabold">{addr.pincode}</span>
          </p>
        </div>

        <div className="space-y-2 bg-white/95 p-3.5 rounded-lg border border-emerald-100/90 shadow-2xs flex flex-col justify-center text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Phone className="h-3.5 w-3.5 text-brand-action shrink-0" />
            <span className="shrink-0 text-slate-600">Phone:</span>
            <span className="font-bold text-slate-900 whitespace-nowrap">{addr.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Mail className="h-3.5 w-3.5 text-brand-action shrink-0" />
            <span className="shrink-0 text-slate-600">Email:</span>
            <span className="font-bold text-slate-900 truncate">{addr.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Clock className="h-3.5 w-3.5 text-brand-action shrink-0" />
            <span className="shrink-0 text-slate-600">Intake:</span>
            <span className="font-semibold text-slate-800 whitespace-nowrap">{addr.workingHours}</span>
          </div>
        </div>
      </div>

      {/* Guidelines Box */}
      {!compact && (
        <div className="rounded-xl bg-amber-50/90 border border-amber-200/90 p-4 text-xs text-amber-950 space-y-2.5">
          <p className="font-bold flex items-center gap-1.5 text-amber-950 text-xs">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            Important Sample Packaging Instructions:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[11px] font-medium text-amber-900 leading-relaxed">
            <li>Pack samples in sterile, leak-proof airtight containers (use gel ice packs for perishable goods).</li>
            <li>Clearly write your <strong>Order ID</strong> on the outer box.</li>
            <li>
              Once dispatched via Blue Dart, DTDC, Delhivery, or any courier partner, submit your <strong>Tracking / AWB Number</strong>:
            </li>
          </ul>

          {/* Navigation Path Showcase */}
          <div className="rounded-lg bg-white/95 border border-amber-200/80 p-2.5 shadow-2xs space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Where to update tracking ID:
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-800 font-medium">
              <span className="inline-flex items-center gap-1 bg-slate-100/90 text-slate-900 px-2 py-1 rounded-md font-semibold">
                Go to <strong className="font-bold text-brand-action">Orders</strong>
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="inline-flex items-center gap-1 bg-slate-100/90 text-slate-900 px-2 py-1 rounded-md font-semibold">
                Select <strong className="font-bold text-brand-action">Booking</strong>
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-md font-bold">
                Enter Tracking / AWB ID
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
