import { getArticles } from "@/lib/data/devto"
import { siteConfig } from "@/lib/site"

export const revalidate = 86400

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

export async function GET() {
  const articles = await getArticles()
  const items = articles
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${siteConfig.url}/writing/${a.slug}</link>
      <guid isPermaLink="false">devto-${a.id}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <description>${esc(a.description)}</description>
${a.tags.map((t) => `      <category>${esc(t)}</category>`).join("\n")}
    </item>`
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteConfig.name)}, writing</title>
    <link>${siteConfig.url}/writing</link>
    <atom:link href="${siteConfig.url}/writing/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc("Articles on authentication, rendering, architecture and developer tooling.")}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`
  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  })
}
