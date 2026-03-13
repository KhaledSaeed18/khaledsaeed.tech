import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.khaledsaeed.tech",
          },
        ],
        destination: "https://khaledsaeed.tech/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
