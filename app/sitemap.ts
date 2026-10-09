import type { MetadataRoute } from "next"

import { projects } from "@/lib/content/projects"
import { siteConfig } from "@/lib/site"

// Articles canonicalize to their originals on DEV, so they are left out here.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const url = (p: string) => `${siteConfig.url}${p}`
  const pages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: url("/work"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: url("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/writing"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: url("/uses"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: url("/contact"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]
  const work: MetadataRoute.Sitemap = projects.map((p) => ({
    url: url(`/work/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: p.featured ? 0.8 : 0.6,
  }))
  return [...pages, ...work]
}
