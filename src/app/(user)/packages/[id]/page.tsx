import type { Metadata } from "next";
import PackageDetailPage from "@/views/user/PackageDetailPage";
import { getPackageForPage, toMetaDescription } from "@/lib/serverData";

interface Props {
  params: Promise<{ id: string }>;
}

// Rendered on first request, then cached and refreshed in the background every 5 minutes.
export const revalidate = 300;

const DEFAULT_DESCRIPTION =
  "View complete list of assays included in package, accredited laboratory methodologies, sample instructions, and pricing.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pkg = await getPackageForPage(id);
  if (!pkg?.name) {
    return { title: "Testing Package Details | Litmus", description: DEFAULT_DESCRIPTION };
  }
  const description = toMetaDescription(pkg.description, DEFAULT_DESCRIPTION);
  return {
    title: `${pkg.name} - Testing Package | Litmus`,
    description,
    alternates: { canonical: `/packages/${id}` },
    openGraph: {
      title: `${pkg.name} | Litmus`,
      description,
      ...(typeof pkg.image === "string" && pkg.image.startsWith("http") ? { images: [pkg.image] } : {}),
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const pkg = await getPackageForPage(id);
  return <PackageDetailPage id={id} initialPackage={pkg} />;
}
