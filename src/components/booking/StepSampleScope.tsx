"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FlaskConical } from "lucide-react";
import type { CartLine } from "@/hooks/useBookingWizard";

interface StepSampleScopeProps {
  items: CartLine[];
  onToggleParam: (itemIndex: number, sampleIndex: number, paramName: string) => void;
}

export function StepSampleScope({ items, onToggleParam }: StepSampleScopeProps) {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
        <p className="font-body text-slate-500 text-sm">No items in your booking. Please add a test or package first.</p>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.availableParameters?.map((param: any) => {
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
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
