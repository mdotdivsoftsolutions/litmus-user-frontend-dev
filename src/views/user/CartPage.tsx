"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingCart, Lock, Shield, Tag } from "lucide-react";

const cartItems = [
  { id: "1", product: "Full Cream Milk", tests: 3, lab: "Chennai Food Testing Laboratory", price: 3600, mrp: 6300 },
  { id: "2", product: "Basmati Rice", tests: 2, lab: null, price: 2400, mrp: 4200 },
];

export default function CartPage() {
  const [items, setItems] = useState(cartItems);
  const subtotal = items.reduce((a, b) => a + b.price, 0);
  const totalMrp = items.reduce((a, b) => a + b.mrp, 0);
  const discount = totalMrp - subtotal;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2 leading-[1.3]">
        <ShoppingCart className="h-6 w-6 text-brand-action" /> Your Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <p className="font-body text-muted-foreground text-base">Your cart is empty</p>
          <Button asChild className="bg-brand-action hover:bg-brand-action-hover text-white font-body font-semibold text-base rounded-xl px-8 h-12 shadow-md"><Link href="/tests">Browse Tests</Link></Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Cart Items */}
          <div className="lg:col-span-3 space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="border border-slate-100 rounded-2xl shadow-sm bg-white">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-base text-slate-900 leading-[1.3]">{item.product} Test Panel</h3>
                      <p className="font-body text-sm text-slate-500 font-medium leading-[1.5]">{item.tests} tests selected</p>
                      {item.lab ? (
                        <Badge variant="outline" className="font-data-badge text-xs mt-1">{item.lab}</Badge>
                      ) : (
                        <span className="font-body text-xs font-medium text-slate-400">Lab to be selected next</span>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-data text-xs text-slate-400 line-through font-normal">₹{item.mrp.toLocaleString()}</p>
                      <p className="font-data font-bold text-brand-action text-xl leading-[1.4]">₹{item.price.toLocaleString()}</p>
                      <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-600 transition-colors p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <Card className="rounded-2xl shadow-sm border border-slate-100 bg-white">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-body font-bold text-slate-900 text-sm">{items.length} products added</span>
                    <div className="text-right">
                      <span className="font-data text-xs text-slate-400 line-through mr-2 font-normal">₹{totalMrp.toLocaleString()}</span>
                      <span className="font-data text-xl font-bold text-brand-action leading-[1.4]">₹{subtotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-brand-action hover:bg-brand-action-hover text-white rounded-xl h-12 font-body font-semibold text-base shadow-md hover:shadow-lg transition-all active:scale-95" asChild>
                    <Link href="/bookings/new">Proceed to Book</Link>
                  </Button>

                  {/* Coupon */}
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-brand-action" />
                        <span className="font-data font-bold text-slate-900 text-sm">LITMUS10</span>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg border-brand-action text-brand-action hover:bg-brand-action/10 text-xs font-semibold h-8 px-3">APPLY</Button>
                    </div>
                    <p className="font-body text-xs text-emerald-600 font-medium mt-1">Save ₹{Math.round(subtotal * 0.1).toLocaleString()} with this coupon</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm font-body">
                    <div className="flex justify-between"><span className="text-slate-500">Total MRP</span><span className="font-data font-medium text-slate-700">₹{totalMrp.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-brand-action font-semibold">Discount on MRP</span><span className="font-data text-emerald-600 font-bold">- ₹{discount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Platform Fee</span><span><span className="font-data line-through text-slate-400 mr-1.5">₹150</span><span className="font-data text-emerald-600 font-bold">FREE</span></span></div>
                    <div className="flex justify-between"><span className="text-slate-500">GST (18%)</span><span className="font-data font-medium text-slate-700">₹{gst.toLocaleString()}</span></div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-900">
                      <span>To Pay</span><span className="font-data text-xl text-brand-action font-bold leading-[1.4]">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-2.5 text-center">
                    <span className="font-body text-xs text-emerald-800 font-semibold">🏷 You will save ₹{(discount + 150).toLocaleString()} on this order.</span>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 font-data">
                    <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5 text-slate-400" /> Secure Payment</span>
                    <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-emerald-600" /> FSSAI Compliant</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
