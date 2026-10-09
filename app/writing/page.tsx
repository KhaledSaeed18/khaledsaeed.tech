import type { Metadata } from "next"
import Link from "next/link"
import type * as React from "react"

import { BreadcrumbJsonLd } from "@/components/json-ld"
import { PageIntro } from "@/components/print/page-intro"
import { getArticle, getArticles } from "@/lib/data/devto"
import { formatDate } from "@/lib/format"
import { kicker, standfirst } from "@/lib/writing"
import { pageMeta } from "@/lib/metadata"

export const metadata: Metadata = {
  ...pageMeta({
    title: "Writing",
    description:
      "Articles by Khaled Saeed on authentication, rendering in Next.js, backend architecture and developer tooling.",
    path: "/writing",
  }),
  alternates: {
    canonical: "/writing",
    types: { "application/rss+xml": "/writing/rss.xml" },
  },
}

export default async function WritingPage() {
  const articles = await getArticles()
  // issues are numbered oldest first, so a number never changes
  const issues = articles.map((a, i) => ({
    a,
    no: articles.length - i,
    year: new Date(a.publishedAt).getFullYear(),
  }))
  const years = [...new Set(issues.map((x) => x.year))]
  const decks = new Map(
    await Promise.all(
      articles.map(
        async (a) =>
          [
            a.id,
            standfirst(a, (await getArticle(a.slug))?.html, {
              min: 120,
              max: 260,
            }),
          ] as const
      )
    )
  )
  const minutes = articles.reduce((n, a) => n + a.readingMinutes, 0)
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "writing" }]}
        title="Writing"
        lede="Practical write-ups, first published on DEV. Mostly the things I had to figure out the long way, written down so the next person does not."
        meta={
          <a
            href="/writing/rss.xml"
            className="transition-colors hover:text-foreground"
          >
            rss
          </a>
        }
      />

      <div className="frame mt-20">
        {articles.length === 0 ? (
          <p className="text-muted-foreground">
            Articles are loading from DEV. Read them at{" "}
            <a
              href="https://dev.to/khaledsaeed18"
              className="underline underline-offset-4"
            >
              dev.to/khaledsaeed18
            </a>
            .
          </p>
        ) : (
          <>
            {/* folio line */}
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-y border-dashed border-border py-2.5 font-mono text-xs text-muted-foreground">
              <span>{articles.length} issues</span>
              <span>
                since{" "}
                {formatDate(
                  articles[articles.length - 1].publishedAt
                ).toLowerCase()}
              </span>
              <span className="hidden sm:inline">{minutes} min of reading</span>
              <span>first published on dev</span>
            </div>

            {years.map((year) => (
              <section
                key={year}
                aria-label={String(year)}
                className="grid gap-x-10 border-b border-dashed border-border md:grid-cols-12"
              >
                <p className="pt-6 font-heading text-3xl font-medium tracking-tight text-muted-foreground/60 tabular-nums md:col-span-2 md:pt-9">
                  {year}
                </p>
                <ol className="md:col-span-10">
                  {issues
                    .filter((x) => x.year === year)
                    .map(({ a, no }, i) => (
                      <li
                        key={a.id}
                        data-reveal
                        style={{ "--reveal-delay": i } as React.CSSProperties}
                        className="border-b border-dashed border-border last:border-b-0"
                      >
                        <Link
                          href={`/writing/${a.slug}`}
                          className="group block py-8"
                        >
                          <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                            <span className="text-brand tabular-nums">
                              no. {String(no).padStart(2, "0")}
                            </span>
                            <span aria-hidden="true" className="opacity-50">
                              /
                            </span>
                            <span>{kicker(a)}</span>
                            <span aria-hidden="true" className="opacity-50">
                              /
                            </span>
                            <time dateTime={a.publishedAt}>
                              {formatDate(a.publishedAt).toLowerCase()}
                            </time>
                          </p>
                          <h2 className="mt-3 font-heading text-2xl font-medium tracking-tight text-balance transition-colors group-hover:text-brand sm:text-3xl">
                            {a.title}
                          </h2>
                          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
                            {decks.get(a.id)}
                          </p>
                          {/* column inches: one dithered block per minute */}
                          <p className="mt-5 flex items-center gap-3 font-mono text-xs text-muted-foreground">
                            <span aria-hidden="true" className="flex gap-0.5">
                              {Array.from(
                                { length: a.readingMinutes },
                                (_, k) => (
                                  <span
                                    key={k}
                                    className="dither-tone h-2.5 w-3 text-brand"
                                    style={
                                      {
                                        "--tone": "var(--dither-10)",
                                      } as React.CSSProperties
                                    }
                                  />
                                )
                              )}
                            </span>
                            {a.readingMinutes} min read
                          </p>
                        </Link>
                      </li>
                    ))}
                </ol>
              </section>
            ))}
          </>
        )}
      </div>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Writing", path: "/writing" },
        ]}
      />
    </>
  )
}
