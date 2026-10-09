"use client"

import type * as React from "react"
import { useState } from "react"

import { cn } from "@/lib/utils"

type Layer = { layer: string; items: string[] }
type Pin = { n: number; name: string; group: number } | null

/**
 * The stack drawn as an electronic part: a dual in-line package with one pin
 * per tool, grouped by layer. Pins run down the left side and back up the
 * right, the way a real DIP is numbered; an odd count gets a "nc" (not
 * connected) pin so both sides match. Hovering a pin or a legend entry lights
 * that layer and dims the rest.
 */
export function Pinout({ layers }: { layers: Layer[] }) {
  const [hot, setHot] = useState<number | null>(null)

  const pins: Pin[] = layers.flatMap((l, group) =>
    l.items.map((name) => ({ n: 0, name, group }))
  )
  if (pins.length % 2) pins.push(null)
  pins.forEach((p, i) => p && (p.n = i + 1))
  const total = pins.length
  const half = total / 2
  const left = pins.slice(0, half)
  // right side counts upward from the bottom
  const right = pins.slice(half).reverse()
  const start = layers.map((_, g) => pins.findIndex((p) => p?.group === g) + 1)
  const tone = (g: number) =>
    ({
      "--tone": `var(--dither-${Math.max(4, 16 - g * 2)})`,
    }) as React.CSSProperties

  const dim = (g: number | undefined) =>
    hot !== null && g !== hot ? "opacity-30" : "opacity-100"

  const label = (p: Pin, side: "l" | "r") => (
    <span
      className={cn(
        "truncate font-mono text-[10px] transition-opacity max-[379px]:text-[9px] sm:font-sans sm:text-sm",
        side === "l" ? "text-right" : "text-left",
        p ? "text-foreground" : "text-muted-foreground/50",
        dim(p?.group)
      )}
    >
      {p ? p.name : "nc"}
    </span>
  )

  const stub = (p: Pin) => (
    <span
      aria-hidden="true"
      className={cn(
        "h-1.5 w-full transition-opacity",
        p ? "dither-tone text-brand" : "bg-muted-foreground/25",
        dim(p?.group)
      )}
      style={p ? tone(p.group) : undefined}
    />
  )

  return (
    <figure className="m-0" onMouseLeave={() => setHot(null)}>
      <div
        role="img"
        aria-label={`Pin diagram of the stack: ${layers
          .map((l) => `${l.layer}: ${l.items.join(", ")}`)
          .join("; ")}`}
        className="grid grid-cols-[1fr_0.625rem_5.25rem_0.625rem_1fr] items-center gap-x-1.5 max-[379px]:grid-cols-[1fr_0.5rem_4.25rem_0.5rem_1fr] max-[379px]:gap-x-1 sm:grid-cols-[1fr_1.5rem_10rem_1.5rem_1fr] sm:gap-x-3"
        style={{ gridTemplateRows: `repeat(${half}, minmax(0, 1fr))` }}
      >
        {/* the package */}
        <div
          aria-hidden="true"
          className="relative col-start-3 flex flex-col items-center justify-center self-stretch border border-muted-foreground/50 bg-card"
          style={{ gridRow: `1 / span ${half}` }}
        >
          {/* pin 1 notch and dot */}
          <span className="absolute -top-px left-1/2 size-3 -translate-x-1/2 border-x border-b border-muted-foreground/50 bg-background sm:size-4" />
          <span className="absolute top-1.5 left-4 size-1.5 bg-brand sm:top-2.5 sm:left-7" />
          <span className="font-heading text-base font-medium tracking-tight max-[379px]:text-sm sm:text-3xl">
            KS-{total}
          </span>
          <span className="mt-2 hidden font-mono text-xs text-muted-foreground sm:block">
            full-stack
          </span>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            rev 2026
          </span>
          {/* pin numbers along the inside edges */}
          <div
            className="absolute inset-y-0 left-1 grid sm:left-2"
            style={{ gridTemplateRows: `repeat(${half}, minmax(0, 1fr))` }}
          >
            {left.map((p, r) => (
              <span
                key={r}
                className={cn(
                  "flex items-center font-mono text-[8px] text-muted-foreground tabular-nums sm:text-[10px]",
                  dim(p?.group)
                )}
              >
                {String(r + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
          <div
            className="absolute inset-y-0 right-1 grid text-right sm:right-2"
            style={{ gridTemplateRows: `repeat(${half}, minmax(0, 1fr))` }}
          >
            {right.map((p, r) => (
              <span
                key={r}
                className={cn(
                  "flex items-center justify-end font-mono text-[8px] text-muted-foreground tabular-nums sm:text-[10px]",
                  dim(p?.group)
                )}
              >
                {String(total - r).padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>

        {left.map((p, r) => (
          <PinRow
            key={`l${r}`}
            row={r}
            side="l"
            onEnter={() => p && setHot(p.group)}
          >
            {label(p, "l")}
            {stub(p)}
          </PinRow>
        ))}
        {right.map((p, r) => (
          <PinRow
            key={`r${r}`}
            row={r}
            side="r"
            onEnter={() => p && setHot(p.group)}
          >
            {stub(p)}
            {label(p, "r")}
          </PinRow>
        ))}
      </div>

      <figcaption className="mt-8">
        <ul className="grid gap-x-6 gap-y-2 font-mono text-xs sm:grid-cols-3">
          {layers.map((l, g) => {
            const from = start[g]
            const to = from + l.items.length - 1
            return (
              <li
                key={l.layer}
                onMouseEnter={() => setHot(g)}
                className={cn(
                  "flex cursor-default items-center gap-2.5 transition-opacity",
                  dim(g)
                )}
              >
                <span
                  aria-hidden="true"
                  className="dither-tone size-3 shrink-0 text-brand"
                  style={tone(g)}
                />
                <span className="text-muted-foreground tabular-nums">
                  {String(from).padStart(2, "0")} to{" "}
                  {String(to).padStart(2, "0")}
                </span>
                <span className="text-foreground">{l.layer.toLowerCase()}</span>
              </li>
            )
          })}
        </ul>
        <p className="mt-5 font-mono text-xs text-muted-foreground">
          figure 1. pin configuration, dip-{total}, top view
        </p>
      </figcaption>
    </figure>
  )
}

/** One pin: its label and lead, on its side of the package, in its row. */
function PinRow({
  row,
  side,
  onEnter,
  children,
}: {
  row: number
  side: "l" | "r"
  onEnter: () => void
  children: React.ReactNode
}) {
  return (
    <div
      onMouseEnter={onEnter}
      className={cn(
        "col-span-2 grid grid-cols-subgrid items-center py-1.5 sm:py-2",
        side === "l" ? "col-start-1" : "col-start-4"
      )}
      style={{ gridRow: row + 1 }}
    >
      {children}
    </div>
  )
}
