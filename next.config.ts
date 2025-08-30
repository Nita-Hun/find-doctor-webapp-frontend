import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/admin/dashboards",
        headers: [
          {
            key: "Cache-Control",
            value: "private, max-age=60, stale-while-revalidate=30",
          },
        ],
      },
      // Optional: add other routes here if needed
    ];
  },
};

export default nextConfig;
