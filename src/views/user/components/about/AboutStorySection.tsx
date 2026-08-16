"use client";

export function AboutStorySection() {
  return (
    <section className="bg-white border-t border-slate-100 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-7 space-y-5 text-[15px] md:text-base text-slate-600 leading-relaxed">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Who we are</h2>
          <p>
            Litmus began where many compliance programmes break down —{" "}
            <strong className="text-slate-800 font-semibold">between</strong> the brand owner who needs timely answers and the laboratory
            whose capacity, scope, and paperwork must stay immaculate. We are not a substitute for clinical judgment or statutory authority;
            we are the operational spine that makes accredited testing easier to buy, schedule, and audit.
          </p>
          <p>
            Today our network spans dozens of partner facilities and thousands of monthly bookings across FMCG, dairy, HoReCa suppliers,
            and emerging D2C brands. Product, science, and operations teams sit together so catalogue accuracy and rider coordination do not
            drift apart.
          </p>
          <p>
            Whether you are validating a label claim, clearing a shipment lot, or choosing a panel for routine surveillance, the same
            principles apply: specimen integrity first, honest timelines second, and reporting you can stand behind in front of customers or
            regulators.
          </p>
        </div>
        <aside className="lg:col-span-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-8 space-y-6">
          <p className="text-sm font-semibold text-slate-800 tracking-tight">At a glance</p>
          <ul className="space-y-4 text-sm text-slate-600">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
              India-first marketplace with NABL-recognised partner labs as report issuers.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
              Mix of self-serve booking and enterprise procurement-friendly workflows.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#D32F2F] shrink-0" />
              Science-led support — not scripted call-centre deflection when samples or scopes get tricky.
            </li>
          </ul>
          <blockquote className="border-l-2 border-[#D32F2F]/40 pl-4 text-sm italic text-slate-500 leading-relaxed">
            “Measurement without traceability is opinion. We built Litmus so traceability is default.”
            <footer className="mt-2 not-italic text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              — Founding note (placeholder)
            </footer>
          </blockquote>
        </aside>
      </div>
    </section>
  );
}
