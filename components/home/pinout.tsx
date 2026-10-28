"use client"

import type * as React from "react"
import { useEffect, useId, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type Layer = { layer: string; items: string[] }
/** A connected pin, or null for a spare "nc" (not connected) one. */
type Pin = { n: number; name: string; group: number } | null
type Part = ReturnType<typeof partOf>
/** What both packages draw from: the part, and the shared highlight. */
type View = {
  part: Part
  rev: string
  /** The layer that is lit, if any. */
  hot: number | null
  dim: (group: number | undefined) => boolean
  enter: (group: number) => void
}

/**
 * The 4x4 Bayer order behind app/dither.css: --dither-k inks the first k of
 * these cells (x, y), so the SVG patterns below match the site's mask tiles.
 */
const BAYER: [number, number][] = [
  [0, 0],
  [2, 2],
  [2, 0],
  [0, 2],
  [1, 1],
  [3, 3],
  [3, 1],
  [1, 3],
  [1, 0],
  [3, 2],
  [3, 0],
  [1, 2],
  [0, 1],
  [2, 3],
  [2, 1],
  [0, 3],
]

/**
 * One dither tone per layer: six steps of terracotta, then the teal plate for
 * the layers after them (platform at full strength, quality at half).
 */
function toneOf(group: number) {
  return group < 6
    ? { ink: "brand" as const, level: Math.max(4, 16 - 2 * group) }
    : { ink: "teal" as const, level: Math.max(4, 16 - 8 * (group - 6)) }
}

/** A tone as an HTML swatch or lead: the site's own dither mask. */
function toneStyle(group: number) {
  const { ink, level } = toneOf(group)
  return {
    className: cn("dither-tone", ink === "brand" ? "text-brand" : "text-teal"),
    style: { "--tone": `var(--dither-${level})` } as React.CSSProperties,
  }
}

/**
 * Each bond wire's clock: one pulse a cycle, a cycle of 5.5 to 8.5 seconds,
 * started at a scattered point so the wires never fire together.
 */
function clock(i: number) {
  const t = 5.5 + (i % 7) * 0.5
  const d = -(((i * 53) % 97) / 97) * t
  return { "--t": `${t}s`, "--d": `${d.toFixed(2)}s` } as React.CSSProperties
}

/** The ink a layer's wires light up in. */
const wireInk = (group: number) =>
  toneOf(group).ink === "brand" ? "stroke-brand" : "stroke-teal"

/**
 * The part: one pin per item in stack order, so each layer is a contiguous
 * run, padded at the end with nc pins to a multiple of four so the quad
 * package has four equal sides. Both packages carry the same pin count.
 */
function partOf(layers: Layer[]) {
  const named = layers.flatMap((l, group) =>
    l.items.map((name) => ({ name, group }))
  )
  const total = Math.ceil(named.length / 4) * 4
  const pins: Pin[] = Array.from({ length: total }, (_, i) =>
    named[i] ? { n: i + 1, ...named[i] } : null
  )
  let next = 1
  const runs = layers.map((l) => {
    const from = next
    next += l.items.length
    return { from, to: next - 1 }
  })
  const digits = String(total).length
  const num = (n: number) => String(n).padStart(digits, "0")
  return { pins, total, runs, num }
}

/**
 * The stack drawn as an electronic part, KS-<pins>, listed in two packages
 * the way a real datasheet lists one die: a quad flat pack where there is
 * room (pins counter-clockwise from the top of the left side) and a dual
 * in-line package on phones (down the left side, back up the right).
 * Pointing at a pin or a legend row lights that layer and dims the rest;
 * legend rows also take focus, and a click pins the highlight.
 */
export function Pinout({ layers, rev }: { layers: Layer[]; rev: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)
  const hot = hover ?? pinned
  const part = partOf(layers)
  const view: View = {
    part,
    rev,
    hot,
    dim: (g) => hot !== null && g !== hot,
    enter: setHover,
  }

  // the signals only run while the chip is on screen
  const fig = useRef<HTMLElement>(null)
  const [live, setLive] = useState(false)
  useEffect(() => {
    const el = fig.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      rootMargin: "120px",
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <figure
      ref={fig}
      data-live={live ? "" : undefined}
      className="m-0"
      onMouseLeave={() => setHover(null)}
    >
      <div
        role="img"
        aria-label={`Pin diagram of the stack, part KS-${part.total}: ${layers
          .map((l) => `${l.layer}: ${l.items.join(", ")}`)
          .join("; ")}`}
      >
        <Dip {...view} className="md:hidden" />
        <Qfp {...view} className="hidden md:block" />
      </div>

      <figcaption className="mt-8">
        <ul className="grid gap-x-12 gap-y-1 font-mono text-xs sm:grid-cols-[repeat(2,max-content)] md:justify-center lg:grid-cols-[repeat(4,max-content)] lg:gap-x-10 xl:grid-cols-[repeat(2,max-content)] xl:gap-x-16">
          {layers.map((l, g) => {
            const { from, to } = part.runs[g]
            const swatch = toneStyle(g)
            return (
              <li key={l.layer}>
                <button
                  type="button"
                  aria-pressed={pinned === g}
                  onMouseEnter={() => setHover(g)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(g)}
                  onBlur={() => setHover(null)}
                  onClick={() => setPinned((p) => (p === g ? null : g))}
                  className={cn(
                    "flex w-full items-center gap-2.5 py-1 text-left transition-opacity focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none",
                    view.dim(g) ? "opacity-30" : "opacity-100"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn("size-3 shrink-0", swatch.className)}
                    style={swatch.style}
                  />
                  <span className="text-muted-foreground tabular-nums">
                    {part.num(from)} to {part.num(to)}
                  </span>
                  <span className="text-foreground">
                    {l.layer.toLowerCase()}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-5 font-mono text-xs text-muted-foreground md:text-center">
          figure 1. pin configuration, <span className="md:hidden">dip</span>
          <span className="hidden md:inline">qfp</span>-{part.total}, top view
        </p>
      </figcaption>
    </figure>
  )
}

/** The maker's mark: the flip-bracket K of components/flip-logo.tsx. */
function KMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <g
        fill="none"
        className="stroke-muted-foreground"
        strokeWidth={11}
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <line x1={35.5} y1={28} x2={35.5} y2={72} />
        <polyline points="70.5,28 50.5,50 70.5,72" />
      </g>
    </svg>
  )
}

const fade = "transition-opacity motion-reduce:transition-none"

/* ------------------------------------------------------------------------ */
/* Quad flat pack                                                            */
/* ------------------------------------------------------------------------ */

/** Pitches the quad package may take, largest first: even, so every lead lands on whole pixels. */
const PITCHES = [22, 20, 18, 16, 14]
/** The width laid out before the browser has measured the real one. */
const FIRST_ROOM = 744

/** A label's rough width in em, in Geist: enough to keep it clear of the edge. */
function ems(s: string) {
  let w = 0
  for (const ch of s)
    w += /[il.,:;'|!\s]/.test(ch)
      ? 0.28
      : /[fjrtI]/.test(ch)
        ? 0.36
        : /[mwMW]/.test(ch)
          ? 0.84
          : /[A-Z]/.test(ch)
            ? 0.68
            : 0.56
  return w
}

/**
 * The quad package at one pitch, in CSS pixels. `longest` is the widest
 * label on each side (left, bottom, right, top), in em, so each side keeps
 * only the room its own labels need.
 */
function layout(pitch: number, perSide: number, longest: number[]) {
  const fs = pitch >= 22 ? 12.5 : pitch >= 20 ? 12 : pitch >= 18 ? 11 : 10.5
  const corner = Math.round(pitch * 1.5)
  const body = 2 * corner + perSide * pitch
  const leadW = 2 * Math.floor(pitch / 4)
  const leadL = 2 * Math.round(pitch * 0.45)
  const gap = 6
  const [l, b, r, t] = longest.map(
    (em) => Math.ceil(em * fs * 1.04) + gap + leadL
  )
  return {
    pitch,
    fs,
    corner,
    body,
    leadW,
    leadL,
    gap,
    x: l,
    y: t,
    w: l + body + r,
    h: t + body + b,
    num: pitch >= 20 ? 9 : 8,
  }
}

/** The largest package that fits the room. */
function fit(room: number, perSide: number, longest: number[]) {
  for (const p of PITCHES) {
    const g = layout(p, perSide, longest)
    if (g.w <= room) return g
  }
  return layout(PITCHES[PITCHES.length - 1], perSide, longest)
}

/**
 * Quad flat pack, drawn in SVG at whole CSS pixels so the dither stays crisp
 * (2px dots on the site's 8px tile). Standard numbering, top view: pin 1 is
 * the top pin of the left side, then down the left, along the bottom, up the
 * right and back along the top. Left and right labels run horizontal; top
 * and bottom labels stand on end, reading upward, as on a printed datasheet.
 */
function Qfp({
  part,
  rev,
  hot,
  dim,
  enter,
  className,
}: View & { className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "")

  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) =>
      setRoom(Math.floor(e.contentRect.width))
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const N = part.total / 4
  const longest = [0, 1, 2, 3].map((s) =>
    Math.max(
      ...part.pins.slice(s * N, s * N + N).map((p) => ems(p ? p.name : "nc"))
    )
  )
  const g = fit(room || FIRST_ROOM, N, longest)
  const { x: X, y: Y, body: B, pitch: P, corner: C } = g
  const { leadW, leadL, gap, fs, num } = g
  const groups = [...new Set(part.pins.flatMap((p) => (p ? [p.group] : [])))]
  const fill = (group: number) => {
    const { ink, level } = toneOf(group)
    return level >= 16
      ? { className: ink === "brand" ? "fill-brand" : "fill-teal" }
      : { fill: `url(#${uid}-t${group})` }
  }

  // the centre: maker's mark, part number and sub-labels, stacked
  const mid = X + B / 2
  const kSize = Math.round(B * 0.07)
  const partFs = Math.round(B * 0.08)
  const subFs = B >= 480 ? 12 : 11
  const height = kSize + partFs * 1.07 + 12 + subFs * 2.5
  const top = Y + Math.round(B / 2 - height / 2)
  const partY = top + kSize + partFs * 1.07
  const chamfer = Math.round(C * 0.6)
  const [x0, y0, x1, y1] = [X + 0.5, Y + 0.5, X + B - 0.5, Y + B - 0.5]
  const reach = 16

  // the die, X-rayed: a square of silicon under the markings, with a bond
  // pad on its edge for every pin, in the same order as the pins
  const D = 2 * Math.round((B * 0.4) / 2)
  const [dx, dy] = [X + (B - D) / 2, Y + (B - D) / 2]
  const margin = Math.round(D * 0.06)
  const padAt = (k: number) => margin + (k + 0.5) * ((D - 2 * margin) / N)
  // wires leave the lead frame just inside the pin numbers
  const inset = 22
  const wire = (i: number) => {
    const side = Math.floor(i / N)
    const k = i % N
    const t = C + k * P + P / 2
    const pad = padAt(k)
    const [a, b] = [
      [
        [X + inset, Y + t],
        [dx, dy + pad],
      ],
      [
        [X + t, Y + B - inset],
        [dx + pad, dy + D],
      ],
      [
        [X + B - inset, Y + B - t],
        [dx + D, dy + D - pad],
      ],
      [
        [X + B - t, Y + inset],
        [dx + D - pad, dy],
      ],
    ][side]
    return { d: `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`, end: b, side }
  }

  return (
    <div ref={box} className={className}>
      <svg
        width={g.w}
        height={g.h}
        viewBox={`0 0 ${g.w} ${g.h}`}
        className="mx-auto block h-auto max-w-full overflow-visible"
        aria-hidden="true"
        data-qfp=""
      >
        <defs>
          {groups.map((group) => {
            const { ink, level } = toneOf(group)
            if (level >= 16) return null
            return (
              <pattern
                key={group}
                id={`${uid}-t${group}`}
                width={8}
                height={8}
                patternUnits="userSpaceOnUse"
                shapeRendering="crispEdges"
                className={ink === "brand" ? "fill-brand" : "fill-teal"}
              >
                {BAYER.slice(0, level).map(([x, y]) => (
                  <rect
                    key={`${x}${y}`}
                    x={x * 2}
                    y={y * 2}
                    width={2}
                    height={2}
                  />
                ))}
              </pattern>
            )
          })}
        </defs>

        {/* the body, its pin 1 corner cut at 45 degrees, and the pin 1 dot */}
        <polygon
          points={`${x0 + chamfer},${y0} ${x1},${y0} ${x1},${y1} ${x0},${y1} ${x0},${y0 + chamfer}`}
          className="fill-card stroke-muted-foreground/50"
          strokeWidth={1}
        />
        {/* the die and its seal ring */}
        <rect
          x={dx + 0.5}
          y={dy + 0.5}
          width={D - 1}
          height={D - 1}
          className="fill-background stroke-muted-foreground/40"
          strokeWidth={1}
          shapeRendering="crispEdges"
        />
        <rect
          x={dx + 6.5}
          y={dy + 6.5}
          width={D - 13}
          height={D - 13}
          className="fill-none stroke-muted-foreground/15"
          strokeWidth={1}
          shapeRendering="crispEdges"
        />
        <KMark x={mid - kSize / 2} y={top} width={kSize} height={kSize} />
        <text
          x={mid}
          y={partY}
          textAnchor="middle"
          fontSize={partFs}
          className="fill-foreground font-heading font-medium tracking-tight"
        >
          KS-{part.total}
        </text>
        <text
          textAnchor="middle"
          fontSize={subFs}
          className="fill-muted-foreground font-mono"
        >
          <tspan x={mid} y={partY + 12 + subFs * 1.1}>
            full-stack
          </tspan>
          <tspan x={mid} dy={subFs * 1.4}>
            rev {rev}
          </tspan>
        </text>

        {part.pins.map((pin, i) => {
          const side = Math.floor(i / N) // 0 left, 1 bottom, 2 right, 3 top
          const t = C + (i % N) * P + P / 2
          const across = side === 0 || side === 2
          // where the lead meets the body, and which way is out
          const [cx, cy] = [
            [X, Y + t],
            [X + t, Y + B],
            [X + B, Y + B - t],
            [X + B - t, Y],
          ][side]
          const [nx, ny] = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
          ][side]
          const lead = across
            ? {
                x: nx < 0 ? cx - leadL : cx,
                y: cy - leadW / 2,
                w: leadL,
                h: leadW,
              }
            : {
                x: cx - leadW / 2,
                y: ny < 0 ? cy - leadL : cy,
                w: leadW,
                h: leadL,
              }
          const hit = across
            ? {
                x: nx < 0 ? 0 : X + B - reach,
                y: cy - P / 2,
                width: nx < 0 ? X + reach : g.w - X - B + reach,
                height: P,
              }
            : {
                x: cx - P / 2,
                y: ny < 0 ? 0 : Y + B - reach,
                width: P,
                height: ny < 0 ? Y + reach : g.h - Y - B + reach,
              }
          const tx = cx + nx * (leadL + gap)
          const ty = cy + ny * (leadL + gap)
          return (
            <g
              key={i}
              data-pin={i + 1}
              onMouseEnter={pin ? () => enter(pin.group) : undefined}
              className={cn(
                fade,
                dim(pin?.group) ? "opacity-30" : "opacity-100"
              )}
            >
              <rect {...hit} fill="transparent" />
              {(() => {
                const w = wire(i)
                const lit = pin !== null && hot === pin.group
                const [ex, ey] = w.end
                // the pad sits just inside the die edge
                const [px, py] = [
                  [ex + 1, ey - 1.5],
                  [ex - 1.5, ey - 4],
                  [ex - 4, ey - 1.5],
                  [ex - 1.5, ey + 1],
                ][w.side]
                return (
                  <>
                    <path
                      d={w.d}
                      strokeWidth={1}
                      className={cn(
                        "fill-none transition-[stroke-opacity] motion-reduce:transition-none",
                        pin ? wireInk(pin.group) : "stroke-muted-foreground",
                        lit ? "[stroke-opacity:0.75]" : "[stroke-opacity:0.18]"
                      )}
                    />
                    {pin && (
                      <path
                        d={w.d}
                        pathLength={100}
                        strokeWidth={2}
                        className={cn("qfp-signal fill-none", wireInk(pin.group))}
                        style={clock(i)}
                      />
                    )}
                    <rect
                      x={px}
                      y={py}
                      width={3}
                      height={3}
                      className={
                        lit
                          ? pin && toneOf(pin.group).ink === "teal"
                            ? "fill-teal"
                            : "fill-brand"
                          : "fill-muted-foreground/45"
                      }
                      shapeRendering="crispEdges"
                    />
                  </>
                )
              })()}
              {/* each lead carries its own tile origin, like a CSS mask */}
              <g transform={`translate(${lead.x} ${lead.y})`}>
                <rect
                  data-lead=""
                  width={lead.w}
                  height={lead.h}
                  shapeRendering="crispEdges"
                  {...(pin
                    ? fill(pin.group)
                    : { className: "fill-muted-foreground/25" })}
                />
              </g>
              <text
                x={tx}
                y={ty}
                fontSize={fs}
                dominantBaseline="central"
                textAnchor={side === 0 || side === 1 ? "end" : "start"}
                transform={across ? undefined : `rotate(-90 ${tx} ${ty})`}
                className={cn(
                  "font-sans",
                  pin ? "fill-foreground" : "fill-muted-foreground/50"
                )}
              >
                {pin ? pin.name : "nc"}
              </text>
              <text
                x={side === 0 ? X + 4 : side === 2 ? X + B - 4 : cx}
                y={
                  side === 3
                    ? Y + 4 + num / 2
                    : side === 1
                      ? Y + B - 4 - num / 2
                      : cy
                }
                fontSize={num}
                dominantBaseline="central"
                textAnchor={
                  side === 0 ? "start" : side === 2 ? "end" : "middle"
                }
                className="fill-muted-foreground font-mono tabular-nums"
              >
                {part.num(i + 1)}
              </text>
            </g>
          )
        })}
        <rect
          x={X + C}
          y={Y + C}
          width={6}
          height={6}
          className="fill-brand"
          shapeRendering="crispEdges"
        />
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Dual in-line package                                                      */
/* ------------------------------------------------------------------------ */

/**
 * Dual in-line package, for narrow screens: pins run down the left side and
 * back up the right, the way a real DIP is numbered.
 */
function Dip({
  part,
  rev,
  hot,
  dim,
  enter,
  className,
}: View & { className?: string }) {
  const half = part.total / 2
  const left = part.pins.slice(0, half)
  // the right side counts upward from the bottom
  const right = part.pins.slice(half).reverse()
  const rows = { gridTemplateRows: `repeat(${half}, minmax(0, 1fr))` }
  const op = (g: number | undefined) => (dim(g) ? "opacity-30" : "opacity-100")

  const label = (p: Pin, side: "l" | "r") => (
    <span
      className={cn(
        "truncate font-mono text-[10px] max-[379px]:text-[9px] sm:font-sans sm:text-sm",
        fade,
        side === "l" ? "text-right" : "text-left",
        p ? "text-foreground" : "text-muted-foreground/50",
        op(p?.group)
      )}
    >
      {p ? p.name : "nc"}
    </span>
  )

  const stub = (p: Pin) => {
    const tone = p ? toneStyle(p.group) : null
    return (
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-full",
          fade,
          tone ? tone.className : "bg-muted-foreground/25",
          op(p?.group)
        )}
        style={tone?.style}
      />
    )
  }

  const numbers = (pins: Pin[], side: "l" | "r") => (
    <div
      className={cn(
        "absolute inset-y-0 grid",
        side === "l" ? "left-1 sm:left-2" : "right-1 text-right sm:right-2"
      )}
      style={rows}
    >
      {pins.map((p, r) => (
        <span
          key={r}
          className={cn(
            "flex items-center font-mono text-[8px] text-muted-foreground tabular-nums sm:text-[10px]",
            side === "r" && "justify-end",
            fade,
            op(p?.group)
          )}
        >
          {part.num(side === "l" ? r + 1 : part.total - r)}
        </span>
      ))}
    </div>
  )

  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_0.625rem_5.25rem_0.625rem_1fr] items-center gap-x-1.5 max-[379px]:grid-cols-[1fr_0.5rem_4.25rem_0.5rem_1fr] max-[379px]:gap-x-1 sm:grid-cols-[1fr_1.5rem_10rem_1.5rem_1fr] sm:gap-x-3",
        className
      )}
      style={rows}
    >
      {/* the package */}
      <div
        aria-hidden="true"
        className="relative col-start-3 flex flex-col items-center justify-center self-stretch border border-muted-foreground/50 bg-card"
        style={{ gridRow: `1 / span ${half}` }}
      >
        {/* the die, X-rayed, and a bond wire from every row into it */}
        <span className="absolute inset-y-7 left-1/2 w-[36%] -translate-x-1/2 border border-muted-foreground/40 bg-background sm:inset-y-10" />
        <div className="absolute inset-x-0 inset-y-0 grid" style={rows}>
          {left.map((p, r) => (
            <div key={r} className="grid grid-cols-[1fr_36%_1fr] items-center">
              <DipWire
                pin={p}
                i={r}
                hot={hot}
                dim={dim}
                className="ml-5 sm:ml-7"
              />
              <span />
              <DipWire
                pin={right[r]}
                i={part.total - 1 - r}
                hot={hot}
                dim={dim}
                className="mr-5 -scale-x-100 sm:mr-7"
              />
            </div>
          ))}
        </div>
        {/* pin 1 notch and dot */}
        <span className="absolute -top-px left-1/2 size-3 -translate-x-1/2 border-x border-b border-muted-foreground/50 bg-background sm:size-4" />
        <span className="absolute top-1.5 left-4 size-1.5 bg-brand sm:top-2.5 sm:left-7" />
        {/* the markings, on a knockout of the body so no wire runs through them */}
        <span className="relative flex flex-col items-center bg-card px-1.5 py-2 sm:px-2 sm:py-3">
          <KMark className="mb-1.5 size-5 sm:mb-2 sm:size-7" />
          <span className="font-heading text-base font-medium tracking-tight max-[379px]:text-sm sm:text-3xl">
            KS-{part.total}
          </span>
          <span className="mt-2 hidden font-mono text-xs text-muted-foreground sm:block">
            full-stack
          </span>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            rev {rev}
          </span>
        </span>
        {numbers(left, "l")}
        {numbers(right, "r")}
      </div>

      {left.map((p, r) => (
        <DipRow
          key={`l${r}`}
          row={r}
          n={r + 1}
          side="l"
          onEnter={() => p && enter(p.group)}
        >
          {label(p, "l")}
          {stub(p)}
        </DipRow>
      ))}
      {right.map((p, r) => (
        <DipRow
          key={`r${r}`}
          row={r}
          n={part.total - r}
          side="r"
          onEnter={() => p && enter(p.group)}
        >
          {stub(p)}
          {label(p, "r")}
        </DipRow>
      ))}
    </div>
  )
}

