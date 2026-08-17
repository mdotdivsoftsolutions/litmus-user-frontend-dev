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
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold flex items-center gap-2 text-foreground leading-snug">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-action/10">
              <FlaskConical className="h-4 w-4 text-brand-action" />
            </span>
            Test Parameters
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-1 leading-relaxed">
            Select the specific parameters you want to test. All are selected by default.
          </p>
        </div>
        {parameters.length > 0 && (
          <span className="font-data-badge text-xs font-bold text-brand-action bg-brand-action/10 border border-brand-action/20 px-2.5 py-1 rounded-full shrink-0">
            {selectedParams.length}/{parameters.length}
          </span>
        )}
      </div>

      {parameters.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
          {parameters.map((param: any) => {
            const isChecked = selectedParams.includes(param.name);
            return (
              <label
                key={param.name}
                htmlFor={`param-${param.name}`}
                className={`flex items-center gap-4 px-5 py-4 cursor-pointer select-none transition-colors ${
                  isChecked ? "bg-brand-action/5 hover:bg-brand-action/8" : "hover:bg-muted/30"
                }`}
              >
                <Checkbox
                  id={`param-${param.name}`}
                  checked={isChecked}
                  onCheckedChange={() => toggleParameter(param.name)}
                  className="w-5 h-5 rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-body text-sm font-semibold text-foreground block leading-snug">
                    {param.name}
                  </span>
                  <div className="flex flex-wrap gap-3 mt-1 items-center">
                    {param.price && (
                      <span className="font-data text-xs font-bold text-brand-action">
                        ₹{param.price}
                      </span>
                    )}
                    {param.unit && (
                      <span className="font-data text-xs text-muted-foreground">
                        Unit: <strong className="font-semibold text-foreground">{param.unit}</strong>
                      </span>
                    )}
                    {(param.minLimit || param.maxLimit) && (
                      <span className="font-data text-xs text-muted-foreground">
                        Limits:{" "}
                        <strong className="font-semibold text-foreground">
                          {param.minLimit || "0"} – {param.maxLimit || "N/A"}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="font-body p-10 text-center bg-muted/10 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
          No specific parameters listed for this test.
        </div>
      )}
    </div>
  );
}
