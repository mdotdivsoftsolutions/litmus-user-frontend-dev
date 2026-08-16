"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartLine, SampleDetail } from "@/hooks/useBookingWizard";

interface StepSampleDetailsProps {
  items: CartLine[];
  onUpdateSample: (itemIdx: number, sampleIdx: number, field: keyof SampleDetail, value: string) => void;
  onAddSample: (itemIdx: number) => void;
  onRemoveSample: (itemIdx: number, sampleIdx: number) => void;
}

export function StepSampleDetails({ items, onUpdateSample, onAddSample, onRemoveSample }: StepSampleDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-[1.3]">
          2. Sample Batch Information
        </h2>
        <p className="font-body text-slate-500 text-sm mt-1 leading-[1.5]">
          Provide product names, batch identifiers, or SKU numbers for traceability on your NABL certificate.
        </p>
      </div>

      <div className="space-y-6">
        {items.map((item, itemIdx) => (
          <div key={item.id} className="space-y-4">
            <h3 className="font-heading text-base font-bold text-slate-800">{item.product}</h3>

            {item.samples.map((sample, sampleIdx) => (
              <Card key={sample.id} className="border border-slate-100 rounded-2xl bg-white shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs font-bold uppercase tracking-wider text-slate-400">
                      Sample #{sampleIdx + 1}
                    </span>
                    {item.samples.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveSample(itemIdx, sampleIdx)}
                        className="text-rose-600 hover:text-rose-700 h-8 px-2"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Product / Sample Name *</Label>
                      <Input
                        value={sample.productName}
                        onChange={(e) => onUpdateSample(itemIdx, sampleIdx, "productName", e.target.value)}
                        placeholder="e.g. Pasteurized Whole Milk"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Batch / Lot Number</Label>
                      <Input
                        value={sample.batchNumber}
                        onChange={(e) => onUpdateSample(itemIdx, sampleIdx, "batchNumber", e.target.value)}
                        placeholder="e.g. BATCH-2026-08"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Sample Quantity</Label>
                      <Input
                        value={sample.quantity}
                        onChange={(e) => onUpdateSample(itemIdx, sampleIdx, "quantity", e.target.value)}
                        placeholder="e.g. 500ml / 250g"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Special Remarks (Optional)</Label>
                      <Input
                        value={sample.specifics}
                        onChange={(e) => onUpdateSample(itemIdx, sampleIdx, "specifics", e.target.value)}
                        placeholder="e.g. Keep refrigerated at 4°C"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => onAddSample(itemIdx)}
              className="border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 w-full rounded-xl h-11 text-sm font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Another Sample for {item.product}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
