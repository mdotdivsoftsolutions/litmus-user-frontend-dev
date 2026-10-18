import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://litmuslabs.in").replace(/\/$/, "");
export const SITE_NAME = "Litmus Labs";

export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Litmus Labs - NABL accredited food testing in India",
};

interface PageSeo {
  title: string;
  description: string;
  /** Route path, e.g. "/tests". Used for the canonical URL and og:url. */
  path: string;
  noIndex?: boolean;
}

/**
 * Per-page metadata with canonical URL, Open Graph and Twitter tags. A page's openGraph object
 * replaces the root one instead of merging with it, so the shared fields are repeated here.
 */
export function pageMetadata({ title, description, path, noIndex }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
