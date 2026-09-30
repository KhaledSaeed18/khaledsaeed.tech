import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    // Page-to-page dither dissolves (see app/dither.css).
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "media2.dev.to" }],
  },
}

export default nextConfig
