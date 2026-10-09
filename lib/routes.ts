import { catalog } from "@/lib/content/projects"
import { getArticles } from "@/lib/data/devto"
import { nav } from "@/lib/site"

export type SiteRoute = { href: string; label: string; kind: string }

/**
 * Every real page on the site, for the 404's suggestions and the command
 * palette: the main pages, each project's case study and each article.
 */
export async function siteRoutes(): Promise<SiteRoute[]> {
  const articles = await getArticles()
  return [
    { href: "/", label: "Home", kind: "page" },
    ...nav.map((n) => ({
      href: n.href,
      label: n.label[0].toUpperCase() + n.label.slice(1),
      kind: "page",
    })),
    ...catalog.map((p) => ({
      href: `/work/${p.slug}`,
      label: p.name,
      kind: "project",
    })),
    ...articles.map((a) => ({
      href: `/writing/${a.slug}`,
      label: a.title,
      kind: "article",
    })),
  ]
}
