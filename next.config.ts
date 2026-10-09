import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    // "last printed" in the footer: the moment this build was made
    BUILD_DATE: new Date().toISOString(),
  },
  experimental: {
    // Page-to-page dither dissolves (see app/dither.css).
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "media2.dev.to" }],
  },
}

export default nextConfig
