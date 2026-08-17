"use client";

import { Badge } from "@/components/ui/badge";
import { FlaskConical, Tag, Layers } from "lucide-react";

interface TestDetailHeaderProps {
  testObj: any;
}

export function TestDetailHeader({ testObj }: TestDetailHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Category Badges */}
      <div className="flex flex-wrap gap-2">
        {testObj.applicableCategories?.map((c: any) => (
          <Badge
            key={c._id}
            className="bg-brand-action/10 text-brand-action border border-brand-action/25 text-xs font-semibold px-2.5 py-0.5 rounded-full"
          >
            <Tag className="h-3 w-3 mr-1" />
            {c.name}
          </Badge>
        ))}
        {testObj.isApplicableToAll && (
          <Badge className="bg-brand-action/10 text-brand-action border border-brand-action/25 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            <Layers className="h-3 w-3 mr-1" />
            All Categories
          </Badge>
        )}
      </div>

      {/* Title block */}
      <div className="border border-border rounded-2xl bg-card px-5 py-4 shadow-sm">
        <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-foreground leading-tight tracking-tight">
          {testObj.testName}
        </h1>
        {testObj.description && (
          <p className="font-body text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {testObj.description}
          </p>
        )}
      </div>

      {/* Metadata card — visible teal background */}
      <div className="rounded-2xl border border-brand-action bg-brand-action/10 px-5 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-8 w-8 rounded-lg bg-white/30 flex items-center justify-center shrink-0">
              <FlaskConical className="h-4 w-4 text-brand-action" />
            </div>
            <div>
              <p className="font-body text-[10px] text-brand-action font-bold uppercase tracking-widest mb-1">
                Testing Method
              </p>
              <p className="font-body font-bold text-foreground text-sm">
                {testObj.metadata?.method || "Standard Method"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-8 w-8 rounded-lg bg-white/30 flex items-center justify-center shrink-0">
              <Layers className="h-4 w-4 text-brand-action" />
            </div>
            <div>
              <p className="font-body text-[10px] text-brand-action font-bold uppercase tracking-widest mb-1">
                Test Type
              </p>
              <p className="font-body font-bold text-foreground text-sm capitalize">
                {testObj.metadata?.type || "Standard"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
