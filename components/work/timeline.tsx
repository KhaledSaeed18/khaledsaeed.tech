import type * as React from "react"

import type { Milestone } from "@/lib/content/projects"
import { formatIso } from "@/lib/format"

/**
 * The project's printings: releases and milestones as a run of dated
 * entries, oldest first, the way a job ticket logs each press run. The
 * latest entry is inked in the brand colour.
 */
export function Timeline({ timeline }: { timeline: Milestone[] }) {
  const last = timeline.length - 1
  return (
    <ol className="border-t border-dashed border-border">
      {timeline.map((m, i) => (
        <li
          key={`${m.date}-${m.title}`}
          data-reveal
          style={{ "--reveal-delay": i } as React.CSSProperties}
          className="grid gap-x-6 gap-y-1 border-b border-dashed border-border py-4 sm:grid-cols-[8.5rem_1fr] sm:py-5"
        >
          <time
            dateTime={m.date}
            className="font-mono text-xs text-muted-foreground tabular-nums sm:pt-1"
          >
            {formatIso(m.date).toLowerCase()}
          </time>
          <div>
            <p className="flex items-center gap-3 font-medium">
              <span
                aria-hidden="true"
                className={
                  i === last
                    ? "size-2 shrink-0 bg-brand"
                    : "size-2 shrink-0 border border-muted-foreground/60"
                }
              />
              {m.title}
            </p>
            {m.body && (
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:ml-5">
                {m.body}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
