import type { MetadataRoute } from "next"

import { featuredProjects, projects } from "@/lib/content/projects"
import { siteConfig } from "@/lib/site"

// Articles canonicalize to their originals on DEV, so they are left out here.
export default function sitemap(): MetadataRoute.Sitemap {
  // Dates describe content changes, never the time an unrelated build ran.
  // Omit lastModified when a page has no recorded content-update date.
  const latestUpdate = (entries: typeof projects, pageUpdatedAt?: string) =>
    [
      ...entries.flatMap((p) => (p.updatedAt ? [p.updatedAt] : [])),
      ...(pageUpdatedAt ? [pageUpdatedAt] : []),
    ]
      .sort()
      .at(-1)
  const url = (p: string) => `${siteConfig.url}${p}`
  const pages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: latestUpdate(featuredProjects, siteConfig.profileUpdatedAt),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: url("/work"),
      lastModified: latestUpdate(projects),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: url("/about"),
      lastModified: siteConfig.profileUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/writing"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: url("/contact"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]
  const work: MetadataRoute.Sitemap = projects.map((p) => ({
    url: url(`/work/${p.slug}`),
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: p.featured ? 0.8 : 0.6,
  }))
  return [...pages, ...work]
}