/**
 * A DIP bond wire: a hairline from the lead frame to the die, carrying the
 * same pulse as the quad package, moved by transform. Drawn left to right;
 * the right side is mirrored, so both run inward.
 */
function DipWire({
  pin,
  i,
  hot,
  dim,
  className,
}: {
  pin: Pin
  i: number
  hot: number | null
  dim: (group: number | undefined) => boolean
  className?: string
}) {
  const teal = pin !== null && toneOf(pin.group).ink === "teal"
  const lit = pin !== null && hot === pin.group
  return (
    <span
      className={cn(
        "relative block h-0.5 overflow-hidden",
        fade,
        dim(pin?.group) ? "opacity-30" : "opacity-100",
        className
      )}
    >
      <span
        className={cn(
          "absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-opacity motion-reduce:transition-none",
          pin ? (teal ? "bg-teal" : "bg-brand") : "bg-muted-foreground",
          lit ? "opacity-75" : "opacity-20"
        )}
      />
      {pin && (
        <span
          className={cn(
            "dip-signal absolute inset-0",
            teal ? "text-teal" : "text-brand"
          )}
          style={{
            ...clock(i),
            backgroundImage:
              "linear-gradient(to right, transparent calc(100% - 6px), currentColor calc(100% - 6px))",
          }}
        />
      )}
    </span>
  )
}

/** One DIP pin: its label and lead, on its side of the package, in its row. */
function DipRow({
  row,
  n,
  side,
  onEnter,
  children,
}: {
  row: number
  n: number
  side: "l" | "r"
  onEnter: () => void
  children: React.ReactNode
}) {
  return (
    <div
      data-pin={n}
      onMouseEnter={onEnter}
      className={cn(
        "col-span-2 grid grid-cols-subgrid items-center py-1.5 sm:py-1",
        side === "l" ? "col-start-1" : "col-start-4"
      )}
      style={{ gridRow: row + 1 }}
    >
      {children}
    </div>
  )
}
