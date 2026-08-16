"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Phone, Mail, Star } from "lucide-react";
import { laboratories, labPricing } from "@/lib/placeholder-data";

export default function LaboratoryDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const lab = laboratories.find((l) => l.id === id) || laboratories[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/labs" className="hover:text-foreground">Laboratories</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{lab.name}</span>
      </div>

      {/* Hero */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">{lab.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lab.city}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />+91 44 2345 6789</span>
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />info@{lab.city.toLowerCase().replace(" ", "")}lab.in</span>
              </div>
              <div className="flex items-center gap-2">
                {lab.nabl && <Badge variant="nabl">NABL Accredited</Badge>}
                {lab.fssai && <Badge variant="fssai">FSSAI Approved</Badge>}
                <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-status-pending text-status-pending" /><span className="font-semibold">{lab.rating}</span></div>
              </div>
            </div>
            <Button className="shrink-0 bg-primary hover:bg-primary-deep" asChild><Link href="/bookings/new">Select This Lab</Link></Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground">A premier food testing facility equipped with state-of-the-art instruments for chemical, microbiological, and physical testing. With {lab.testsCount} tests available and a dedicated team of scientists.</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-muted p-4 text-center"><p className="text-2xl font-bold text-foreground">{lab.testsCount}</p><p className="text-xs text-muted-foreground">Tests Available</p></div>
                <div className="rounded-lg bg-muted p-4 text-center"><p className="text-2xl font-bold text-foreground">{lab.activeBookings}</p><p className="text-xs text-muted-foreground">Active Bookings</p></div>
                <div className="rounded-lg bg-muted p-4 text-center"><p className="text-2xl font-bold text-foreground">3-5</p><p className="text-xs text-muted-foreground">Avg TAT (days)</p></div>
                <div className="rounded-lg bg-muted p-4 text-center"><p className="text-2xl font-bold text-foreground">98%</p><p className="text-xs text-muted-foreground">Completion Rate</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pricing" className="mt-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <Table>
                <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Test Name</TableHead><TableHead>Price</TableHead><TableHead>Last Updated</TableHead></TableRow></TableHeader>
                <TableBody>
                  {labPricing.map((p) => (
                    <TableRow key={p.testName}>
                      <TableCell className="font-medium">{p.type}</TableCell>
                      <TableCell>{p.testName}</TableCell>
                      <TableCell>₹{p.price.toLocaleString()}</TableCell>
                      <TableCell>{p.lastUpdated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Showing verified client reviews</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
