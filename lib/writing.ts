import { stripEmoji, type Article } from "@/lib/data/devto"

/**
 * Shared presentation helpers for articles: the home front page and the
 * writing archive set them the same way.
 */

/** Tags too broad to say what a piece is about. */
const GENERIC = new Set([
  "webdev",
  "javascript",
  "programming",
  "software",
  "productivity",
  "beginners",
  "tutorial",
])
export const kicker = (a: Article) =>
  a.tags.find((t) => !GENERIC.has(t)) ?? a.tags[0] ?? "notes"

/**
 * The lead's standfirst: the article's own opening, a few sentences long and
 * cut at a sentence end. Falls back to DEV's description, which is an excerpt
 * that can repeat the title and stops mid-sentence.
 */
export function standfirst(
  a: Article,
  html?: string,
  { min = 200, max = 440 }: { min?: number; max?: number } = {}
) {
  const text = [...(html ?? "").matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => m[1])
    .map((p) =>
      stripEmoji(p.replace(/<[^>]+>/g, ""))
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter((p) => p.length > 40)
    .join(" ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&rsquo;/g, "’")
    .replace(/&[a-z#0-9]+;/gi, " ")
  if (text.length > 120) {
    const end = [...text.slice(0, max).matchAll(/[.!?](?=\s|$)/g)]
      .map((m) => m.index + 1)
      .filter((i) => i >= min)
    return end.length
      ? text.slice(0, end[end.length - 1])
      : text.slice(0, max - 40).replace(/\s+\S*$/, "") + "…"
  }
  let s = a.description.replace(/\s+/g, " ").trim()
  if (s.toLowerCase().startsWith(a.title.toLowerCase()))
    s = s.slice(a.title.length).replace(/^[\s:.\-]+/, "")
  return s.replace(/[\s,.;:]*\.\.\.$/, "").trim() + "…"
}
