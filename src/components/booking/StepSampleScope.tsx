"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FlaskConical, Loader2 } from "lucide-react";
import type { CartLine } from "@/hooks/useBookingWizard";

interface StepSampleScopeProps {
  items: CartLine[];
  isLoading?: boolean;
  onToggleParam: (itemIndex: number, sampleIndex: number, paramName: string) => void;
}

export function StepSampleScope({ items, isLoading, onToggleParam }: StepSampleScopeProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-action mb-4" />
        <p className="font-body text-slate-500 text-sm">Loading items from your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <FlaskConical className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="font-heading text-lg font-bold text-slate-900">No items in your booking</h3>
        <p className="font-body text-slate-500 text-sm mt-2 max-w-sm">
          Add a test or package to your cart first. Your selection will appear here automatically.
        </p>
        <Button asChild className="mt-6 bg-brand-action hover:bg-brand-action-hover text-white rounded-xl h-11 px-6 font-semibold">
          <Link href="/tests">Browse tests</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-[1.3]">
          1. Select Testing Scope & Parameters
        </h2>
        <p className="font-body text-slate-500 text-sm mt-1 leading-[1.5]">
          Customize specific analytes for each product sample in your booking order.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item, itemIdx) => (
          <Card key={item.id} className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
                <div className="h-10 w-10 rounded-xl bg-brand-action/10 flex items-center justify-center text-brand-action">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900 leading-[1.3]">{item.product}</h3>
                  <p className="font-body text-xs text-slate-400 font-medium">{item.category || "Test Panel"}</p>
                </div>
              </div>

              {item.samples.map((sample, sampleIdx) => (
                <div key={sample.id} className="space-y-3">
                  <p className="font-body text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Sample {sampleIdx + 1}: {sample.productName}
                  </p>

                  {(!item.availableParameters || item.availableParameters.length === 0) ? (
                    <p className="font-body text-sm text-slate-500">No parameters listed for this item.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {item.availableParameters.map((param: any) => {
                        const isChecked = sample.selectedParameters.includes(param.name);
                        return (
                          <div
                            key={param.name}
                            onClick={() => onToggleParam(itemIdx, sampleIdx, param.name)}
                            className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <Checkbox checked={isChecked} onCheckedChange={() => onToggleParam(itemIdx, sampleIdx, param.name)} />
                              <span className="font-body text-sm font-medium text-slate-800">{param.name}</span>
                            </div>
                            {param.price > 0 && (
                              <span className="font-data text-xs font-bold text-brand-action">₹{param.price}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
