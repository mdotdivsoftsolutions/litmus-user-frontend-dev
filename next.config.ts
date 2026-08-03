import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from any domain (for lab logos, test images, etc.)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
};
export default nextConfig;
