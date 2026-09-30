import Link from "next/link"
import type * as React from "react"

import { Rule, SpecLabel } from "@/components/print/sheet"

/**
 * The top of every inner page: a breadcrumb set as a spec label, the page
 * title and a lede. Pages supply their own right-hand meta if they want one.
 */
export function PageIntro({
  crumbs,
  title,
  lede,
  meta,
  children,
}: {
  crumbs: { href?: string; label: string }[]
  title: React.ReactNode
  lede?: React.ReactNode
  meta?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <header className="mx-auto max-w-6xl px-6 pt-32 sm:px-10 sm:pt-40">
      <div className="flex items-end justify-between gap-6">
        <nav aria-label="Breadcrumb">
          <SpecLabel>
            {crumbs.map((c, i) => (
              <span key={c.label}>
                {i > 0 && (
                  <span className="mx-1.5 text-muted-foreground/40">/</span>
                )}
                {c.href ? (
                  <Link
                    href={c.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-foreground">
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </SpecLabel>
        </nav>
        {meta && (
          <div className="font-mono text-xs text-muted-foreground">{meta}</div>
        )}
      </div>
      <Rule className="mt-3" />
      <div className="mt-12 grid gap-6 md:grid-cols-12">
        <h1 className="font-heading text-5xl font-medium tracking-tight text-balance sm:text-6xl md:col-span-7">
          {title}
        </h1>
        {lede && (
          <p className="max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg md:col-span-5 md:pt-3">
            {lede}
          </p>
        )}
      </div>
      {children}
    </header>
  )
}
