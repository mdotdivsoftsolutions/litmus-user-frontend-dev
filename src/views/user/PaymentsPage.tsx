"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, CreditCard, Clock, FileText, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { bookingApi } from "@/lib/api/booking";
import { InvoiceModal } from "@/components/InvoiceModal";
import Link from "next/link";

export default function PaymentsPage() {
  const [selectedInvoiceBookingId, setSelectedInvoiceBookingId] = useState<string | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["myBookingsPayments"],
    queryFn: () => bookingApi.getMyBookings(),
  });

  const bookings = response?.data || [];

  const mappedPayments = bookings.map((b: any) => {
    const isPaid = b.paymentStatus === "SUCCESS" || b.status === "APPROVED" || b.status === "COMPLETED";
    const year = new Date(b.bookingDate || b.createdAt || new Date()).getFullYear();
    const suffix = b._id.slice(-6).toUpperCase();
    const invoiceNum = b.invoiceNumber || `LIT-INV-${year}-${suffix}`;

    let serviceName = "Analytical Testing";
    if (b.items?.[0]?.testId?.testName) serviceName = b.items[0].testId.testName;
    else if (b.items?.[0]?.packageId?.name) serviceName = b.items[0].packageId.name;
    else if (b.items?.[0]?.samples?.[0]?.productName) serviceName = b.items[0].samples[0].productName;

    return {
      id: b._id,
      invoiceNumber: invoiceNum,
      bookingDisplayId: `BKG-${suffix}`,
      serviceName,
      lab: b.labId?.labName || (b.metadata?.isLitmusDirect ? "Litmus Direct" : "Litmus Network"),
      date: new Date(b.bookingDate || b.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      amount: Number(b.totalAmount) || 0,
      paymentStatus: b.paymentStatus || (isPaid ? "SUCCESS" : "PENDING"),
      bookingStatus: b.status || "PENDING",
      isPaid,
    };
  });

  const totalPaid = mappedPayments
    .filter((p) => p.isPaid)
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = mappedPayments
    .filter((p) => !p.isPaid)
    .reduce((sum, p) => sum + p.amount, 0);

  const totalInvoices = mappedPayments.length;

  const summaryCards = [
    { label: "Total Paid", value: `₹${totalPaid.toLocaleString("en-IN")}`, icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Payment", value: `₹${pendingAmount.toLocaleString("en-IN")}`, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Generated Invoices", value: `${totalInvoices}`, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments & Invoices</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Access your GST-compliant tax invoices, payment histories, and laboratory billing slips.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((c) => (
          <Card key={c.label} className="border border-slate-200/80 shadow-2xs bg-white rounded-xl">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-xl ${c.bg} p-3`}><c.icon className={`h-5 w-5 ${c.color}`} /></div>
              <div>
                <p className="text-xs font-semibold text-slate-500">{c.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{c.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-slate-200 shadow-2xs rounded-xl overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600 tracking-wider">
              <TableHead className="py-3.5">Invoice Number</TableHead>
              <TableHead>Booking Ref</TableHead>
              <TableHead className="hidden md:table-cell">Testing Service</TableHead>
              <TableHead className="hidden lg:table-cell">Lab Facility</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto rounded-lg" /></TableCell>
                </TableRow>
              ))
            ) : mappedPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertTriangle className="h-8 w-8 text-slate-300" />
                    <p className="font-semibold text-slate-800">No payment records found.</p>
                    <p className="text-xs text-slate-500">When you book a test or package, your official GST invoices will appear here.</p>
                    <Link href="/tests" className="mt-2">
                      <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold">
                        Browse Tests Catalog
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              mappedPayments.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-emerald-800">{p.invoiceNumber}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-700 font-semibold">{p.bookingDisplayId}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs font-medium text-slate-800 max-w-[180px] truncate" title={p.serviceName}>
                    {p.serviceName}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-slate-600">{p.lab}</TableCell>
                  <TableCell className="text-xs text-slate-600 whitespace-nowrap">{p.date}</TableCell>
                  <TableCell className="font-bold text-xs text-slate-900">₹{p.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.isPaid ? "Approved" : p.paymentStatus === "FAILED" ? "Rejected" : "Pending"} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2.5 text-xs font-semibold border-emerald-200 text-emerald-800 hover:bg-emerald-50 bg-white gap-1.5 shadow-2xs"
                        onClick={() => setSelectedInvoiceBookingId(p.id)}
                      >
                        <FileText className="h-3.5 w-3.5 text-emerald-600" />
                        View Invoice
                      </Button>
                      <Link href={`/orders/${p.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-slate-600">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Reusable Tax Invoice Modal */}
      <InvoiceModal
        bookingId={selectedInvoiceBookingId}
        open={!!selectedInvoiceBookingId}
        onOpenChange={(open) => !open && setSelectedInvoiceBookingId(null)}
      />
    </div>
  );
}
