"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 as TrashIcon, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartLine, SampleDetail } from "./booking-types";
import { AddTestParameterSelector } from "./AddTestParameterSelector";

interface SampleCardProps {
  item: CartLine;
  sample: SampleDetail;
  index: number;
  totalSamples: number;
  onRemoveSample: (itemId: string, sampleId: string) => void;
  onToggleParam: (itemId: string, sampleId: string, paramName: string) => void;
  onUpdateField: (itemId: string, sampleId: string, field: keyof SampleDetail, value: string) => void;
  onAddCustomParam?: (itemId: string, sampleId: string, customParamName: string) => void;
  onRemoveCustomParam?: (itemId: string, sampleId: string, paramName: string) => void;
}

export function SampleCard({
  item,
  sample,
  index,
  totalSamples,
  onRemoveSample,
  onToggleParam,
  onUpdateField,
  onAddCustomParam,
  onRemoveCustomParam,
}: SampleCardProps) {
  const isPackage = item.category !== "Test Panel";

  return (
    <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
      {totalSamples > 1 && (
        <button
          onClick={() => onRemoveSample(item.id, sample.id)}
          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors z-10"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      )}
      <div className="border-b border-slate-100 bg-slate-50/90 px-5 py-4">
        <Badge className="bg-white border-slate-200 text-slate-600 mb-2 font-bold uppercase tracking-wider text-[10px]">
          PRODUCT {index + 1}
        </Badge>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 mt-1">
          <p className="text-sm font-bold text-slate-700">
            {isPackage ? "Tests included in this Package:" : "Select parameters for this product:"}
          </p>
          <span className="text-[11px] font-semibold text-slate-500">
            {sample.selectedParameters.length} Test Parameter{sample.selectedParameters.length !== 1 ? "s" : ""} selected
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {item.availableParameters
            ?.filter((param: any) => {
              if (isPackage) {
                const isBasePackage = param.isBasePackageTest || !param.isCustom;
                return isBasePackage || sample.selectedParameters.includes(param.name);
              }
              return true;
            })
            .map((param: any) => {
              const isBasePackage = isPackage && (param.isBasePackageTest || !param.isCustom);
              const isSelected = sample.selectedParameters.includes(param.name) || isBasePackage;
              const isCustom = param.isCustom;

              return (
                <div
                  key={param.name}
                  onClick={() => {
                    if (!isBasePackage) {
                      onToggleParam(item.id, sample.id, param.name);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg border transition-all select-none",
                    isBasePackage
                      ? "border-emerald-200 bg-emerald-50/40 cursor-default"
                      : isSelected
                      ? "border-brand-action bg-brand-action/5 shadow-sm cursor-pointer"
                      : "border-slate-100 hover:border-slate-200 bg-white cursor-pointer"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={isBasePackage}
                    className={cn("h-4 w-4", isBasePackage && "data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 opacity-90")}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                      <span className="truncate">{param.name}</span>
                      {isBasePackage && <Lock className="h-3 w-3 text-emerald-600 shrink-0" />}
                    </p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold">
                      {isBasePackage ? "Included in Package" : !isPackage ? `₹${param.price}` : "Added Test"}
                    </p>
                  </div>
                  {isCustom && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onRemoveCustomParam) {
                          onRemoveCustomParam(item.id, sample.id, param.name);
                        } else {
                          onToggleParam(item.id, sample.id, param.name);
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                      title="Remove added parameter"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
        </div>

        {/* Scalable 1k+ Test Search & Selector */}
        {onAddCustomParam && (
          <AddTestParameterSelector
            itemId={item.id}
            sampleId={sample.id}
            selectedParameters={sample.selectedParameters}
            onAddParam={onAddCustomParam}
          />
        )}
      </div>
      <CardContent className="p-5 md:p-6 bg-white">
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Product / Sample Name / Identifier</Label>
            <Input
              value={sample.productName}
              onChange={(e) => onUpdateField(item.id, sample.id, "productName", e.target.value)}
              placeholder="e.g., Full cream toned milk pouch 500ml"
              className="h-11 rounded-lg border-slate-200 bg-slate-50/80 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quantity / Size / ML</Label>
            <Input
              value={sample.quantity}
              onChange={(e) => onUpdateField(item.id, sample.id, "quantity", e.target.value)}
              placeholder="e.g., 500ml, 1kg, 2 pieces"
              className="h-11 rounded-lg border-slate-200 bg-slate-50/80 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Batch Number</Label>
            <Input
              value={sample.batchNumber}
              onChange={(e) => onUpdateField(item.id, sample.id, "batchNumber", e.target.value)}
              placeholder="e.g., #APR-042"
              className="h-11 rounded-lg border-slate-200 bg-slate-50/80 text-sm"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">SKU (If applicable)</Label>
            <Input
              value={sample.sku}
              onChange={(e) => onUpdateField(item.id, sample.id, "sku", e.target.value)}
              placeholder="SKU as on invoice"
              className="h-11 rounded-lg border-slate-200 bg-slate-50/80 text-sm"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">What exactly should we analyse on this sample?</Label>
            <Textarea
              value={sample.specifics}
              onChange={(e) => onUpdateField(item.id, sample.id, "specifics", e.target.value)}
              placeholder="Material form (liquid / powder), packaging, suspicion (adulterant, legal limit check), regulator or customer mandate, sampling context…"
              className="min-h-[80px] rounded-lg border-slate-200 bg-slate-50/80 text-sm resize-y"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
