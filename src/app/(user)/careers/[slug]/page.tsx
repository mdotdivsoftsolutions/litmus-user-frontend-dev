import type { Metadata } from "next";
import CareerDetailPage from "@/views/user/CareerDetailPage";
import { getCareerBySlug } from "@/lib/company-careers-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const opening = getCareerBySlug(slug);
  if (!opening) {
    return {
      title: "Opening Not Found | Litmus Careers",
    };
  }
  return {
    title: `${opening.title} | Litmus Careers`,
    description: opening.summary,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CareerDetailPage slug={slug} />;
}
