import type { Metadata } from "next"
import Link from "next/link"
import type * as React from "react"

import { abs, BreadcrumbJsonLd, JsonLd, personRef } from "@/components/json-ld"
import { DropCap } from "@/components/print/drop-cap"
import { PageIntro } from "@/components/print/page-intro"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { ContactSheet } from "@/components/home/contact-sheet"
import { about, credentials, education } from "@/lib/content/profile"
import { projects } from "@/lib/content/projects"
import { getArticles } from "@/lib/data/devto"
import { sameAs, siteConfig, siteIdentity } from "@/lib/site"
import { pageMeta } from "@/lib/metadata"

export const metadata: Metadata = pageMeta({
  title: "About",
  description: `About ${siteIdentity}: full-stack engineer in Lebanon, education at the Lebanese International University, certifications and open-source work.`,
  path: "/about",
  type: "profile",
})

/** "Sep 2025" -> sortable month index */
const month = (s: string) => {
  const d = new Date(`1 ${s}`)
  return Number.isNaN(d.getTime())
    ? Number(s) * 12
    : d.getFullYear() * 12 + d.getMonth()
}

/** Education and certifications as one press log, newest first. */
const log = [
  ...education.map((e) => ({
    kind: "degree" as const,
    title: `${e.degree}, ${e.field}`,
    issuer: e.school,
    when: `${e.start} to ${e.end}`,
    at: month(e.start),
    current: e.current,
    note: e.note,
    highlight: false,
  })),
  ...credentials.map((c) => ({
    kind: "certificate" as const,
    title: c.name,
    issuer: c.issuer,
    when: c.date,
    at: month(c.date),
    current: false,
    note: c.note,
    highlight: !!c.highlight,
  })),
]
  .sort((a, b) => b.at - a.at)
  .map((e) => ({ ...e, year: Math.floor(e.at / 12) }))
const years = [...new Set(log.map((e) => e.year))]

export default async function AboutPage() {
  const articles = await getArticles()
  const specs: { term: string; value: string; href?: string }[] = [
    {
      term: "online as",
      value: siteConfig.username,
      href: `https://github.com/${siteConfig.username}`,
    },
    { term: "role", value: siteConfig.role },
    { term: "based in", value: siteConfig.location },
    {
      term: "languages",
      value: "TypeScript end to end, Swift on the Mac, Rust on Linux",
    },
    {
      term: "studying",
      value: `${education[0].degree} in ${education[0].field}, until ${education[0].end}`,
    },
    { term: "learning", value: "AI and machine learning inside real products" },
    {
      term: "public work",
      value: `${projects.length} projects`,
      href: "/work",
    },
    ...(articles.length
      ? [
          {
            term: "writing",
            value: `${articles.length} articles`,
            href: "/writing",
          },
        ]
      : []),
    { term: "reach", value: "contact@khaledsaeed.tech", href: "/contact" },
  ]
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "about" }]}
        title="About"
        lede={about.short}
      />

      <div className="frame mt-24 space-y-28">
        <section
          aria-label="Bio"
          className="space-y-6 text-lg leading-relaxed text-muted-foreground"
        >
          {about.paragraphs.map((p, i) =>
            i === 0 ? (
              <DropCap
                key={i}
                text={p}
                className="text-2xl leading-snug text-foreground"
              />
            ) : (
              <p key={i} data-reveal>
                {p}
              </p>
            )
          )}
        </section>

        <section aria-labelledby="specifications">
          <SpecLabel index={1}>specifications</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="specifications" className="sr-only">
            Specifications
          </h2>
          <dl className="mt-4 grid gap-x-10 md:grid-cols-2">
            {specs.map((s, i) => (
              <div
                key={s.term}
                data-reveal
                style={{ "--reveal-delay": i % 4 } as React.CSSProperties}
                className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-dashed border-border py-4 sm:grid-cols-[9rem_minmax(0,1fr)]"
              >
                <dt className="font-mono text-xs text-muted-foreground">
                  {s.term}
                </dt>
                <dd className="break-words text-foreground">
                  {s.href ? (
                    <Link
                      href={s.href}
                      className="hit-area underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
                    >
                      {s.value}
                    </Link>
                  ) : (
                    s.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="run-log">
          <div className="flex items-end justify-between gap-6">
            <SpecLabel index={2}>run log</SpecLabel>
            <span className="font-mono text-xs text-muted-foreground">
              {log.length} entries
            </span>
          </div>
          <Rule className="mt-3" />
          <h2 id="run-log" className="sr-only">
            Education and certifications
          </h2>
          <div className="mt-4">
            {years.map((year) => (
              <div
                key={year}
                className="grid gap-x-10 border-b border-dashed border-border md:grid-cols-12"
              >
                <p className="pt-6 font-heading text-3xl font-medium tracking-tight text-muted-foreground/60 tabular-nums md:col-span-2 md:pt-7">
                  {year}
                </p>
                <ol className="md:col-span-10">
                  {log
                    .filter((e) => e.year === year)
                    .map((e, i) => (
                      <li
                        key={e.title}
                        data-reveal
                        style={{ "--reveal-delay": i } as React.CSSProperties}
                        className="border-b border-dashed border-border py-6 last:border-b-0"
                      >
                        <p className="font-mono text-xs text-muted-foreground">
                          <span
                            className={
                              e.kind === "degree"
                                ? "text-brand"
                                : "text-muted-foreground"
                            }
                          >
                            {e.kind}
                          </span>
                          <span className="mx-2 opacity-50">/</span>
                          {e.when}
                          {e.current && (
                            <span className="ml-2 inline-flex items-center gap-1.5 text-brand">
                              <span
                                aria-hidden="true"
                                className="size-1.5 bg-brand"
                              />
                              now
                            </span>
                          )}
                        </p>
                        <p
                          className={`mt-2 ${
                            e.highlight || e.kind === "degree"
                              ? "font-heading text-2xl font-medium tracking-tight"
                              : "text-lg font-medium"
                          }`}
                        >
                          {e.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {e.issuer}
                        </p>
                        {e.note && (
                          <p
                            className={`mt-2 max-w-2xl text-sm leading-relaxed ${e.highlight ? "font-mono text-xs text-brand" : "text-muted-foreground"}`}
                          >
                            {e.note}
                          </p>
                        )}
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-32">
        <ContactSheet index={3} />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: abs("/about"),
          mainEntity: {
            ...personRef,
            "@type": "Person",
            name: siteConfig.name,
            alternateName: siteConfig.username,
            sameAs,
            description: about.short,
            image: abs("/character.png"),
            alumniOf: {
              "@type": "CollegeOrUniversity",
              name: "Lebanese International University",
              url: "https://www.liu.edu.lb",
            },
            hasCredential: [
              ...education.map((e) => ({
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "degree",
                name: `${e.degree} in ${e.field}`,
                recognizedBy: {
                  "@type": "CollegeOrUniversity",
                  name: e.school,
                },
              })),
              ...credentials.map((c) => ({
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "certificate",
                name: c.name,
                recognizedBy: { "@type": "Organization", name: c.issuer },
              })),
            ],
          },
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
    </>
  )
}
