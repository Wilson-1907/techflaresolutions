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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), display-capture=(), payment=(), usb=(), interest-cohort=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
  async rewrites() {
    if (!backendUrl) return [];
    const base = backendUrl.replace(/\/$/, "");
    return [{ source: "/api/:path*", destination: `${base}/api/:path*` }];
  },
};

export default nextConfig;
