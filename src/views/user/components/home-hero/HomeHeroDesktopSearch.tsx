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

export function HomeHeroDesktopSearch() {
  return (
    <div className="absolute bottom-10 left-0 right-0 z-20 pointer-events-none hidden lg:block">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="w-full pointer-events-auto bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-full shadow-2xl flex items-center gap-4">
          <form
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch(e.currentTarget);
            }}
          >
            <SearchAutocomplete
              hideIcon
              dropdownPosition="top"
              placeholder="Search for checkups..."
              inputClassName="relative placeholder:text-slate-400 z-10 w-full rounded-full border-none bg-white/95 hover:bg-white py-3.5 pl-5 pr-12 text-sm text-slate-800 outline-none shadow-inner transition-colors"
            >
              <button
                type="submit"
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-brand-action hover:text-brand-action-hover transition-colors"
              >
                <Search className="h-5 w-5" strokeWidth={2.5} aria-hidden />
              </button>
            </SearchAutocomplete>
          </form>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/tests"
              className="flex items-center justify-center gap-2 rounded-full bg-white border-2 border-brand-action px-6 py-3.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-brand-action/10 hover:border-brand-action whitespace-nowrap group"
            >
              <Microscope className="h-4 w-4 text-brand-action group-hover:scale-110 transition-transform" /> Book a Lab Test
            </Link>
            <ConsultationBookingModal serviceName="General Consultation" source="Home Hero">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-full bg-brand-action px-6 py-4 text-xs font-bold text-white shadow-md transition hover:bg-brand-action-hover hover:shadow-lg whitespace-nowrap group"
              >
                <Ticket className="h-4 w-4 group-hover:scale-110 transition-transform" /> Free Consultation
              </button>
            </ConsultationBookingModal>
            <Link
              href="/packages"
              className="flex items-center justify-center gap-2 rounded-full bg-white border-2 border-brand-action px-6 py-3.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-brand-action/10 hover:border-brand-action whitespace-nowrap group"
            >
              <Package className="h-4 w-4 text-brand-action group-hover:scale-110 transition-transform" /> Health Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
