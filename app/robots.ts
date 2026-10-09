import type { MetadataRoute } from "next"

import { siteConfig } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    // Everyone is welcome, including AI crawlers; llms.txt gives them a summary.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
