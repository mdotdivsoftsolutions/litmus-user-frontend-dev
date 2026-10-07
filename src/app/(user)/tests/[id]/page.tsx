import type { Metadata } from "next";
import TestDetailPage from "@/views/user/TestDetailPage";
import { getTestForPage, toMetaDescription } from "@/lib/serverData";

interface Props {
  params: Promise<{ id: string }>;
}

// Rendered on first request, then cached and refreshed in the background every 5 minutes.
export const revalidate = 300;

const DEFAULT_DESCRIPTION =
  "View test details, accredited methods, sample requirements, turnaround time, and book test online.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const test = await getTestForPage(id);
  if (!test?.testName) {
    return { title: "Test Parameters, Methods & Pricing | Litmus", description: DEFAULT_DESCRIPTION };
  }
  const description = toMetaDescription(
    test.description,
    `Book ${test.testName} testing at NABL accredited labs. ${DEFAULT_DESCRIPTION}`
  );
  return {
    title: `${test.testName} Test - Price, Method & Turnaround | Litmus`,
    description,
    alternates: { canonical: `/tests/${id}` },
    openGraph: { title: `${test.testName} Test | Litmus`, description },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const test = await getTestForPage(id);
  return <TestDetailPage id={id} initialTest={test} />;
}
