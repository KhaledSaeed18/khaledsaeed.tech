"use client"

import Link from "next/link"
import * as React from "react"

import { Drawers } from "@/components/print/drawers"
import type { CertificationCategory } from "@/lib/content/certifications"
import { formatMonth, yearOf } from "@/lib/format"
import { cn } from "@/lib/utils"

/** A certification as the ledger prints it, resolved on the server. */
export type LedgerEntry = {
  slug: string
  /** Issue number, oldest first, so it never changes. */
  no: number
  name: string
  issuer: string
  issued: string
  category: CertificationCategory
  skills: string[]
  credentialId?: string
  url?: string
  note?: string
  distinction?: string
  work: { href: string; name: string }[]
}

type Category = { key: CertificationCategory; title: string; blurb: string }

/** Long hashes (over 24 characters) get a middle cut; the full ID stays in the title and for screen readers. */
const shortId = (id: string) =>
  id.length > 24 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id

/**
 * The certifications page as a ledger: drawer tabs by category, a folio line
 * with the totals, and the entries grouped by year, newest first. Every entry
 * is an anchor, so other pages can point at one.
 */
export function CertificationLedger({
  entries,
  categories,
}: {
  entries: LedgerEntry[]
  categories: Category[]
}) {
  const [drawer, setDrawer] = React.useState<CertificationCategory | "all">(
    "all"
  )

  const rows =
    drawer === "all" ? entries : entries.filter((e) => e.category === drawer)
  const open = categories.find((c) => c.key === drawer)
  const years = [...new Set(rows.map((e) => yearOf(e.issued)))]
  const issuers = new Set(rows.map((e) => e.issuer)).size
  const verifiable = rows.filter((e) => e.url).length
  const titleOf = (key: CertificationCategory) =>
    categories.find((c) => c.key === key)?.title.toLowerCase()

  return (
    <div>
      <Drawers
        label="Filter certifications"
        value={drawer}
        onChange={setDrawer}
        drawers={[
          { key: "all" as const, title: "all", count: entries.length },
          ...categories.map((c) => ({
            key: c.key,
            title: c.title.toLowerCase(),
            count: entries.filter((e) => e.category === c.key).length,
          })),
        ]}
      />
      <p className="mt-5 min-h-[1.5em] text-muted-foreground">
        {open
          ? open.blurb
          : "Every certificate, newest first, with its credential ID and a link to verify it wherever the issuer offers one."}
      </p>

      {/* folio line */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-y border-dashed border-border py-2.5 font-mono text-xs text-muted-foreground">
        <span>
          {rows.length} {rows.length === 1 ? "certificate" : "certificates"}
        </span>
        <span>
          {issuers} {issuers === 1 ? "issuer" : "issuers"}
        </span>
        <span>since {formatMonth(rows.at(-1)!.issued).toLowerCase()}</span>
        <span className="hidden sm:inline">{verifiable} verifiable online</span>
      </div>

      <div key={drawer}>
        {years.map((year) => (
          <section
            key={year}
            aria-label={String(year)}
            className="grid gap-x-10 border-b border-dashed border-border md:grid-cols-12"
          >
            <p className="pt-6 font-heading text-3xl font-medium tracking-tight text-muted-foreground/60 tabular-nums md:col-span-2 md:pt-7">
              {year}
            </p>
            <ol className="md:col-span-10">
              {rows
                .filter((e) => yearOf(e.issued) === year)
                .map((e, i) => (
                  <li
                    key={e.slug}
                    id={e.slug}
                    style={{ "--i": i } as React.CSSProperties}
                    className="group/entry rise-in scroll-mt-24 border-b border-dashed border-border py-6 last:border-b-0"
                  >
                    <article className="grid gap-x-8 gap-y-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                      <div className="min-w-0">
                        <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                          <span className="text-brand tabular-nums">
                            no. {String(e.no).padStart(2, "0")}
                          </span>
                          <span aria-hidden="true" className="opacity-50">
                            /
                          </span>
                          <span>{titleOf(e.category)}</span>
                          <span aria-hidden="true" className="opacity-50">
                            /
                          </span>
                          <time dateTime={e.issued}>
                            {formatMonth(e.issued).toLowerCase()}
                          </time>
                        </p>
                        <h2
                          className={cn(
                            "mt-2 text-balance transition-colors group-target/entry:text-brand",
                            e.distinction
                              ? "font-heading text-2xl font-medium tracking-tight"
                              : "text-lg font-medium"
                          )}
                        >
                          {e.name}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {e.issuer}
                        </p>
                        {e.note && (
                          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            {e.note}
                          </p>
                        )}
                        {e.distinction && (
                          <p className="mt-2 font-mono text-xs text-brand">
                            {e.distinction}
                          </p>
                        )}
                        <p className="mt-3 font-mono text-xs text-muted-foreground">
                          {e.skills.join(", ").toLowerCase()}
                        </p>
                        {e.work.length > 0 && (
                          <p className="mt-2 font-mono text-xs text-muted-foreground">
                            built{" "}
                            {e.work.map((w, k) => (
                              <React.Fragment key={w.href}>
                                {k > 0 && ", "}
                                <Link
                                  href={w.href}
                                  className="hit-area text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
                                >
                                  {w.name}
                                </Link>
                              </React.Fragment>
                            ))}
                          </p>
                        )}
                      </div>

                      {(e.credentialId || e.url) && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground sm:flex-col sm:items-end sm:justify-start">
                          {e.credentialId && (
                            <span title={e.credentialId}>
                              id{" "}
                              <span
                                aria-hidden="true"
                                className="text-foreground"
                              >
                                {shortId(e.credentialId)}
                              </span>
                              <span className="sr-only">{e.credentialId}</span>
                            </span>
                          )}
                          {e.url && (
                            <a
                              href={e.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center border border-border bg-secondary px-3 py-2 transition-colors hover:border-brand/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                            >
                              verify
                              <span className="sr-only">
                                {" "}
                                {e.name} on the issuer&apos;s site
                              </span>
                            </a>
                          )}
                        </div>
                      )}
                    </article>
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}
