import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://app.dev.litmuslabs.in";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/profile", "/orders/", "/cart", "/bookings/new"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
