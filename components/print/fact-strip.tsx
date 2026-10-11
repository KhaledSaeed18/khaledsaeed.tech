import type * as React from "react"

import { cn } from "@/lib/utils"

export type Fact = [term: string, value: React.ReactNode]

/**
 * A strip of key facts in hairline cells, like the data block on a proof.
 * Cells share the row evenly and wrap on narrow screens.
 */
export function FactStrip({
  facts,
  className,
}: {
  facts: Fact[]
  className?: string
}) {
  return (
    <dl
      className={cn(
        "relative flex flex-wrap gap-px overflow-hidden border border-border bg-border",
        className
      )}
    >
      {facts.map(([k, v]) => (
        <div key={k} className="min-w-[9rem] flex-1 bg-background px-4 py-3.5">
          <dt className="font-mono text-xs text-muted-foreground">{k}</dt>
          <dd className="mt-1 text-sm">{v}</dd>
        </div>
      ))}
    </dl>
  )
}
