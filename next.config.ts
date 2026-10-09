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
  poweredByHeader: false,
  // Baseline hardening for every response. No CSP: a strict one needs
  // per-request nonces for Next's inline scripts, which would make every
  // static page dynamic.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ]
  },
}

export default nextConfig
