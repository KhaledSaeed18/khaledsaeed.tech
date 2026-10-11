import type * as React from "react"

import {
  careerStart,
  chaptersOfRun,
  formatTenure,
  inkOf,
  monthOf,
  monthsBetween,
  monthsOfRun,
} from "@/lib/content/experience"
import { formatMonth } from "@/lib/format"

const tone = (level: number) =>
  ({ "--tone": `var(--dither-${level})` }) as React.CSSProperties

/**
 * The run so far: one cell per month since the first day of work, inked by
 * chapter, with the years marked beneath. Unbroken, because it was. The list
 * under it is the same record in words, so screen readers get the facts.
 */
export function RunStrip() {
  const first = monthOf(careerStart)
  const months = monthsOfRun()
  const chapters = chaptersOfRun()

  return (
    <div>
      <div aria-hidden="true">
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}
        >
          {months.map(({ m, chapter }) =>
            chapter === -1 ? (
              <span key={m} className="h-10 border border-border" />
            ) : (
              <span
                key={m}
                className="dither-tone h-10 text-foreground"
                style={tone(inkOf(chapter))}
              />
            )
          )}
        </div>
        <div
          className="mt-2 grid gap-0.5 font-mono text-xs text-muted-foreground tabular-nums"
          style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}
        >
          {months.map(({ m }) => (
            <span key={m} className="relative h-4 whitespace-nowrap">
              {m % 12 === 0 || m === first ? (
                <span className="absolute left-0">
                  {`'${String(Math.floor(m / 12)).slice(2)}`}
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      <ol className="mt-8 border-t border-dashed border-border">
        {chapters.map((c, i) => (
          <li
            key={`${c.company.slug}-${c.role.title}`}
            className="grid grid-cols-[0.75rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-b border-dashed border-border py-3.5 sm:flex"
          >
            <span
              aria-hidden="true"
              className="dither-tone size-3 shrink-0 translate-y-px text-foreground"
              style={tone(inkOf(i))}
            />
            <span className="font-medium">{c.role.title}</span>
            <span className="col-start-2 text-muted-foreground">
              {c.company.name}
            </span>
            <span
              aria-hidden="true"
              className="hidden min-w-4 flex-1 translate-y-[-0.3em] self-end border-b border-dotted border-muted-foreground/40 sm:block"
            />
            <span className="col-start-2 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
              {formatMonth(c.role.start).toLowerCase()} to{" "}
              {c.role.end ? (
                formatMonth(c.role.end).toLowerCase()
              ) : (
                <span className="text-brand">now</span>
              )}
              <span className="ml-3 hidden sm:inline">
                {formatTenure(monthsBetween(c.role.start, c.role.end))}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
