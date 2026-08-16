import type { Metadata } from "next";
import PackageDetailPage from "@/views/user/PackageDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Testing Package Details | Litmus",
  description: "View complete list of assays included in package, accredited laboratory methodologies, sample instructions, and pricing.",
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <PackageDetailPage id={id} />;
}
