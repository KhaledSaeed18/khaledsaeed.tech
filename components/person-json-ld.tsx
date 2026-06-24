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
        url: siteConfig.url,
        jobTitle: siteConfig.role,
        description: siteConfig.description,
        knowsAbout: [...siteConfig.knowsAbout],
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
