import type { Metadata } from "next";
import TestDetailPage from "@/views/user/TestDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Test Parameters, Methods & Pricing | Litmus",
  description: "View test details, accredited methods, sample requirements, turnaround time, and book test online.",
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <TestDetailPage id={id} />;
}
