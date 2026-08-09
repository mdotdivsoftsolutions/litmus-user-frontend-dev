"use client";

import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api/category";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  { color: "text-blue-500", bgColor: "bg-blue-500" },
  { color: "text-pink-500", bgColor: "bg-pink-500" },
  { color: "text-orange-500", bgColor: "bg-orange-500" },
  { color: "text-yellow-600", bgColor: "bg-yellow-600" }
];

const IMAGES = ["/images/icons/1-1.webp", "/images/icons/3-1.webp"];

function ConsultancyCard({ service, index }: { service: any; index: number }) {
  const delay = index * 100;

  return (
    <div className="relative bg-white p-4 w-[270px] h-full flex flex-col justify-center items-center" data-aos="fade-up" data-aos-delay={delay}>
      <div className="border-2 w-full h-full p-5 text-center gap-1 items-center justify-center flex flex-col">
        <div className="flex items-end relative text-9xl select-none z-0">
          <h1 className="font-serif font-bold text-slate-200 mr-12" data-aos="zoom-in" data-aos-delay={delay + 100}>{service.letter || "A"}</h1>

          <div className="absolute -right-10 bottom-0" data-aos="fade-left" data-aos-delay={delay + 200}>
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <h4 className="text-xl font-extrabold text-slate-800 mb-2 px-2 leading-tight" data-aos="fade-up" data-aos-delay={delay + 100}>
          {service.title}
        </h4>
        <p className="text-sm text-center text-slate-500  px-2 line-clamp-3" data-aos="fade-up" data-aos-delay={delay + 200}>
          {service.desc}
        </p>

        <button className="flex items-center pt-4 justify-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 group-hover:gap-3 transition-all" data-aos="fade-up" data-aos-delay={delay + 300}>
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-white ${service.bgColor}`}>
            <ArrowRight className="w-3 h-3" />
          </span>
          Know More
        </button>
      </div>
    </div>
  );
}

export function ConsultancyServices() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategories
  });

  const categories = response?.data?.data || [];

  return (
    <section className="relative  bg-slate-100 flex min-h-full flex-col justify-center overflow-hidden py-12 md:py-16">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900" data-aos="fade-right">Consultancy Services</h3>
            <p className="text-sm text-slate-500 mt-1" data-aos="fade-right" data-aos-delay="100">Expert guidance for your industry needs</p>
          </div>
          <div className="flex gap-2" data-aos="fade-left">
            <button className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md hover:bg-slate-700 transition">
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <button className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md hover:bg-slate-700 transition">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  justify-items-start">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative bg-white p-5 w-[280px] h-[350px] flex flex-col justify-center items-center">
                <Skeleton className="w-full h-full" />
              </div>
            ))
          ) : categories.length > 0 ? (
            categories.slice(0, 4).map((cat: any, idx: number) => {
              const service = {
                letter: cat.name ? cat.name.charAt(0).toUpperCase() : "A",
                title: cat.name,
                desc: cat.description || "Explore specialized diagnostic tests for this category.",
                image: IMAGES[idx % IMAGES.length],
                color: COLORS[idx % COLORS.length].color,
                bgColor: COLORS[idx % COLORS.length].bgColor,
              };
              return <ConsultancyCard key={cat._id} service={service} index={idx} />;
            })
          ) : (
            <div className="col-span-full py-8 text-center text-slate-500">
              No categories available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
