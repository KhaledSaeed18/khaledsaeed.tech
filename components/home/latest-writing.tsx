import Link from "next/link"
import type * as React from "react"

import { DropCap } from "@/components/print/drop-cap"
import { Sheet } from "@/components/print/sheet"
import { getArticle, getArticles } from "@/lib/data/devto"
import { kicker, standfirst } from "@/lib/writing"
import { formatDate } from "@/lib/format"

/**
 * Writing as a broadsheet front page: a folio line, the latest piece as the
 * lead story with a dithered drop cap, and the next ones as a column of
 * briefs behind a dotted column rule.
 */
export async function LatestWriting() {
  const all = await getArticles()
  if (!all.length) return null
  const [lead, ...rest] = all.slice(0, 4)
  const deck = standfirst(lead, (await getArticle(lead.slug))?.html)

  return (
    <Sheet
      id="writing"
      index={3}
      label="writing"
      title="Written down so I only learn it once."
      lede="Practical write-ups on authentication, rendering and architecture, published on DEV."
      meta={
        <Link
          href="/writing"
          className="hit-area transition-colors hover:text-foreground"
        >
          all articles
        </Link>
      }
    >
      {/* folio line */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-y border-dashed border-border py-2.5 font-mono text-xs text-muted-foreground">
        <span>no. {String(all.length).padStart(2, "0")}</span>
        <span>last printed {formatDate(lead.publishedAt).toLowerCase()}</span>
        <span className="hidden sm:inline">first published on dev</span>
      </div>

      <div className="grid lg:grid-cols-12">
        {/* lead story */}
        <article
          data-reveal
          className="border-b border-dashed border-border py-8 lg:col-span-7 lg:border-b-0 lg:py-10 lg:pr-10"
        >
          <Link href={`/writing/${lead.slug}`} className="group block">
            <p className="font-mono text-xs text-brand">
              {"// "}
              {kicker(lead)}
            </p>
            <h3 className="mt-4 font-heading text-3xl leading-[1.08] font-medium tracking-tight text-balance transition-colors group-hover:text-brand sm:text-5xl">
              {lead.title}
            </h3>
            <DropCap
              text={deck}
              className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg"
            />
            <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
              <span>{lead.readingMinutes} min read</span>
              <span aria-hidden="true">/</span>
              <time dateTime={lead.publishedAt}>
                {formatDate(lead.publishedAt)}
              </time>
            </p>
            <p className="mt-3 font-mono text-xs text-foreground underline underline-offset-4">
              continue reading
            </p>
          </Link>
        </article>

        {/* briefs, behind a dotted column rule */}
        <ol className="lg:col-span-5 lg:rule-v lg:pl-10">
          {rest.map((a, i) => (
            <li
              key={a.id}
              data-reveal
              style={{ "--reveal-delay": i + 1 } as React.CSSProperties}
              className="border-b border-dashed border-border last:border-b-0"
            >
              <Link
                href={`/writing/${a.slug}`}
                className="group block py-6 lg:py-7"
              >
                <p className="font-mono text-xs text-muted-foreground">
                  {"// "}
                  {kicker(a)}
                </p>
                <h3 className="mt-2.5 font-heading text-xl leading-snug font-medium tracking-tight text-balance transition-colors group-hover:text-brand sm:text-2xl">
                  {a.title}
                </h3>
                <p className="mt-3 flex flex-wrap gap-x-4 font-mono text-xs text-muted-foreground">
                  <span>{a.readingMinutes} min read</span>
                  <span aria-hidden="true">/</span>
                  <time dateTime={a.publishedAt}>
                    {formatDate(a.publishedAt)}
                  </time>
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </Sheet>
  )
}
