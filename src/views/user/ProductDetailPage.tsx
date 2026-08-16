"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { tests as allTests } from "@/lib/placeholder-data";

export default function ProductDetailPage({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || (params?.id as string);
  const [selected, setSelected] = useState<string[]>([]);
  const productName = ["Full Cream Milk", "Refined Sunflower Oil", "Basmati Rice"][Number(id || 1) - 1] || "Full Cream Milk";

  const toggle = (tid: string) => setSelected((prev) => prev.includes(tid) ? prev.filter((x) => x !== tid) : [...prev, tid]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/tests" className="hover:text-foreground">Products</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{productName}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tests list */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">{productName}</h1>
          <p className="text-muted-foreground">Select the tests you want to perform on this product.</p>
          
          <div className="space-y-2">
            {allTests.map((test) => (
              <Card key={test.id} className="border shadow-none">
                <CardContent className="flex items-center gap-4 p-4">
                  <Checkbox checked={selected.includes(test.id)} onCheckedChange={() => toggle(test.id)} />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{test.name}</p>
                    <p className="text-xs text-muted-foreground">Method: FSSAI {test.method}</p>
                  </div>
                  <Badge variant="outline">{test.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="params">
              <AccordionTrigger>Test Parameters Info</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Fat Content Analysis:</strong> Total fat, Saturated fat, Trans fat (% w/w)</p>
                  <p><strong>Total Plate Count:</strong> Colony forming units per gram (CFU/g)</p>
                  <p><strong>Moisture Content:</strong> Moisture percentage (% w/w)</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
