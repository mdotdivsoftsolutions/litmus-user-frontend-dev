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
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
};

export default nextConfig;
