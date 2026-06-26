import type { NextConfig } from "next";
import { getApiBaseUrl, PRODUCTION_BACKEND } from "./src/lib/api-base";

const backendUrl = getApiBaseUrl() || (process.env.VERCEL ? PRODUCTION_BACKEND : "");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    if (!backendUrl) return [];
    const base = backendUrl.replace(/\/$/, "");
    return [{ source: "/api/:path*", destination: `${base}/api/:path*` }];
  },
};

export default nextConfig;
