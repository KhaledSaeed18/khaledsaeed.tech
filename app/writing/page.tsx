import type { Metadata } from "next"
import Link from "next/link"
import type * as React from "react"

import { BreadcrumbJsonLd } from "@/components/json-ld"
import { PageIntro } from "@/components/print/page-intro"
import { getArticles } from "@/lib/data/devto"
import { formatDate } from "@/lib/format"
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
          <ol className="border-t border-dashed border-border">
            {articles.map((a, i) => (
              <li
                key={a.id}
                data-reveal
                style={{ "--reveal-delay": i } as React.CSSProperties}
                className="border-b border-dashed border-border"
              >
                <Link
                  href={`/writing/${a.slug}`}
                  className="group grid gap-x-8 gap-y-3 py-8 md:grid-cols-12 md:items-baseline"
                >
                  <div className="flex gap-4 font-mono text-xs text-muted-foreground md:col-span-3 md:flex-col md:gap-1.5">
                    <time dateTime={a.publishedAt}>
                      {formatDate(a.publishedAt)}
                    </time>
                    <span>{a.readingMinutes} min read</span>
                  </div>
                  <div className="md:col-span-9">
                    <h2 className="font-heading text-2xl font-medium tracking-tight text-balance transition-colors group-hover:text-brand sm:text-3xl">
                      {a.title}
                    </h2>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                      {a.description}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {a.tags.map((t) => (
                        <li
                          key={t}
                          className="font-mono text-xs text-muted-foreground/80"
                        >
                          #{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
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
