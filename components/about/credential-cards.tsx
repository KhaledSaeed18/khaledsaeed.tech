import Link from "next/link"
import type * as React from "react"

import { DitherObject } from "@/components/print/dither-object"
import {
  categories,
  categoryOrder,
  certifications,
} from "@/lib/content/certifications"
import { education } from "@/lib/content/education"
import type { ObjectKind, Stock } from "@/lib/content/projects"
import { formatMonth, yearOf } from "@/lib/format"

const tone = (level: number) =>
  ({ "--tone": `var(--dither-${level})` }) as React.CSSProperties

/** "2025-09" -> months since year 0. A bare year counts to its end. */
const monthOf = (iso: string) =>
  /^\d{4}$/.test(iso)
    ? Number(iso) * 12 + 11
    : yearOf(iso) * 12 + Number(iso.slice(5, 7)) - 1

// the strip is drawn at build time, which is when the page is published
const thisMonth = new Date().getUTCFullYear() * 12 + new Date().getUTCMonth()

/**
 * The pointers from /about to the full records, printed as two cards on
 * stock: education as a strip of half-years filled by degree, and the
 * certifications as a tally, one block per certificate.
 */
export function CredentialCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <EducationCard />
      <CertificationsCard />
    </div>
  )
}

function EducationCard() {
  const oldestFirst = [...education].reverse()
  const first = Math.min(...education.map((e) => yearOf(e.start)))
  const last = Math.max(...education.map((e) => yearOf(e.end)))
  const years = Array.from({ length: last - first + 1 }, (_, i) => first + i)
  // older degrees print as a half tone, the latest in solid ink
  const inkOf = (i: number) => (i === oldestFirst.length - 1 ? 16 : 7)
  const cell = (from: number) => {
    const i = oldestFirst.findIndex(
      (e) => monthOf(e.start) <= from + 5 && monthOf(e.end) >= from
    )
    if (i === -1) return null
    return from > thisMonth ? 3 : inkOf(i)
  }
  const honors = education.flatMap((e) => e.honors ?? [])

  return (
    <StockCard
      href="/about/education"
      stock="teal"
      object="cap"
      eyebrow="education"
      meta={`${education.length} degrees`}
      title="Education"
      lede="Computer engineering at the Lebanese International University: a bachelor's done, a master's under way."
      footer={`${first} to ${last}`}
    >
      <div
        aria-hidden="true"
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${years.length}, 1fr)` }}
      >
        {years.map((y) => (
          <div key={y}>
            <div className="grid grid-cols-2 gap-0.5">
              {[0, 6].map((m) => {
                const level = cell(y * 12 + m)
                return level === null ? (
                  <span key={m} className="h-8 border border-current/25" />
                ) : (
                  <span
                    key={m}
                    className="dither-tone h-8"
                    style={tone(level)}
                  />
                )
              })}
            </div>
            <p className="mt-2 font-mono text-xs tabular-nums opacity-70">
              {`'${String(y).slice(2)}`}
            </p>
          </div>
        ))}
      </div>

      <ul className="mt-6 space-y-2.5">
        {education.map((e) => (
          <li
            key={e.slug}
            className="grid grid-cols-[0.625rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 sm:flex"
          >
            <span
              aria-hidden="true"
              className="dither-tone size-2.5 shrink-0"
              style={tone(inkOf(oldestFirst.indexOf(e)))}
            />
            <span className="font-medium">
              {e.abbr} {e.field}
            </span>
            <span
              aria-hidden="true"
              className="hidden min-w-4 flex-1 translate-y-[-0.3em] self-end border-b border-dotted border-current/40 sm:block"
            />
            <span className="col-start-2 shrink-0 font-mono text-xs tabular-nums">
              {yearOf(e.start)} to {yearOf(e.end)}
              {e.current && " / now"}
            </span>
          </li>
        ))}
      </ul>
      {honors.length > 0 && (
        <ul className="mt-5 space-y-1.5 font-mono text-xs opacity-80">
          {honors.map((h) => (
            <li key={h.title}>honor / {h.title.toLowerCase()}</li>
          ))}
        </ul>
      )}
    </StockCard>
  )
}

function CertificationsCard() {
  const verifiable = certifications.filter((c) => c.url).length
  const issuers = new Set(certifications.map((c) => c.issuer)).size
  const oldest = certifications.at(-1)!
  const counts = categoryOrder.map(
    (k) => certifications.filter((c) => c.category === k).length
  )
  // one column per certificate in the largest category, so bars share a scale
  const columns = Math.max(...counts)

  return (
    <StockCard
      href="/about/certifications"
      stock="terracotta"
      object="folder"
      eyebrow="certifications"
      meta={`${certifications.length} certificates`}
      title="Certifications"
      lede="Self-directed courses, from the web stack to computer science, Go and machine learning."
      footer={`${issuers} issuers, since ${formatMonth(oldest.issued).toLowerCase()}`}
    >
      <ul className="space-y-2.5">
        {categoryOrder.map((k) => {
          const inCategory = certifications.filter((c) => c.category === k)
          return (
            <li
              key={k}
              className="grid grid-cols-[7.5rem_minmax(0,1fr)_1.5rem] items-center gap-3 font-mono text-xs sm:grid-cols-[8.5rem_minmax(0,1fr)_1.5rem]"
            >
              <span className="truncate">{categories[k].short}</span>
              <span
                aria-hidden="true"
                className="grid gap-0.5"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
              >
                {inCategory.map((c) => (
                  <span
                    key={c.slug}
                    className="dither-tone h-3.5"
                    style={tone(c.url ? 16 : 6)}
                  />
                ))}
              </span>
              <span className="text-right tabular-nums">
                {inCategory.length}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs opacity-80">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="dither-tone size-2.5"
            style={tone(16)}
          />
          {verifiable} verifiable online
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="dither-tone size-2.5"
            style={tone(6)}
          />
          {certifications.length - verifiable} by credential id
        </span>
      </p>
    </StockCard>
  )
}

/**
 * A whole-card link printed on stock in the stock's own ink: a spec line,
 * the title with its dithered object, a figure, and a folio along the foot.
 * Lifts on hover like the project cards, and the object turns.
 */
function StockCard({
  href,
  stock,
  object,
  eyebrow,
  meta,
  title,
  lede,
  footer,
  children,
}: {
  href: string
  stock: Stock
  object: ObjectKind
  eyebrow: string
  meta: string
  title: string
  lede: string
  footer: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col p-6 transition-transform duration-300 ease-out hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0 sm:p-8"
      style={{
        backgroundColor: `var(--stock-${stock})`,
        color: `var(--ink-${stock})`,
      }}
    >
      <div className="flex items-center justify-between gap-4 font-mono text-xs">
        <span>{`// ${eyebrow}`}</span>
        <span className="tabular-nums">{meta}</span>
      </div>

      <div className="mt-6 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className="font-heading text-4xl font-medium tracking-tight sm:text-5xl">
            {title}
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-80">
            {lede}
          </p>
        </div>
        <span className="[container-type:size] flex size-20 shrink-0 items-center justify-center sm:size-28">
          <DitherObject kind={object} stock={stock} dot={1} fluid />
        </span>
      </div>

      <div className="mt-10 flex-1">{children}</div>

      <p className="mt-10 flex items-center justify-between gap-4 border-t border-dashed border-current/30 pt-4 font-mono text-xs">
        <span>{footer}</span>
        <span className="transition-opacity group-hover:opacity-70">
          open sheet
        </span>
      </p>
    </Link>
  )
}
