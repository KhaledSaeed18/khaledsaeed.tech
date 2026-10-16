/**
 * Pull-quote helpers safe for the browser: limits, the shared query string
 * and the text fragment that lands on the passage. The server's check that
 * a quote is real lives in lib/quote.ts.
 */

export const QUOTE_MIN = 12
export const QUOTE_MAX = 280

/** One line, trimmed, and short enough for a card. */
export const cleanQuote = (q: string) => q.replace(/\s+/g, " ").trim()

export const quoteFits = (q: string) => {
  const n = cleanQuote(q).length
  return n >= QUOTE_MIN && n <= QUOTE_MAX
}

/** Query string shared by the page and its card. */
export const quoteQuery = (q: string, from: string) =>
  new URLSearchParams({ q: cleanQuote(q), from }).toString()

/** What a page is, for the card's eyebrow. */
export function shelf(path: string) {
  const [, top] = path.split("/")
  if (!top) return "home"
  if (top === "work") return path === "/work" ? "work" : "case study"
  if (top === "writing") return path === "/writing" ? "writing" : "article"
  return top
}

/** A text fragment (#:~:text=) that points at the quoted words. */
export function fragment(text: string) {
  const enc = (s: string) => encodeURIComponent(s).replace(/-/g, "%2D")
  const words = cleanQuote(text).split(" ")
  if (words.length <= 8) return enc(words.join(" "))
  return `${enc(words.slice(0, 4).join(" "))},${enc(words.slice(-4).join(" "))}`
}
