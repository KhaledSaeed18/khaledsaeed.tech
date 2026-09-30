import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { abs, BreadcrumbJsonLd, JsonLd, personRef } from "@/components/json-ld"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { getArticle, getArticles } from "@/lib/data/devto"
import { formatDate } from "@/lib/format"
import { pageMeta } from "@/lib/metadata"

export const revalidate = 86400

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const a = (await getArticles()).find((x) => x.slug === slug)
  if (!a) return {}
  return pageMeta({
    title: a.title,
    description: a.description,
    path: `/writing/${a.slug}`,
    // DEV is the original; this copy points search engines there.
    canonical: a.url,
    type: "article",
    keywords: a.tags,
    publishedTime: a.publishedAt,
    modifiedTime: a.editedAt ?? undefined,
    tags: a.tags,
  })
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const a = await getArticle(slug)
  if (!a) notFound()

  return (
    <article>
      <header className="mx-auto max-w-3xl px-6 pt-32 sm:px-10 sm:pt-40">
        <nav aria-label="Breadcrumb">
          <SpecLabel>
            <Link href="/" className="transition-colors hover:text-foreground">
              home
            </Link>
            <span className="mx-1.5 text-muted-foreground/40">/</span>
            <Link
              href="/writing"
              className="transition-colors hover:text-foreground"
            >
              writing
            </Link>
          </SpecLabel>
        </nav>
        <Rule className="mt-3" />
        <h1 className="mt-12 font-heading text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          {a.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {a.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
          <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
          <span>{a.readingMinutes} min read</span>
          <a
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            originally on dev
          </a>
        </div>
      </header>

      <div
        className="prose-print mx-auto mt-14 max-w-3xl px-6 sm:px-10"
        // Post HTML from DEV (sanitized there, cleaned again in lib/data/devto).
        dangerouslySetInnerHTML={{ __html: a.html }}
      />

      <footer className="mx-auto mt-16 max-w-3xl px-6 sm:px-10">
        <Rule />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          <span>
            {a.reactions} reactions and {a.comments} comments on{" "}
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              dev
            </a>
          </span>
          <Link
            href="/writing"
            className="transition-colors hover:text-foreground"
          >
            all writing
          </Link>
        </div>
      </footer>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: a.title,
          description: a.description,
          datePublished: a.publishedAt,
          dateModified: a.editedAt ?? a.publishedAt,
          url: abs(`/writing/${a.slug}`),
          mainEntityOfPage: a.url,
          isBasedOn: a.url,
          keywords: a.tags.join(", "),
          timeRequired: `PT${a.readingMinutes}M`,
          author: personRef,
          publisher: personRef,
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Writing", path: "/writing" },
          { name: a.title, path: `/writing/${a.slug}` },
        ]}
      />
    </article>
  )
}
