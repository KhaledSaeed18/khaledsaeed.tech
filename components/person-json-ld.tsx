import { abs, awards } from "@/components/json-ld"
import { education, schools } from "@/lib/content/education"
import {
  currentCompany,
  currentRole,
  employers,
} from "@/lib/content/experience"
import { sameAs, siteConfig } from "@/lib/site"

/**
 * Person + WebSite structured data. Helps search engines and answer engines
 * (GEO) understand who this site is about and link the verified profiles.
 */
export function PersonJsonLd() {
  const personId = `${siteConfig.url}/#person`

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.name,
        alternateName: siteConfig.username,
        url: siteConfig.url,
        jobTitle: currentRole.title,
        worksFor: {
          "@type": "Organization",
          name: currentCompany.name,
          ...(currentCompany.url ? { url: currentCompany.url } : {}),
        },
        description: siteConfig.description,
        knowsAbout: [...siteConfig.knowsAbout],
        image: `${siteConfig.url}/character.png`,
        email: "mailto:contact@khaledsaeed.tech",
        alumniOf: [
          ...schools.map((school) => ({
            "@type": "CollegeOrUniversity",
            ...school,
          })),
          // past employers; the current one is worksFor
          ...employers
            .filter((e) => e.name !== currentCompany.name)
            .map((e) => ({ "@type": "Organization", ...e })),
        ],
        award: awards,
        // degrees are defined in full on /about/education; certificates on /about/certifications
        hasCredential: education.map((e) => ({
          "@id": abs(`/about/education#${e.slug}`),
        })),
        sameAs,
        address: {
          "@type": "PostalAddress",
          addressCountry: siteConfig.location,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        alternateName: siteConfig.username,
        description: siteConfig.description,
        inLanguage: "en",
        author: { "@id": personId },
        publisher: { "@id": personId },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // Structured data is static and trusted (no user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
