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
import { CredentialCards } from "@/components/about/credential-cards"
import { ContactSheet } from "@/components/home/contact-sheet"
import { certifications } from "@/lib/content/certifications"
import { currentEducation, education, schools } from "@/lib/content/education"
import { about } from "@/lib/content/profile"
import { projects } from "@/lib/content/projects"
import { getArticles } from "@/lib/data/devto"
import { formatMonth } from "@/lib/format"
import { sameAs, siteConfig, siteIdentity } from "@/lib/site"
import { pageMeta } from "@/lib/metadata"

export const metadata: Metadata = pageMeta({
  title: "About",
  description: `About ${siteIdentity}: full-stack engineer in Lebanon, education at the Lebanese International University, certifications and open-source work.`,
  path: "/about",
  type: "profile",
})

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

        <section aria-labelledby="credentials">
          <SpecLabel index={2}>credentials</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="credentials" className="sr-only">
            Education and certifications
          </h2>
          <div data-reveal className="mt-10">
            <CredentialCards />
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
