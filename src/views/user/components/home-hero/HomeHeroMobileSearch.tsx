"use client";

import Link from "next/link";
import { Search, Microscope, Ticket, Package } from "lucide-react";
import { SearchAutocomplete } from "@/components/common/SearchAutocomplete";
import { ConsultationBookingModal } from "../consultation/ConsultationBookingModal";

function submitSearch(form: HTMLFormElement) {
  const input = form.querySelector("input");
  const query = input?.value?.trim();
  if (query) {
    window.location.href = `/tests?search=${encodeURIComponent(query)}`;
  }
}

export function HomeHeroMobileSearch() {
  return (
    <section className="relative z-20 max-w-5xl mx-auto px-4 -mt-10 sm:-mt-10 mb-6 lg:hidden">
      <div className="bg-white rounded-3xl sm:rounded-full p-4 sm:p-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3">
          <form
            className="relative min-w-0 flex-1 flex w-full"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch(e.currentTarget);
            }}
          >
            <SearchAutocomplete
              hideIcon
              placeholder="Search for checkups..."
              inputClassName="relative placeholder:text-slate-400 z-10 w-full rounded-full border-none bg-slate-50/50 hover:bg-slate-50 py-3.5 pl-5 pr-12 text-sm text-slate-800 outline-none ring-0 focus:ring-0 h-[48px] transition-colors"
            >
              <button type="submit" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-brand-action hover:text-brand-action-hover">
                <Search className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </button>
            </SearchAutocomplete>
          </form>

          <div className="flex shrink-0 w-full sm:w-auto overflow-x-auto gap-2 pb-1 sm:pb-0 scrollbar-hide">
            <Link
              href="/tests"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white border-2 border-brand-action px-5 py-3 text-xs font-bold text-brand-action shadow-sm transition hover:bg-brand-action/10 whitespace-nowrap"
            >
              Book test
              <Microscope className="h-4 w-4" />
            </Link>
            <ConsultationBookingModal serviceName="General Consultation" source="Home Hero">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-action px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-brand-action-hover whitespace-nowrap"
              >
                Book free consultation
                <Ticket className="h-4 w-4" />
              </button>
            </ConsultationBookingModal>
            <Link
              href="/packages"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white border-2 border-brand-action px-5 py-3 text-xs font-bold text-brand-action shadow-sm transition hover:bg-brand-action/10 whitespace-nowrap"
            >
              book a package
              <Package className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
