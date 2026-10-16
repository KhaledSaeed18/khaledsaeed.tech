import type { NextRequest } from "next/server"

import { quoteCard } from "@/lib/og/card"
import { verifyQuote } from "@/lib/quote"
import { shelf } from "@/lib/quote-text"

/** The pull-quote card: a 1200x630 PNG, only for words the page really says. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const found = await verifyQuote(
    searchParams.get("q") ?? undefined,
    searchParams.get("from") ?? undefined,
    origin
  )
  if (!found)
    return new Response("Not a quote from this site.", { status: 404 })
  const card = await quoteCard({
    quote: found.quote,
    eyebrow: shelf(found.from),
    source: found.title,
  })
  card.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=604800, immutable"
  )
  return card
}
