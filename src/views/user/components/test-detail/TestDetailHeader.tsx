"use client";

import { Badge } from "@/components/ui/badge";

interface TestDetailHeaderProps {
  testObj: any;
}

export function TestDetailHeader({ testObj }: TestDetailHeaderProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex gap-2 my-3">
          {testObj.applicableCategories?.map((c: any) => (
            <Badge key={c._id} className="bg-brand-primary text-white border-0 text-xs">
              {c.name}
            </Badge>
          ))}
          {testObj.isApplicableToAll && (
            <Badge className="bg-brand-primary text-white border-0 text-xs">All Categories</Badge>
          )}
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground leading-[1.3]">
          {testObj.testName}
        </h1>
        {testObj.description && (
          <p className="font-body text-base text-muted-foreground mt-2 leading-[1.5]">{testObj.description}</p>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-body text-xs text-muted-foreground mb-1 font-medium">Testing Method</p>
            <p className="font-body font-semibold text-foreground text-sm">
              {testObj.metadata?.method || "Standard Method"}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-muted-foreground mb-1 font-medium">Test Type</p>
            {testObj.metadata?.type ? (
              <Badge variant="outline" className="font-data-badge capitalize text-xs">
                {testObj.metadata.type}
              </Badge>
            ) : (
              <span className="font-body font-semibold text-foreground text-sm">Standard</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
