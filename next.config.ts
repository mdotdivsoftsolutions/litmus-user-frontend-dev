import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const originOf = (url: string | undefined) => {
  try {
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
};

// Backend API + its websocket origin (support chat runs on socket.io against the API host).
const apiOrigin = originOf(process.env.NEXT_PUBLIC_API_URL) ?? "http://localhost:5000";
const socketOrigin = originOf(process.env.NEXT_PUBLIC_SOCKET_URL) ?? apiOrigin;
const wsOrigin = socketOrigin.replace(/^http/, "ws");

// DigitalOcean Spaces bucket that holds uploaded reports, documents, lab media and the hero video.
const SPACES = "https://litmuslabs.sgp1.digitaloceanspaces.com";
const RAZORPAY = "https://checkout.razorpay.com https://api.razorpay.com https://*.razorpay.com";
// Location lookup (pickup address autocomplete + IP-based city detection).
const GEO_APIS =
  "https://photon.komoot.io https://nominatim.openstreetmap.org https://ipwho.is https://ipapi.co https://freeipapi.com https://api.bigdatacloud.net";

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js injects inline bootstrap scripts; Razorpay checkout is loaded on the payment step.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://checkout.razorpay.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `media-src 'self' blob: ${SPACES}`,
  `connect-src 'self' ${[...new Set([apiOrigin, socketOrigin, wsOrigin])].join(" ")} ${SPACES} ${RAZORPAY} ${GEO_APIS}${isDev ? " ws: http://localhost:*" : ""}`,
  `frame-src 'self' blob: ${SPACES} ${RAZORPAY} https://www.google.com https://maps.google.com`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.razorpay.com",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Geolocation is used by the "detect my location" pickup flow.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=(self \"https://checkout.razorpay.com\" \"https://api.razorpay.com\")",
  },
];

// Files in /public keep their names between releases, so cache them for a week and
// revalidate in the background instead of re-downloading them on every visit.
const STATIC_ASSET_CACHE = "public, max-age=604800, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  images: {
    // AVIF encoding is CPU-heavy on a small EC2 instance; WebP gives most of the saving.
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Only our own storage may be proxied through /_next/image (never "**": that turns the
    // server into an open image proxy).
    remotePatterns: [
      { protocol: "https", hostname: "litmuslabs.sgp1.digitaloceanspaces.com" },
    ],
  },
  compiler: {
    // Strip console.log in production build while preserving error and warn
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      ...["/images/:path*", "/stock_image/:path*", "/favicon_io/:path*", "/logo.webp", "/favicon.ico"].map(
        (source) => ({
          source,
          headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }],
        })
      ),
    ];
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
