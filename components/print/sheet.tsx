import type * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Print furniture. Every section on the site is a "sheet": a numbered spec
 * label, crop marks in the corners and a dotted rule, the way a proof comes
 * off a press. Purely presentational and server-rendered.
 */

/** Registration corners. Place inside a relatively positioned box. */
export function CropMarks({ className }: { className?: string }) {
  const mark = "absolute size-3 border-muted-foreground/35"
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <span className={cn(mark, "-top-px -left-px border-t border-l")} />
      <span className={cn(mark, "-top-px -right-px border-t border-r")} />
      <span className={cn(mark, "-bottom-px -left-px border-b border-l")} />
      <span className={cn(mark, "-right-px -bottom-px border-r border-b")} />
    </span>
  )
}

/** A dotted rule, like a perforation. */
export function Rule({ className }: { className?: string }) {
  return (
    <hr
      aria-hidden="true"
      className={cn("h-px border-0 bg-[length:6px_1px] bg-repeat-x", className)}
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--rule) 0 2px, transparent 2px)",
      }}
    />
  )
}

/** `// 01 selected work` style label. */
export function SpecLabel({
  index,
  children,
  className,
}: {
  index?: string | number
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "font-mono text-xs tracking-wide text-muted-foreground",
        className
      )}
    >
      <span className="text-brand">{"//"}</span>
      {index !== undefined && (
        <span className="ml-2 tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
      )}
      <span className="ml-2">{children}</span>
    </p>
  )
}

/**
 * A page section. Header row with the spec label on the left and optional
 * meta (counts, links) on the right, a title, then content.
 */
export function Sheet({
  id,
  index,
  label,
  title,
  lede,
  meta,
  children,
  className,
}: {
  id?: string
  index?: number
  label: string
  title?: React.ReactNode
  lede?: React.ReactNode
  meta?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn("scroll-mt-24", className)}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="flex items-end justify-between gap-6">
          <SpecLabel index={index}>{label}</SpecLabel>
          {meta && (
            <div className="font-mono text-xs text-muted-foreground">
              {meta}
            </div>
          )}
        </div>
        <Rule className="mt-3" />
        {(title || lede) && (
          <div data-reveal className="mt-10 grid gap-5 md:grid-cols-12">
            {title && (
              <h2
                id={id ? `${id}-title` : undefined}
                className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl md:col-span-7"
              >
                {title}
              </h2>
            )}
            {lede && (
              <p className="max-w-prose text-base leading-relaxed text-muted-foreground md:col-span-5 md:pt-2">
                {lede}
              </p>
            )}
          </div>
        )}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}
