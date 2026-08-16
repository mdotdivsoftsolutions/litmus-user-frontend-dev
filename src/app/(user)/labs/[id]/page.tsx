import type { Metadata } from "next";
import LabDetailConsumerPage from "@/views/user/LabDetailConsumerPage";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Laboratory Profile & Capabilities | Litmus",
  description: "View laboratory accreditation, testing instrumentation, quality assurance certifications, and available test panels.",
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <LabDetailConsumerPage id={id} />;
}
