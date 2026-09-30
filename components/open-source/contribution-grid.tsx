import type * as React from "react"

import type { Calendar } from "@/lib/data/github"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * A year of GitHub activity drawn the way the rest of the site is printed:
 * each day is a tiny tile inked at one of five Bayer densities instead of a
 * shade of green.
 */
const TONES = [1, 4, 8, 12, 16]

export function ContributionGrid({
  calendar,
  className,
}: {
  calendar: Calendar
  className?: string
}) {
  // Pad the start so columns are whole weeks beginning on Sunday.
  const first = new Date(`${calendar.days[0].date}T00:00:00Z`).getUTCDay()
  const cells = [...Array.from({ length: first }, () => null), ...calendar.days]
  const weeks = Math.ceil(cells.length / 7)

  return (
    <div className={cn("overflow-x-auto pb-2", className)}>
      <div
        role="img"
        aria-label={`${calendar.total} contributions in the last year`}
        className="grid w-max grid-flow-col gap-[3px]"
        style={{
          gridTemplateRows: "repeat(7, 12px)",
          gridTemplateColumns: `repeat(${weeks}, 12px)`,
        }}
      >
        {cells.map((d, i) =>
          d ? (
            <span
              key={d.date}
              title={`${d.count} on ${formatDate(d.date)}`}
              className={cn(
                "dither-tone",
                d.level === 0 ? "text-muted-foreground/40" : "text-foreground"
              )}
              style={
                {
                  "--tone": `var(--dither-${TONES[d.level]})`,
                } as React.CSSProperties
              }
            />
          ) : (
            <span key={`pad-${i}`} />
          )
        )}
      </div>
    </div>
  )
}
