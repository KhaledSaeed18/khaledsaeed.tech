import type { Metadata } from "next"

import {
  CertificationLedger,
  type LedgerEntry,
} from "@/components/about/certification-ledger"
import { ContactSheet } from "@/components/home/contact-sheet"
import {
  abs,
  BreadcrumbJsonLd,
  certificationLd,
  JsonLd,
  personRef,
} from "@/components/json-ld"
import { PageIntro } from "@/components/print/page-intro"
import { SheetLink } from "@/components/print/sheet-link"
import {
  categories,
  categoryOrder,
  certifications,
  issuerName,
} from "@/lib/content/certifications"
import { projectsBySlug } from "@/lib/content/projects"
import { pageMeta } from "@/lib/metadata"
import { siteIdentity } from "@/lib/site"

export const metadata: Metadata = pageMeta({
  title: "Certifications",
  description: `Certifications earned by ${siteIdentity} in AI, backend, frontend, computer science and DevOps, from Boot.dev, Meta, IBM, MongoDB and more.`,
  path: "/about/certifications",
})

// issue numbers count up from the oldest, so a number never changes
const entries: LedgerEntry[] = certifications.map((c, i) => ({
  slug: c.slug,
  no: certifications.length - i,
  name: c.name,
  issuer: issuerName(c),
  issued: c.issued,
  category: c.category,
  skills: c.skills,
  credentialId: c.credentialId,
  url: c.url,
  note: c.note,
  distinction: c.distinction,
  work: projectsBySlug(c.projects ?? []).map((p) => ({
    href: `/work/${p.slug}`,
    name: p.name,
  })),
}))

export default function CertificationsPage() {
  return (
    <>
      <PageIntro
        crumbs={[
          { href: "/", label: "home" },
          { href: "/about", label: "about" },
          { label: "certifications" },
        ]}
        title="Certifications"
        lede="Courses I finished and the credentials that came with them. Most were self-directed, alongside the degree and the projects: the web stack first, then computer science fundamentals, Go and machine learning."
        meta={
          // the drawers carry the count on phones, where the crumbs need the room
          <span className="hidden sm:inline">
            {certifications.length} certificates
          </span>
        }
      />

      <div className="frame mt-20">
        <CertificationLedger
          entries={entries}
          categories={categoryOrder.map((key) => ({
            key,
            ...categories[key],
          }))}
        />

        <nav
          aria-label="Related pages"
          className="mt-24 grid gap-4 sm:grid-cols-2"
        >
          <SheetLink href="/about" eyebrow="back to" title="About" />
          <SheetLink
            href="/about/education"
            eyebrow="related sheet"
            title="Education"
            alignEnd
          />
        </nav>
      </div>

      <div className="mt-32">
        <ContactSheet index={1} />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          url: abs("/about/certifications"),
          name: "Certifications",
          about: personRef,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: certifications.length,
            itemListElement: certifications.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: certificationLd(c),
            })),
          },
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Certifications", path: "/about/certifications" },
        ]}
      />
    </>
  )
}
