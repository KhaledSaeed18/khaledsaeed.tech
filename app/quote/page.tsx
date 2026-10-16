import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

import { PageIntro } from "@/components/print/page-intro"
import { CropMarks, Rule, SpecLabel } from "@/components/print/sheet"
import { SheetLink } from "@/components/print/sheet-link"
import { verifyQuote } from "@/lib/quote"
import { fragment, quoteQuery, shelf } from "@/lib/quote-text"
import { siteConfig } from "@/lib/site"

type Props = {
  searchParams: Promise<{ q?: string | string[]; from?: string | string[] }>
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

/** This request's own origin, so the check reads the same deployment. */
async function origin() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? ""
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https")
  return host ? `${proto}://${host}` : siteConfig.url
}

async function load(props: Props) {
  const sp = await props.searchParams
  return verifyQuote(one(sp.q), one(sp.from), await origin())
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const found = await load(props)
  if (!found) return { title: "Not a quote", robots: { index: false } }
  const query = quoteQuery(found.quote, found.from)
  const title = `“${found.quote.length > 60 ? `${found.quote.slice(0, 59)}…` : found.quote}”`
  const description = `A pull quote from “${found.title}” by ${siteConfig.name}.`
  const image = { url: `/quote/card?${query}`, width: 1200, height: 630 }
  return {
    title,
    description,
    // a share page, not a page of its own: kept out of search
    robots: { index: false, follow: true },
    alternates: { canonical: found.from },
    openGraph: {
      type: "article",
      url: `/quote?${query}`,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  }
}

/**
 * A pull quote, shared. Only words that really appear on the page they cite
 * get a page and a card (lib/quote.ts reads the page to check), and the way
 * on is straight back to the passage, highlighted where it was printed.
 */
export default async function QuotePage(props: Props) {
  const found = await load(props)
  if (!found) notFound()
  const context = `${found.from}#:~:text=${fragment(found.quote)}`

  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "pull quote" }]}
        title="Pull quote"
        lede={
          <>
            Set from {shelf(found.from) === "home" ? "the" : "a"}{" "}
            {shelf(found.from)} on this site, and checked against the page it
            came from.
          </>
        }
      />

      <div className="frame mt-24 space-y-24">
        <section aria-labelledby="quote">
          <SpecLabel index={1}>the passage</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="quote" className="sr-only">
            The quote
          </h2>
          <figure className="mt-12">
            <blockquote className="flex gap-4 font-heading text-3xl leading-tight font-medium tracking-tight text-balance sm:gap-6 sm:text-5xl">
              <span aria-hidden="true" className="text-brand">
                “
              </span>
              <p>{found.quote}</p>
            </blockquote>
            <figcaption className="mt-8 font-mono text-sm text-muted-foreground">
              {siteConfig.name.toLowerCase()}, {found.title.toLowerCase()}
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="context">
          <SpecLabel index={2}>in context</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="context" className="sr-only">
            Read it in context
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {/* a full load, not a client route change: only a real
                navigation scrolls to and highlights a text fragment */}
            <a
              href={context}
              className="group relative border border-border p-6 transition-colors hover:border-brand/40"
            >
              <CropMarks />
              <span className="font-mono text-xs text-muted-foreground">
                read it where it was printed
              </span>
              <span className="mt-2 block font-heading text-2xl font-medium tracking-tight transition-colors group-hover:text-brand">
                {found.title}
              </span>
            </a>
            <SheetLink
              href={found.from === "/" ? "/writing" : "/"}
              eyebrow="make your own: select a passage, right-click"
              title={found.from === "/" ? "Writing" : "Home"}
              alignEnd
            />
          </div>
        </section>
      </div>
    </>
  )
}
