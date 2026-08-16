"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Banknote, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepPaymentProps {
  paymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
  total: number;
}

export function StepPayment({ paymentMethod, onSelectPaymentMethod, total }: StepPaymentProps) {
  const methods = [
    {
      id: "online",
      title: "Online Payment (UPI, Cards, NetBanking)",
      subtitle: "Instant confirmation & automated invoice generation",
      icon: CreditCard,
    },
    {
      id: "bank_transfer",
      title: "Corporate NEFT / RTGS Transfer",
      subtitle: "Pay via company bank account with GST invoice",
      icon: Building2,
    },
    {
      id: "cash_on_pickup",
      title: "Pay upon Sample Collection",
      subtitle: "Pay our field executive via QR code during pickup",
      icon: Banknote,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-[1.3]">
          5. Select Payment Mode
        </h2>
        <p className="font-body text-slate-500 text-sm mt-1 leading-[1.5]">
          All transactions are 100% encrypted and secured with 256-bit SSL protocols.
        </p>
      </div>

      <div className="space-y-3">
        {methods.map((m) => {
          const Icon = m.icon;
          const isSelected = paymentMethod === m.id;

          return (
            <Card
              key={m.id}
              onClick={() => onSelectPaymentMethod(m.id)}
              className={cn(
                "cursor-pointer border-2 rounded-2xl transition-all bg-white shadow-sm hover:shadow-md",
                isSelected
                  ? "border-brand-action ring-2 ring-brand-action/20"
                  : "border-slate-100 hover:border-slate-200"
              )}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-brand-action/10 text-brand-action flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">{m.title}</h3>
                    <p className="font-body text-xs text-slate-500">{m.subtitle}</p>
                  </div>
                </div>

                <div className="h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 border-slate-300">
                  {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-brand-action" />}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
