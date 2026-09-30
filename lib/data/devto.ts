/**
 * Articles published on DEV. Pulled at build time and revalidated daily, so a
 * new post shows up without a deploy. Every page links back to DEV as the
 * canonical source.
 */

const USER = "khaledsaeed18"
const DAY = 60 * 60 * 24

export type Article = {
  id: number
  /** Our slug: DEV's slug without its random suffix. */
  slug: string
  devSlug: string
  title: string
  description: string
  url: string
  publishedAt: string
  editedAt: string | null
  readingMinutes: number
  reactions: number
  comments: number
  tags: string[]
  cover: string | null
}

type DevListItem = {
  id: number
  slug: string
  title: string
  description: string
  url: string
  canonical_url: string
  published_at: string
  edited_at: string | null
  reading_time_minutes: number
  public_reactions_count: number
  comments_count: number
  tag_list: string[] | string
  cover_image: string | null
}

function normalize(a: DevListItem): Article {
  return {
    id: a.id,
    // DEV always appends a short random segment; drop it for a clean URL
    slug: a.slug.replace(/-[a-z0-9]+$/, ""),
    devSlug: a.slug,
    title: stripEmoji(a.title),
    description: stripEmoji(a.description),
    url: a.canonical_url || a.url,
    publishedAt: a.published_at,
    editedAt: a.edited_at,
    readingMinutes: a.reading_time_minutes,
    reactions: a.public_reactions_count,
    comments: a.comments_count,
    tags: Array.isArray(a.tag_list)
      ? a.tag_list
      : a.tag_list.split(",").map((t) => t.trim()),
    cover: a.cover_image,
  }
}

/** Brand rule: no emoji anywhere in the UI, including imported titles. */
const stripEmoji = (s: string) =>
  s
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim()

export async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(
      `https://dev.to/api/articles?username=${USER}&per_page=100`,
      {
        next: { revalidate: DAY, tags: ["devto"] },
        headers: { accept: "application/vnd.forem.api-v1+json" },
      }
    )
    if (!res.ok) return []
    const list = (await res.json()) as DevListItem[]
    return list
      .map(normalize)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  } catch {
    return []
  }
}

export async function getArticle(
  slug: string
): Promise<(Article & { html: string }) | null> {
  const meta = (await getArticles()).find((a) => a.slug === slug)
  if (!meta) return null
  try {
    const res = await fetch(
      `https://dev.to/api/articles/${USER}/${meta.devSlug}`,
      {
        next: { revalidate: DAY, tags: ["devto"] },
        headers: { accept: "application/vnd.forem.api-v1+json" },
      }
    )
    if (!res.ok) return null
    const full = (await res.json()) as { body_html: string }
    return { ...meta, html: cleanHtml(full.body_html) }
  } catch {
    return null
  }
}

/**
 * DEV already sanitizes post HTML; this strips what we never want inline
 * (scripts, embeds, inline handlers) and the empty anchor tags DEV puts
 * inside every heading.
 */
function cleanHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/<a name="([^"]+)" href="#[^"]*">\s*<\/a>/g, "")
    .replace(/<h([1-6])>\s*/g, "<h$1>")
    .replace(/<div class="highlight__panel[\s\S]*?<\/div>\s*<\/div>/g, "")
}
