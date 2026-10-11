import Link from "next/link"

import { Sheet } from "@/components/print/sheet"
import { SheetLink } from "@/components/print/sheet-link"
import {
  CertificateDeck,
  type DeckCard,
} from "@/components/home/certificate-deck"
import {
  categories,
  certificationHref,
  certifications,
  issuerName,
} from "@/lib/content/certifications"
import { education } from "@/lib/content/education"
import { formatMonth, yearOf } from "@/lib/format"

/** How many issuers the directory names before "and N more". */
const ISSUERS_SHOWN = 4

/** Two or three letters for an issuer's seal: "MAPS", "IBM", "DC", "LL". */
function markOf(issuer: string) {
  const acronym = issuer.match(/\(([A-Z]{2,5})\)/)
  if (acronym) return acronym[1]
  const words = issuer.split(/[^A-Za-z0-9]+/).filter(Boolean)
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
  const word = words[0] ?? issuer
  if (/^[A-Z0-9]{2,5}$/.test(word)) return word
  const caps = word.slice(1).replace(/[^A-Z]/g, "")
  return (word[0] + (caps || word[1] || "")).slice(0, 3).toUpperCase()
}

/**
 * Education and certifications on the home page: the degrees as a short
 * transcript with the issuers behind most certificates, every certificate as
 * a printed card in a live deck, and the way into both records.
 */
export function Credentials({ index }: { index: number }) {
  const issuers = new Set(certifications.map((c) => c.issuer)).size
  const topIssuers = [
    ...certifications
      .reduce(
        (m, c) => m.set(issuerName(c), (m.get(issuerName(c)) ?? 0) + 1),
        new Map<string, number>()
      )
      .entries(),
  ]
    .sort((a, b) => b[1] - a[1])
    .slice(0, ISSUERS_SHOWN)
  const deck: DeckCard[] = certifications.map((c, i) => ({
    slug: c.slug,
    no: certifications.length - i,
    href: certificationHref(c),
    name: c.name,
    issuer: issuerName(c),
    mark: markOf(issuerName(c)),
    issued: formatMonth(c.issued).toLowerCase(),
    category: categories[c.category].title.toLowerCase(),
    stock: categories[c.category].stock,
    credentialId: c.credentialId,
    distinction: c.distinction,
  }))

  return (
    <Sheet
      id="credentials"
      index={index}
      label="credentials"
      title="Schooled, then self-taught."
      lede="Computer engineering at the Lebanese International University, and a steady run of courses alongside it. Every certificate links to its credential."
      meta={
        <Link
          href="/about"
          className="hit-area transition-colors hover:text-foreground"
        >
          about
        </Link>
      }
    >
      {/* folio line */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-y border-dashed border-border py-2.5 font-mono text-xs text-muted-foreground">
        <span>{education.length} degrees</span>
        <span>{certifications.length} certificates</span>
        <span>{issuers} issuers</span>
        <span className="hidden sm:inline">
          since {formatMonth(certifications.at(-1)!.issued).toLowerCase()}
        </span>
      </div>

      <div className="grid lg:grid-cols-12">
        {/* transcript */}
        <section
          aria-labelledby="degrees"
          data-reveal
          className="py-8 lg:col-span-5 lg:py-10 lg:pr-10"
        >
          <h3
            id="degrees"
            className="font-mono text-xs font-normal text-muted-foreground"
          >
            degrees
          </h3>
          <ol className="mt-6 border-t border-dashed border-border">
            {education.map((e, i) => (
              <li key={e.slug} className="border-b border-dashed border-border">
                <Link
                  href={`/about/education#${e.slug}`}
                  className="group grid grid-cols-[2.25rem_minmax(0,1fr)] py-5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="pt-0.5 font-mono text-xs text-brand tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                      {yearOf(e.start)} to {yearOf(e.end)}
                      {e.current && (
                        <span className="inline-flex items-center gap-1.5 text-brand">
                          <span
                            aria-hidden="true"
                            className="size-1.5 bg-brand"
                          />
                          now
                        </span>
                      )}
                    </span>
                    <span className="mt-2 block font-heading text-2xl font-medium tracking-tight transition-colors group-hover:text-brand">
                      {e.degree}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {e.field}, {e.school}
                    </span>
                    {e.honors?.map((h) => (
                      <span
                        key={h.title}
                        className="mt-2 block font-mono text-xs text-brand"
                      >
                        {h.title.toLowerCase()}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <h3
            id="issuers"
            className="mt-10 font-mono text-xs font-normal text-muted-foreground"
          >
            most from
          </h3>
          <ul aria-labelledby="issuers" className="mt-4 space-y-2.5">
            {topIssuers.map(([name, count]) => (
              <li key={name} className="flex items-baseline gap-3 text-sm">
                <span>{name}</span>
                {/* leader dots, like a printed directory */}
                <span
                  aria-hidden="true"
                  className="min-w-6 flex-1 translate-y-[-0.3em] self-end border-b border-dotted border-muted-foreground/40"
                />
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {count}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            and {issuers - topIssuers.length} more
          </p>
        </section>

        {/* the deck */}
        <section
          aria-labelledby="certificates"
          className="pb-8 lg:col-span-7 lg:rule-v lg:py-10 lg:pl-10"
        >
          <h3
            id="certificates"
            className="font-mono text-xs font-normal text-muted-foreground"
          >
            certificates, newest on top
          </h3>
          <CertificateDeck cards={deck} />
        </section>
      </div>

      <nav
        aria-label="Education and certifications"
        data-reveal
        className="mt-4 grid gap-4 sm:grid-cols-2"
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
    </Sheet>
  )
}
