import { cleanQuote, quoteFits } from "@/lib/quote-text"
import { siteRoutes } from "@/lib/routes"

/**
 * Pull quotes. A quote card or share page is only made for words that are
 * really printed on the page they cite: the server reads that page and
 * checks. Anyone can build a /quote URL, so without the check anyone could
 * put words on this domain under my name.
 */

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  mdash: "—",
  ndash: "–",
  hellip: "…",
}

const decode = (s: string) =>
  s.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (m, e: string) => {
    if (e[0] === "#")
      return String.fromCodePoint(
        e[1] === "x" || e[1] === "X"
          ? parseInt(e.slice(2), 16)
          : Number(e.slice(1))
      )
    return ENTITIES[e.toLowerCase()] ?? m
  })

/**
 * Text compared without case or spacing: a selection that crosses an inline
 * tag (a drop cap, a link) or a block boundary still matches the page.
 */
const squash = (s: string) =>
  decode(s)
    .toLowerCase()
    .replace(/[\s ]+/g, "")

/** The visible text of a page's HTML, squashed. */
const pageText = (html: string) =>
  squash(
    html
      .replace(/<(script|style|template|noscript)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]+>/g, " ")
  )

/**
 * The quote, if `q` really appears on `from` (a page of this site), with
 * that page's title. Null for anything else.
 */
export async function verifyQuote(
  q: string | undefined,
  from: string | undefined,
  origin: string
): Promise<{ quote: string; from: string; title: string } | null> {
  if (!q || !from) return null
  const quote = cleanQuote(q)
  if (!quoteFits(quote)) return null
  // only the site's own pages, by exact path
  const routes = await siteRoutes()
  const route = routes.find((r) => r.href === from)
  if (!route) return null

  try {
    const res = await fetch(new URL(from, origin), {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const html = await res.text()
    if (!pageText(html).includes(squash(quote))) return null
    return { quote, from, title: route.label }
  } catch {
    return null
  }
}
