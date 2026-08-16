"use client";

const metrics = [
  { value: "60+", label: "Assay families", accent: false },
  { value: "25+", label: "Partner labs", accent: true },
  { value: "12", label: "Cities — collection", accent: false },
  { value: "4.8", label: "CSAT — support", accent: false },
  { value: "24/7", label: "Booking & tracking", accent: false },
];

export function AboutMetricsSection() {
  return (
    <section className="bg-slate-50 border-t border-slate-100 py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {metrics.map((m) => (
            <div key={m.label} className="text-center sm:text-left">
              <p
                className={`text-2xl md:text-3xl font-semibold tracking-tight ${
                  m.accent ? "text-[#D32F2F]" : "text-slate-800"
                }`}
              >
                {m.value}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-2">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
