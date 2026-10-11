"use client"

import { cn } from "@/lib/utils"

export type Drawer<K extends string> = { key: K; title: string; count: number }

/**
 * Drawer tabs for filtering a ledger: one pressed button per drawer with its
 * count. On phones the row scrolls sideways and bleeds to the rails.
 */
export function Drawers<K extends string>({
  label,
  drawers,
  value,
  onChange,
}: {
  label: string
  drawers: Drawer<K>[]
  value: K
  onChange: (key: K) => void
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="mx-[calc(var(--frame-pad)*-1)] flex [scrollbar-width:none] gap-1 overflow-x-auto px-(--frame-pad) pb-1 font-mono text-xs sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {drawers.map((d) => {
        const on = value === d.key
        return (
          <button
            key={d.key}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(d.key)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 border px-3 py-2 whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              on
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-muted-foreground/60 hover:text-foreground"
            )}
          >
            {d.title}
            <span className={on ? "opacity-80" : "opacity-70"}>{d.count}</span>
          </button>
        )
      })}
    </div>
  )
}
