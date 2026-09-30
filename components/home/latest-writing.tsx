import Link from "next/link"
import type * as React from "react"

import { Sheet } from "@/components/print/sheet"
import { getArticles } from "@/lib/data/devto"
import { formatDate } from "@/lib/format"

export async function LatestWriting() {
  const articles = (await getArticles()).slice(0, 3)
  if (!articles.length) return null
  return (
    <Sheet
      id="writing"
      index={4}
      label="writing"
      title="Written down so I only learn it once."
      lede="Practical write-ups on authentication, rendering and architecture, published on DEV."
      meta={
        <Link
          href="/writing"
          className="transition-colors hover:text-foreground"
        >
          all articles
        </Link>
      }
    >
      <ul className="border-t border-dashed border-border">
        {articles.map((a, i) => (
          <li
            key={a.id}
            data-reveal
            style={{ "--reveal-delay": i } as React.CSSProperties}
            className="border-b border-dashed border-border"
          >
            <Link
              href={`/writing/${a.slug}`}
              className="group grid gap-x-6 gap-y-2 py-6 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline"
            >
              <time
                dateTime={a.publishedAt}
                className="font-mono text-xs text-muted-foreground"
              >
                {formatDate(a.publishedAt)}
              </time>
              <span>
                <span className="font-heading text-xl font-medium tracking-tight text-balance transition-colors group-hover:text-brand sm:text-2xl">
                  {a.title}
                </span>
                <span className="mt-2 line-clamp-2 block max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {a.description}
                </span>
              </span>
              <span className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                {a.readingMinutes} min read
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
