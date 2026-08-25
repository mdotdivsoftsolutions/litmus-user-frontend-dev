"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info as InfoIcon, Plus as PlusIcon } from "lucide-react";
import { CartLine, SampleDetail } from "./booking-types";
import { SampleCard } from "./SampleCard";

interface BookingStep1SamplesProps {
  items: CartLine[];
  onBackToReview: () => void;
  onAddSample: (itemId: string) => void;
  onRemoveSample: (itemId: string, sampleId: string) => void;
  onToggleParam: (itemId: string, sampleId: string, paramName: string) => void;
  onUpdateField: (itemId: string, sampleId: string, field: keyof SampleDetail, value: string) => void;
  onAddCustomParam?: (itemId: string, sampleId: string, customParamName: string) => void;
  onRemoveCustomParam?: (itemId: string, sampleId: string, paramName: string) => void;
}

export function BookingStep1Samples({
  items,
  onBackToReview,
  onAddSample,
  onRemoveSample,
  onToggleParam,
  onUpdateField,
  onAddCustomParam,
  onRemoveCustomParam,
}: BookingStep1SamplesProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Samples &amp; testing scope</h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">
          You may not know every catalogue SKU — that&apos;s fine. For each parameter below, spell out which real-world product or sample we should test and what you need from the lab. Specialists use this to assign the correct method before pickup.
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="rounded-lg border-dashed border-2 border-slate-200 bg-white/50 p-10 text-center">
          <p className="text-slate-600 text-sm mb-4">Add tests in the previous step first.</p>
          <Button type="button" variant="outline" onClick={onBackToReview} className="font-bold rounded-lg">
            Back to review
          </Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {items.map((item) => (
            <div key={item.id} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div>
                  <h3 className="font-bold text-xl text-slate-900">{item.product}</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {item.samples.length} Product{item.samples.length !== 1 ? "s" : ""} added to this Test Panel
                  </p>
                </div>
              </div>

              {item.samples.map((sample, index) => (
                <SampleCard
                  key={sample.id}
                  item={item}
                  sample={sample}
                  index={index}
                  totalSamples={item.samples.length}
                  onRemoveSample={onRemoveSample}
                  onToggleParam={onToggleParam}
                  onUpdateField={onUpdateField}
                  onAddCustomParam={onAddCustomParam}
                  onRemoveCustomParam={onRemoveCustomParam}
                />
              ))}

              <Button
                onClick={() => onAddSample(item.id)}
                variant="outline"
                className="w-full border-dashed border-2 border-slate-200 hover:border-brand-action hover:bg-brand-action/5 text-brand-action font-bold h-12 rounded-xl mt-2"
              >
                <PlusIcon className="h-5 w-5 mr-2" /> Add Another Product for {item.product}
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm flex gap-3 items-start">
        <InfoIcon className="h-5 w-5 text-litmus-teal shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-slate-800">Not sure of the catalogue name?</span> Focus on truthful labels and intent — coordinators confirm methods and quotations before pickup.
        </p>
      </div>
    </div>
  );
}
