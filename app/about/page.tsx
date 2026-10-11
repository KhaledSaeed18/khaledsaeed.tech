import type { Metadata } from "next"
import Link from "next/link"
import type * as React from "react"

import {
  abs,
  BreadcrumbJsonLd,
  certificationLd,
  degreeLd,
  JsonLd,
  personRef,
} from "@/components/json-ld"
import { DropCap } from "@/components/print/drop-cap"
import { PageIntro } from "@/components/print/page-intro"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { SheetLink } from "@/components/print/sheet-link"
import { ContactSheet } from "@/components/home/contact-sheet"
import {
  certificationHref,
  certifications,
  featuredCertifications,
  issuerName,
} from "@/lib/content/certifications"
import { currentEducation, education, schools } from "@/lib/content/education"
import { about } from "@/lib/content/profile"
import { projects } from "@/lib/content/projects"
import { getArticles } from "@/lib/data/devto"
import { formatMonth, yearOf } from "@/lib/format"
import { sameAs, siteConfig, siteIdentity } from "@/lib/site"
import { pageMeta } from "@/lib/metadata"

export const metadata: Metadata = pageMeta({
  title: "About",
  description: `About ${siteIdentity}: full-stack engineer in Lebanon, education at the Lebanese International University, certifications and open-source work.`,
  path: "/about",
  type: "profile",
})

/**
 * Degrees and the featured certifications as one press log, newest first.
 * The full record lives on /about/education and /about/certifications.
 */
const log = [
  ...education.map((e) => ({
    kind: "degree" as const,
    href: `/about/education#${e.slug}`,
    title: `${e.degree}, ${e.field}`,
    issuer: e.school,
    when: `${formatMonth(e.start)} to ${formatMonth(e.end)}`,
    at: e.start,
    current: !!e.current,
    note: e.note,
    distinction: undefined,
  })),
  ...featuredCertifications.map((c) => ({
    kind: "certificate" as const,
    href: certificationHref(c),
    title: c.name,
    issuer: issuerName(c),
    when: formatMonth(c.issued),
    at: c.issued,
    current: false,
    note: undefined,
    distinction: c.distinction,
  })),
].sort((a, b) => b.at.localeCompare(a.at))
const years = [...new Set(log.map((e) => yearOf(e.at)))]

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
      value: `${currentEducation.degree} in ${currentEducation.field}, until ${formatMonth(currentEducation.end)}`,
      href: "/about/education",
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
            <Link
              href="/about/certifications"
              className="hit-area font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              all {certifications.length} certifications
            </Link>
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
                    .filter((e) => yearOf(e.at) === year)
                    .map((e, i) => (
                      <li
                        key={e.href}
                        data-reveal
                        style={{ "--reveal-delay": i } as React.CSSProperties}
                        className="border-b border-dashed border-border last:border-b-0"
                      >
                        <Link href={e.href} className="group block py-6">
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
                            className={`mt-2 transition-colors group-hover:text-brand ${
                              e.distinction || e.kind === "degree"
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
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                              {e.note}
                            </p>
                          )}
                          {e.distinction && (
                            <p className="mt-2 max-w-2xl font-mono text-xs text-brand">
                              {e.distinction}
                            </p>
                          )}
                        </Link>
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </div>

          <nav
            aria-label="Education and certifications"
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            <SheetLink
              href="/about/education"
              eyebrow={`${education.length} degrees`}
              title="Education"
            />
            <SheetLink
              href="/about/certifications"
              eyebrow={`${certifications.length} certificates`}
              title="Certifications"
              alignEnd
            />
          </nav>
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
            alumniOf: schools.map((school) => ({
              "@type": "CollegeOrUniversity",
              ...school,
            })),
            hasCredential: [
              ...education.map(degreeLd),
              ...certifications.map(certificationLd),
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
