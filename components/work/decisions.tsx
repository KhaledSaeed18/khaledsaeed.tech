import type * as React from "react"

import type { Decision } from "@/lib/content/projects"

/**
 * Engineering decisions as a ledger: what was chosen, what it was chosen
 * over, and why. The two alternatives sit side by side so the trade-off
 * reads at a glance; the reasoning runs underneath.
 */
export function Decisions({ decisions }: { decisions: Decision[] }) {
  return (
    <div>
      <div
        aria-hidden="true"
        className="hidden grid-cols-[2.25rem_1fr_1fr] gap-6 border-b border-dashed border-border pb-2.5 font-mono text-xs text-muted-foreground sm:grid"
      >
        <span />
        <span>chose</span>
        <span>over</span>
      </div>
      <ol>
        {decisions.map((d, i) => (
          <li
            key={d.chose}
            data-reveal
            style={{ "--reveal-delay": i } as React.CSSProperties}
            className="border-b border-dashed border-border py-5 sm:py-6"
          >
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-[2.25rem_1fr_1fr]">
              <span className="font-mono text-xs text-brand tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-medium">
                <span className="font-mono text-xs font-normal text-muted-foreground sm:hidden">
                  chose{" "}
                </span>
                {d.chose}
              </p>
              <p className="text-muted-foreground">
                <span className="font-mono text-xs text-muted-foreground sm:hidden">
                  over{" "}
                </span>
                {d.over}
              </p>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:ml-[calc(2.25rem+1.5rem)]">
              {d.why}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
