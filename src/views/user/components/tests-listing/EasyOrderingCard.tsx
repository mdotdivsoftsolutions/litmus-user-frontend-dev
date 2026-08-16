"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

export function EasyOrderingCard() {
  const router = useRouter();
  const { data: userResponse } = useQuery({ queryKey: ["userProfile"], queryFn: authApi.getMe, retry: false });
  const user = userResponse?.data;

  return (
    <div className="lg:col-span-6 flex flex-col gap-8">
      <div className="flex-1 rounded-[2.5rem] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-orange-50/20 p-8 md:p-10 relative flex flex-col justify-between overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.05)] min-h-[400px] md:min-h-[460px]">
        <div className="relative z-10 space-y-6 md:space-y-8">
          <div>
            <h4 className="text-xl md:text-2xl font-bold text-slate-500 mb-2">Easy ordering in</h4>
            <h3 className="text-5xl md:text-4xl font-black text-brand-action tracking-tighter uppercase leading-none drop-shadow-sm">
              3 STEPS
            </h3>
          </div>

          <div className="space-y-5">
            {[
              { step: "SELECT TEST AND PRODUCT" },
              { step: "ADD YOUR DETAILS" },
              { step: "BOOK YOUR SAMPLE COLLECTION" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 md:gap-5">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-brand-action flex items-center justify-center text-white p-0.5 shrink-0 shadow-md">
                  <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <span className="text-slate-700 font-bold text-sm md:text-base tracking-wide">{item.step}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              if (!user) {
                window.dispatchEvent(new Event("openAuthModal"));
              } else {
                router.push("/bookings/new");
              }
            }}
            className="h-14 md:h-16 mt-2 px-10 md:px-14 bg-brand-action hover:bg-brand-action-hover text-white font-semibold text-xl rounded-xl shadow-lg hover:-translate-y-1 transition-all z-10 relative active:scale-95"
          >
            Order Now
          </button>
        </div>

        <div className="absolute right-0 bottom-0 w-[60%] lg:w-[65%] h-full z-0 pointer-events-none overflow-hidden rounded-br-[2.5rem]">
          <img
            src="https://images.unsplash.com/photo-1651008376811-b9dd05c85058?w=800&q=80"
            className="w-full h-full object-cover object-center opacity-80 mix-blend-multiply"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/80 to-white" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-action opacity-5 blur-[60px]" />
        <div className="absolute inset-[2px] rounded-[2.5rem] border-[1.5px] border-transparent bg-gradient-to-br from-orange-100 to-slate-100 opacity-30 pointer-events-none z-0" />
      </div>
    </div>
  );
}
