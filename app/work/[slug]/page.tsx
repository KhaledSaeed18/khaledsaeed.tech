import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type * as React from "react"

import { abs, BreadcrumbJsonLd, JsonLd, personRef } from "@/components/json-ld"
import { DitherObject } from "@/components/print/dither-object"
import { CropMarks, Rule, SpecLabel } from "@/components/print/sheet"
import { ContactSheet } from "@/components/home/contact-sheet"
import { getProject, groups, projects } from "@/lib/content/projects"
import { getMyStars } from "@/lib/data/github"
import { pageMeta } from "@/lib/metadata"
import { formatNumber } from "@/lib/format"

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) return {}
  return pageMeta({
    title: `${p.name}, ${p.kind.toLowerCase()}`,
    description: `${p.tagline} A ${p.kind.toLowerCase()} by Khaled Saeed, with the problem, the approach and the stack.`,
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
  const i = projects.indexOf(p)
  const next = projects[(i + 1) % projects.length]
  const prev = projects[(i - 1 + projects.length) % projects.length]

  const facts: [string, React.ReactNode][] = [
    ["year", p.year],
    ["type", p.kind.toLowerCase()],
    ["group", groups[p.group].title.toLowerCase()],
    ...(p.status
      ? ([["status", p.status.toLowerCase()]] as [string, React.ReactNode][])
      : []),
    ...(stars
      ? ([["stars", formatNumber(stars)]] as [string, React.ReactNode][])
      : []),
  ]

  return (
    <article>
      <header className="mx-auto max-w-6xl px-6 pt-32 sm:px-10 sm:pt-40">
        <nav aria-label="Breadcrumb">
          <SpecLabel>
            <Link href="/" className="transition-colors hover:text-foreground">
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
              {p.tagline}
            </p>
            <p className="mt-6 max-w-prose leading-relaxed text-muted-foreground">
              {p.summary}
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
                {String(i + 1).padStart(2, "0")}/{projects.length}
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

        <dl className="relative mt-14 flex flex-wrap gap-px overflow-hidden border border-border bg-border">
          {facts.map(([k, v]) => (
            <div
              key={k}
              className="min-w-[9rem] flex-1 bg-background px-4 py-3.5"
            >
              <dt className="font-mono text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-1 text-sm">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="mx-auto mt-24 max-w-6xl space-y-24 px-6 sm:px-10">
        <Block index={1} label="the problem">
          <p className="max-w-3xl font-heading text-2xl leading-snug font-medium tracking-tight text-balance sm:text-3xl">
            {p.problem}
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
                <h3 className="mt-3 text-lg font-medium">{a.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {a.body}
                </p>
              </li>
            ))}
          </ol>
        </Block>

        <Block index={3} label="highlights">
          <div className="grid gap-12 lg:grid-cols-12">
            <ul className="space-y-4 lg:col-span-7">
              {p.highlights.map((h) => (
                <li key={h} data-reveal className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-2 shrink-0 bg-brand"
                  />
                  <span className="text-lg">{h}</span>
                </li>
              ))}
            </ul>
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
          <PagerLink
            href={`/work/${prev.slug}`}
            dir="previous"
            name={prev.name}
          />
          <PagerLink
            href={`/work/${next.slug}`}
            dir="next"
            name={next.name}
            alignEnd
          />
        </nav>
      </div>

      <div className="mt-32">
        <ContactSheet index={4} />
      </div>

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
            ["TypeScript", "Python", "Swift", "Go"].includes(s)
          ),
          keywords: p.stack.join(", "),
          dateCreated: String(p.year),
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

function PagerLink({
  href,
  dir,
  name,
  alignEnd,
}: {
  href: string
  dir: string
  name: string
  alignEnd?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group relative border border-border p-6 transition-colors hover:border-brand/40 ${alignEnd ? "sm:text-right" : ""}`}
    >
      <CropMarks />
      <span className="font-mono text-xs text-muted-foreground">
        {dir} sheet
      </span>
      <span className="mt-2 block font-heading text-2xl font-medium tracking-tight transition-colors group-hover:text-brand">
        {name}
      </span>
    </Link>
  )
}
