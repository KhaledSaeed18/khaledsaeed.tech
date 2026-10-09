import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    // "last printed" in the footer: the moment this build was made
    BUILD_DATE: new Date().toISOString(),
  },
  // Page-to-page dither dissolves (app/dither.css) use React's ViewTransition,
  // which the App Router supports without a flag since Next.js 16.3.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "media2.dev.to" }],
  },
}

export default nextConfig
