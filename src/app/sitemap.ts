import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://app.dev.litmuslabs.in";
  const routes = [
    "",
    "/tests",
    "/packages",
    "/consultation",
    "/about",
    "/contact",
    "/faqs",
    "/support",
    "/nabl",
    "/blogs",
    "/careers",
    "/terms",
    "/privacy",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return routes;
}
