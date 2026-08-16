"use client";

import { Package } from "lucide-react";

interface OrderSampleBreakdownProps {
  items?: any[];
}

export function OrderSampleBreakdown({ items }: OrderSampleBreakdownProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900 border-b border-border pb-2">Sample Breakdown</h2>
      <div className="grid gap-4">
        {items?.map((item: any, i: number) => (
          <div key={i} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-border p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-bold text-slate-900 text-sm">{item.testId?.testName || item.packageId?.name}</h3>
              </div>
              <span className="font-bold text-slate-900 text-sm">₹{(item.price || 0).toLocaleString()}</span>
            </div>
            <div className="p-4 space-y-4">
              {item.samples?.map((sample: any, sIdx: number) => (
                <div key={sIdx} className="border border-border/50 rounded-lg p-4 bg-slate-50/50 text-sm">
                  <div className="flex justify-between items-start mb-3 border-b border-border/50 pb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                        Sample {sIdx + 1}
                      </span>
                      <span className="font-bold text-slate-900">{sample.productName || "Unnamed Product"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                        Quantity
                      </span>
                      <span className="font-medium text-slate-700">{sample.quantity || "N/A"}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Batch</span>
                      <span className="text-xs font-mono">{sample.batchNumber || "-"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">SKU</span>
                      <span className="text-xs font-mono">{sample.sku || "-"}</span>
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Specifics</span>
                      <span className="text-xs text-slate-600 line-clamp-1" title={sample.specifics}>
                        {sample.specifics || "-"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Parameters to Test
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sample.selectedParameters?.map((param: string, pIdx: number) => (
                        <span key={pIdx} className="text-[10px] bg-white border border-border px-2 py-0.5 rounded-full font-medium text-slate-700">
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
