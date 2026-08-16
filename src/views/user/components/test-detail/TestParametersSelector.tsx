"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FlaskConical } from "lucide-react";

interface TestParametersSelectorProps {
  parameters: any[];
  selectedParams: string[];
  toggleParameter: (paramName: string) => void;
}

export function TestParametersSelector({
  parameters,
  selectedParams,
  toggleParameter,
}: TestParametersSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-xl font-bold flex items-center gap-2 text-foreground leading-[1.3]">
          <FlaskConical className="h-5 w-5 text-brand-action" /> Test Parameters
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1 leading-[1.5]">
          Select the specific parameters you want to test. All are selected by default.
        </p>
      </div>

      {parameters.length > 0 ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {parameters.map((param: any, idx: number) => (
            <div
              key={param.name}
              className={`flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors ${
                idx !== parameters.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <Checkbox
                id={`param-${param.name}`}
                checked={selectedParams.includes(param.name)}
                onCheckedChange={() => toggleParameter(param.name)}
                className="w-5 h-5 rounded-sm"
              />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={`param-${param.name}`}
                  className="font-body text-sm font-semibold text-foreground cursor-pointer select-none block"
                >
                  {param.name}
                </label>
                <div className="flex gap-4 mt-1 items-center">
                  {param.price && (
                    <span className="font-data text-xs text-brand-action font-bold bg-brand-action/10 px-2 py-0.5 rounded-full">
                      ₹{param.price}
                    </span>
                  )}
                  {param.unit && (
                    <span className="font-data text-xs text-muted-foreground">
                      Unit: <strong className="font-semibold">{param.unit}</strong>
                    </span>
                  )}
                  {(param.minLimit || param.maxLimit) && (
                    <span className="font-data text-xs text-muted-foreground">
                      Limits: <strong className="font-semibold">{param.minLimit || "0"} - {param.maxLimit || "N/A"}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="font-body p-8 text-center bg-muted/10 border border-border border-dashed rounded-xl text-muted-foreground text-sm">
          No specific parameters listed for this test.
        </div>
      )}
    </div>
  );
}
