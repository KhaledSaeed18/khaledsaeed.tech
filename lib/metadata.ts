import type { Metadata } from "next"

import { siteConfig } from "@/lib/site"

/**
 * Complete per-page metadata: title, description, canonical, and Open Graph
 * and X cards that describe this page rather than inheriting the home page's.
 * OG images come from each route's opengraph-image file.
 */
export function pageMeta({
  title,
  description,
  path,
  canonical,
  type = "website",
  keywords,
  publishedTime,
  modifiedTime,
  tags,
}: {
  title: string
  description: string
  path: string
  /** Defaults to `path`. Articles point at their original on DEV. */
  canonical?: string
  type?: "website" | "article" | "profile"
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}): Metadata {
  const full = `${title} | ${siteConfig.name}`
  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonical ?? path },
    openGraph: {
      type,
      url: path,
      siteName: siteConfig.name,
      locale: "en_US",
      title: full,
      description,
      ...(type === "article"
        ? { publishedTime, modifiedTime, tags, authors: [siteConfig.url] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
    },
  }
}
