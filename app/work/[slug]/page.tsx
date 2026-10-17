import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type * as React from "react"

import { abs, BreadcrumbJsonLd, JsonLd, personRef } from "@/components/json-ld"
import { DitherObject } from "@/components/print/dither-object"
import { FactStrip, type Fact } from "@/components/print/fact-strip"
import {
  PrintProject,
  PrintSheetButton,
} from "@/components/print/print-project"
import { ProofStrip } from "@/components/print/proof-strip"
import { Rev, RevCuts, Revisions } from "@/components/print/revisions"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { SheetLink } from "@/components/print/sheet-link"
import { ContactSheet } from "@/components/home/contact-sheet"
import {
  catalog,
  getProject,
  groups,
  kindPhrase,
  projects,
  withArticle,
  type Project,
} from "@/lib/content/projects"
import { getMyStars } from "@/lib/data/github"
import { pageMeta } from "@/lib/metadata"
import { formatNumber } from "@/lib/format"
import { revisionsOf } from "@/lib/revisions"

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

/** Tagline plus what it is, kept under 160 characters for search results. */
function caseStudyDescription(p: Project) {
  const long = `${p.tagline} ${withArticle(kindPhrase(p.kind))[0].toUpperCase()}${withArticle(kindPhrase(p.kind)).slice(1)} by Khaled Saeed: the problem, the approach and the stack.`
  if (long.length <= 160) return long
  const mid = `${p.tagline} ${withArticle(kindPhrase(p.kind))[0].toUpperCase()}${withArticle(kindPhrase(p.kind)).slice(1)} by Khaled Saeed.`
  return mid.length <= 160 ? mid : `${p.tagline} By Khaled Saeed.`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) return {}
  return pageMeta({
    title: `${p.name}, ${kindPhrase(p.kind)}`,
    description: caseStudyDescription(p),
    path: `/work/${p.slug}`,
    keywords: [p.name, p.kind, ...p.stack],
  })
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) notFound()

  const stars = (await getMyStars())[p.repo]
  const i = catalog.indexOf(p)
  const next = catalog[(i + 1) % catalog.length]
  const prev = catalog[(i - 1 + catalog.length) % catalog.length]

  const revisions = revisionsOf(p)

  const facts: Fact[] = [
    ["year", p.year],
    ["type", p.kind.toLowerCase()],
    ["group", groups[p.group].title.toLowerCase()],
    ...(p.status ? ([["status", p.status.toLowerCase()]] as Fact[]) : []),
    ...(p.stat
      ? ([[p.stat.label, p.stat.value]] as Fact[])
      : stars
        ? ([["stars", formatNumber(stars)]] as Fact[])
        : []),
  ]

  return (
    <Revisions data={revisions}>
      <article>
        <header className="frame pt-32 sm:pt-40">
          <nav aria-label="Breadcrumb">
            <SpecLabel>
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                home
              </Link>
              <span className="mx-1.5 text-muted-foreground/40">/</span>
              <Link
                href="/work"
                className="transition-colors hover:text-foreground"
              >
                work
              </Link>
              <span className="mx-1.5 text-muted-foreground/40">/</span>
              <span aria-current="page" className="text-foreground">
                {p.slug}
              </span>
            </SpecLabel>
          </nav>
          <Rule className="mt-3" />

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs text-brand">{`// ${p.kind.toLowerCase()}`}</p>
              <h1 className="mt-4 font-heading text-5xl font-medium tracking-tight sm:text-7xl">
                {p.name}
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-snug text-balance text-foreground sm:text-2xl">
                <Rev id="tagline" text={p.tagline} />
              </p>
              <p className="mt-6 max-w-prose leading-relaxed text-muted-foreground">
                <Rev id="summary" text={p.summary} />
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {p.links.map((l, k) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      k === 0
                        ? "inline-flex items-center bg-foreground px-4 py-2.5 font-mono text-xs text-background transition-opacity hover:opacity-85"
                        : "inline-flex items-center border border-border bg-secondary px-4 py-2.5 font-mono text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
                    }
                  >
                    {l.label.toLowerCase()}
                  </a>
                ))}
                <PrintSheetButton className="inline-flex items-center border border-dashed border-border px-4 py-2.5 font-mono text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground" />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                className="relative flex aspect-square items-center justify-center"
                style={{ backgroundColor: `var(--stock-${p.stock})` }}
              >
                <span
                  className="absolute top-4 left-4 font-mono text-xs"
                  style={{ color: `var(--ink-${p.stock})` }}
                >
                  {`// ${p.object}`}
                </span>
                <span
                  className="absolute top-4 right-4 font-mono text-xs tabular-nums"
                  style={{ color: `var(--ink-${p.stock})` }}
                >
                  {String(i + 1).padStart(2, "0")}/{catalog.length}
                </span>
                <div className="[container-type:size] flex size-[92%] items-center justify-center">
                  <DitherObject
                    kind={p.object}
                    stock={p.stock}
                    dot={4}
                    fluid
                    play
                    label={`${p.name} illustration`}
                  />
                </div>
              </div>
            </div>
          </div>

          <FactStrip facts={facts} className="mt-14" />
        </header>

        <div className="frame mt-24 space-y-24">
          <Block index={1} label="the problem">
            <p className="font-heading text-2xl leading-snug font-medium tracking-tight text-pretty sm:text-3xl">
              <Rev id="problem" text={p.problem} />
            </p>
          </Block>

          <Block index={2} label="how it works">
            <ol className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
              {p.approach.map((a, k) => (
                <li
                  key={a.title}
                  data-reveal
                  className="relative bg-background p-6 sm:p-8 md:[&:last-child:nth-child(odd)]:col-span-2"
                  style={{ "--reveal-delay": k } as React.CSSProperties}
                >
                  <span className="font-mono text-xs text-brand tabular-nums">
                    {String(k + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-medium">
                    <Rev id={`approach.${k}.title`} text={a.title} />
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    <Rev id={`approach.${k}.body`} text={a.body} />
                  </p>
                </li>
              ))}
            </ol>
            <RevCuts section="approach" />
          </Block>

          {p.proof && (
            <Block index={3} label="measured">
              <ProofStrip proof={p.proof} />
            </Block>
          )}

          <Block index={p.proof ? 4 : 3} label="highlights">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <ul className="space-y-4">
                  {p.highlights.map((h, k) => (
                    <li key={h} data-reveal className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-2 shrink-0 bg-brand"
                      />
                      <span className="text-lg">
                        <Rev id={`highlights.${k}`} text={h} />
                      </span>
                    </li>
                  ))}
                </ul>
                <RevCuts section="highlights" />
              </div>
              <div className="lg:col-span-5">
                <p className="font-mono text-xs text-muted-foreground">
                  built with
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <li
                      key={s}
                      className="border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Block>

          <nav aria-label="More projects" className="grid gap-4 sm:grid-cols-2">
            <SheetLink
              href={`/work/${prev.slug}`}
              eyebrow="previous sheet"
              title={prev.name}
            />
            <SheetLink
              href={`/work/${next.slug}`}
              eyebrow="next sheet"
              title={next.name}
              alignEnd
            />
          </nav>
        </div>

        <div className="mt-32">
          <ContactSheet index={p.proof ? 5 : 4} />
        </div>

        <PrintProject project={p} />

        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            "@id": abs(`/work/${p.slug}#project`),
            name: p.name,
            headline: p.tagline,
            description: p.summary,
            url: abs(`/work/${p.slug}`),
            codeRepository: `https://github.com/KhaledSaeed18/${p.repo}`,
            programmingLanguage: p.stack.filter((s) =>
              ["TypeScript", "Python", "Swift", "Go", "Rust", "C"].includes(s)
            ),
            keywords: p.stack.join(", "),
            dateCreated: String(p.year),
            dateModified: p.updatedAt,
            creativeWorkStatus: p.status,
            author: personRef,
            creator: personRef,
            sameAs: p.links.map((l) => l.href),
          }}
        />
        <BreadcrumbJsonLd
          items={[
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: p.name, path: `/work/${p.slug}` },
          ]}
        />
      </article>
    </Revisions>
  )
}

function Block({
  index,
  label,
  children,
}: {
  index: number
  label: string
  children: React.ReactNode
}) {
  return (
    <section aria-label={label}>
      <h2 className="sr-only">{label}</h2>
      <SpecLabel index={index}>{label}</SpecLabel>
      <Rule className="mt-3" />
      <div data-reveal className="mt-10">
        {children}
      </div>
    </section>
  )
}
