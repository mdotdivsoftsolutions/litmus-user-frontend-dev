import type { Metadata } from "next";
import OrderDetailPage from "@/views/user/OrderDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Order Details & Timeline | Litmus",
  description: "View diagnostic order progress, collection updates, performing laboratory assignment, and verified PDF reports.",
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <OrderDetailPage id={id} />;
}
