"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ShoppingCart, Check, Loader2, MessageCircle, Shield, Lock, Tag, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/constants";

interface TestBookingSidebarProps {
  testObj: any;
  price: number;
  originalPrice: number;
  discountAmount: number;
  selectedParamsCount: number;
  totalParamsCount: number;
  isInCart: boolean;
  isAddingToCart: boolean;
  onAddToCart: () => void;
  onBookNow: () => void;
}

export function TestBookingSidebar({
  testObj,
  price,
  originalPrice,
  discountAmount,
  selectedParamsCount,
  totalParamsCount,
  isInCart,
  isAddingToCart,
  onAddToCart,
  onBookNow,
}: TestBookingSidebarProps) {
  return (
    <div className="lg:col-span-2">
      <div className="lg:sticky lg:top-28">
        <Card className="border border-border shadow-lg rounded-2xl overflow-hidden">
          {/* Teal header strip */}
          <div className="bg-brand-action px-6 py-4">
            <h3 className="font-heading font-bold text-base text-white/90 leading-snug line-clamp-1">
              {testObj.testName}
            </h3>
            <div className="flex gap-1.5 mt-2">
              <Badge className="bg-white/15 text-white border-0 text-[10px] font-bold tracking-wide px-2 py-0.5">
                NABL
              </Badge>
              <Badge className="bg-white/15 text-white border-0 text-[10px] font-bold tracking-wide px-2 py-0.5">
                FSSAI
              </Badge>
            </div>
          </div>

          <CardContent className="p-5 space-y-5">
            {/* Price block */}
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2.5">
                <span
                  suppressHydrationWarning
                  className="font-data text-4xl font-extrabold text-foreground leading-none tracking-tight"
                >
                  ₹{formatCurrency(price)}
                </span>
                {originalPrice > price && (
                  <span
                    suppressHydrationWarning
                    className="font-data text-sm text-muted-foreground line-through font-normal"
                  >
                    ₹{formatCurrency(originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {discountAmount > 0 && (
                  <span className="inline-flex items-center gap-1 font-data-badge text-xs font-bold text-brand-action bg-brand-action/10 px-2.5 py-1 rounded-full border border-brand-action/20">
                    <Tag className="h-3 w-3" />
                    {testObj.discountType === "PERCENTAGE"
                      ? `${testObj.discountValue}% OFF`
                      : `₹${testObj.discountValue} OFF`}{" "}
                    applied
                  </span>
                )}
                <span className="font-body text-xs text-muted-foreground">
                  {selectedParamsCount} of {totalParamsCount || 1} params selected
                </span>
              </div>
            </div>

            {/* Turnaround time */}
            <div className="flex items-center gap-2.5 bg-brand-action/5 border border-brand-action/15 px-4 py-3 rounded-xl">
              <Clock className="h-4 w-4 text-brand-action shrink-0" />
              <span className="font-body text-sm text-brand-action font-semibold">
                Reports in {testObj.turnAroundTime || "3-5 working days"}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5">
              <Button
                onClick={onAddToCart}
                disabled={isInCart || isAddingToCart}
                className="w-full bg-brand-action hover:bg-brand-action-hover font-body font-bold text-sm text-white rounded-xl gap-2 h-12 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isInCart ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                {isInCart ? "Added to Cart" : "Add to Cart"}
              </Button>

              <Button
                onClick={onBookNow}
                className="w-full bg-transparent hover:bg-brand-action text-brand-action hover:text-white border-2 border-brand-action font-body font-bold text-sm h-12 rounded-xl transition-all duration-200 active:scale-[0.98] gap-2"
              >
                <Zap className="h-4 w-4" />
                Book Now
              </Button>
            </div>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-brand-action transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Need help? Chat on WhatsApp
            </a>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
              {[
                { icon: Shield, label: "100% Accurate" },
                { icon: Shield, label: "NABL Certified" },
                { icon: Lock, label: "Secure Payment" },
                { icon: MessageCircle, label: "WhatsApp Reports" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground"
                >
                  <b.icon className="h-3.5 w-3.5 text-brand-action shrink-0" />
                  {b.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
