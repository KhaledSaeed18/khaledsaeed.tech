import {
  certificationHref,
  issuers,
  type Certification,
} from "@/lib/content/certifications"
import { honors, type Education } from "@/lib/content/education"
import { formatIso } from "@/lib/format"
import { siteConfig } from "@/lib/site"

/** Structured data for search and answer engines. Content is ours, never user input. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

export const personRef = { "@id": `${siteConfig.url}/#person` }

export const abs = (path: string) => new URL(path, siteConfig.url).toString()

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[]
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: abs(it.path),
        })),
      }}
    />
  )
}

/** A degree as a schema.org credential, anchored to its sheet. */
export function degreeLd(e: Education) {
  return {
    "@type": "EducationalOccupationalCredential",
    "@id": abs(`/about/education#${e.slug}`),
    name: `${e.degree} in ${e.field}`,
    credentialCategory: "degree",
    educationalLevel: e.level,
    description: e.summary,
    keywords: e.skills.join(", "),
    // awarded on completion; a degree in progress has no date yet
    ...(e.current ? {} : { dateCreated: e.end }),
    url: abs(`/about/education#${e.slug}`),
    recognizedBy: {
      "@type": "CollegeOrUniversity",
      name: e.school,
      url: e.schoolUrl,
    },
  }
}

/** A certification as a schema.org credential, anchored to its entry. */
export function certificationLd(c: Certification) {
  const issuer: { name: string; url?: string } = issuers[c.issuer]
  return {
    "@type": "EducationalOccupationalCredential",
    "@id": abs(certificationHref(c)),
    name: c.name,
    credentialCategory: "certificate",
    dateCreated: c.issued,
    keywords: c.skills.join(", "),
    url: abs(certificationHref(c)),
    ...(c.credentialId ? { identifier: c.credentialId } : {}),
    ...(c.note ? { description: c.note } : {}),
    ...(c.url ? { sameAs: c.url } : {}),
    ...(c.documents?.length
      ? {
          subjectOf: c.documents.map((d) => ({
            "@type": "DigitalDocument",
            name: /certificate/i.test(c.name)
              ? c.name
              : `${c.name} certificate`,
            url: d.href,
          })),
        }
      : {}),
    recognizedBy: { "@type": "Organization", ...issuer },
  }
}

/** Honors as schema.org `award` text: "Dean's Honor List, Spring 2023-2024 (May 2024)". */
export const awards = honors.map((h) => `${h.title} (${formatIso(h.date)})`)

/**
 * The person, pointing at credentials by id. Pages that define credentials
 * add this beside them, so each one is tied to its holder.
 */
export function holderLd(credentialIds: string[]) {
  return {
    "@type": "Person",
    ...personRef,
    hasCredential: credentialIds.map((id) => ({ "@id": id })),
  }
}
