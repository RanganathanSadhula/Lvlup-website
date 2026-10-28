import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [390, 640, 828, 1080, 1200, 1920],
    imageSizes: [200, 240, 480],
    qualities: [75, 85, 90, 95, 100],
  },
};

export default nextConfig;
