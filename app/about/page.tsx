import type { Metadata } from "next"
import Link from "next/link"
import type * as React from "react"

import { abs, BreadcrumbJsonLd, JsonLd, personRef } from "@/components/json-ld"
import { PageIntro } from "@/components/print/page-intro"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { ContactSheet } from "@/components/home/contact-sheet"
import {
  about,
  credentials,
  education,
  principles,
} from "@/lib/content/profile"
import { siteConfig } from "@/lib/site"
import { pageMeta } from "@/lib/metadata"

export const metadata: Metadata = pageMeta({
  title: "About",
  description:
    "About Khaled Saeed: full-stack engineer from Lebanon, M.S. Computer Engineering student at the Lebanese International University, and builder of open source developer tools.",
  path: "/about",
  type: "profile",
})

export default function AboutPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "about" }]}
        title="About"
        lede={about.short}
      />

      <div className="mx-auto mt-24 max-w-6xl space-y-28 px-6 sm:px-10">
        <section className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              data-reveal
              className={
                i === 0
                  ? "text-2xl leading-snug text-balance text-foreground"
                  : ""
              }
            >
              {p}
            </p>
          ))}
          <p data-reveal>
            The best way to see how I think is the{" "}
            <Link
              href="/work"
              className="text-foreground underline decoration-border underline-offset-4 hover:decoration-brand"
            >
              work
            </Link>
            , and the fastest way to reach me is{" "}
            <a
              href="mailto:contact@khaledsaeed.tech"
              className="text-foreground underline decoration-border underline-offset-4 hover:decoration-brand"
            >
              email
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="education">
          <SpecLabel index={1}>education</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="education" className="sr-only">
            Education
          </h2>
          <ol className="mt-4">
            {education.map((e, i) => (
              <li
                key={e.degree}
                data-reveal
                style={{ "--reveal-delay": i } as React.CSSProperties}
                className="grid gap-2 border-b border-dashed border-border py-8 md:grid-cols-12 md:gap-6"
              >
                <p className="font-mono text-xs text-muted-foreground md:col-span-3">
                  {e.start} to {e.end}
                  {e.current && <span className="ml-2 text-brand">now</span>}
                </p>
                <div className="md:col-span-9">
                  <p className="font-heading text-2xl font-medium tracking-tight">
                    {e.degree}, {e.field}
                  </p>
                  <p className="mt-1 text-muted-foreground">{e.school}</p>
                  {e.note && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {e.note}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="credentials">
          <SpecLabel index={2}>credentials</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="credentials" className="sr-only">
            Certifications
          </h2>
          <ul className="mt-4 grid gap-x-10 md:grid-cols-2">
            {credentials.map((c, i) => (
              <li
                key={c.name}
                data-reveal
                style={{ "--reveal-delay": i % 4 } as React.CSSProperties}
                className={`border-b border-dashed border-border py-5 ${c.highlight ? "md:col-span-2" : ""}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p
                    className={
                      c.highlight
                        ? "font-heading text-2xl font-medium tracking-tight"
                        : "font-medium"
                    }
                  >
                    {c.name}
                  </p>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {c.date}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.issuer}</p>
                {c.note && (
                  <p className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-brand">
                    <span aria-hidden="true" className="size-1.5 bg-brand" />
                    {c.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="principles">
          <SpecLabel index={3}>how i work</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="principles" className="sr-only">
            Principles
          </h2>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
            {principles.map((p, i) => (
              <li
                key={p.title}
                data-reveal
                className="bg-background p-6 sm:p-8"
                style={{ "--reveal-delay": i } as React.CSSProperties}
              >
                <span className="font-mono text-xs text-brand tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-medium">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-32">
        <ContactSheet index={4} />
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
