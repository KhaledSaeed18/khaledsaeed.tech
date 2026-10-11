"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** A month on the tape, resolved on the server. */
export type TapeCell = {
  /** ISO month, "2024-09". */
  iso: string
  /** "sep" */
  month: string
  /** "'24", printed on the first cell and every january. */
  year?: string
  /** Dither level of the chapter this month belongs to. */
  tone: number
  /** The role held that month. */
  title: string
  /** "sep 2024", read out and printed under the head. */
  date: string
}

/** Width of one month on the tape, in CSS pixels. */
const CELL = 64
/** Months fed per second while the tape plays. */
const FEED = 1.4
/** How much faster the tape rewinds than it feeds. */
const REWIND = 4
/** Pause at either end of the tape, in milliseconds. */
const DWELL = 2200
/** Blank punched leader before the first month and after the last. */
const LEAD = 8

const tone = (level: number) =>
  ({ "--tone": `var(--dither-${level})` }) as React.CSSProperties

/**
 * The run as a length of punched paper tape, one cell a month, fed under a
 * read head. Left alone on screen it feeds forward to this month, waits,
 * rewinds, and goes again; hovering or focusing holds it. The tape can be
 * dragged by hand and stepped with the arrow keys. Under reduced motion it
 * sits on the current month and only moves by hand.
 */
export function RunTape({ cells }: { cells: TapeCell[] }) {
  const n = cells.length
  const last = n - 1
  // the month under the head; the tape's exact position lives in posRef and
  // is written straight to the strip, so a frame of feed does not re-render
  const [at, setAt] = React.useState(0)
  const [held, setHeld] = React.useState(false)
  const [onScreen, setOnScreen] = React.useState(false)
  const [reduced, setReduced] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const stripRef = React.useRef<HTMLDivElement>(null)
  const posRef = React.useRef(0)
  const dir = React.useRef<1 | -1>(1)
  const drag = React.useRef<{ x: number; pos: number } | null>(null)

  const go = (p: number) => {
    const next = Math.min(last, Math.max(0, p))
    posRef.current = next
    if (stripRef.current)
      stripRef.current.style.transform = `translateX(${-next * CELL}px)`
    setAt(Math.round(next))
  }

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      setReduced(mq.matches)
      if (mq.matches) go(last)
    }
    sync()
    mq.addEventListener("change", sync)
    const el = rootRef.current
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { threshold: 0.4 }
    )
    if (el) io.observe(el)
    return () => {
      mq.removeEventListener("change", sync)
      io.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [last])

  const running = onScreen && !held && !reduced && n > 1
  React.useEffect(() => {
    if (!running) return
    let frame = 0
    let dwellUntil = 0
    let then = performance.now()
    const tick = (now: number) => {
      const dt = (now - then) / 1000
      then = now
      if (now >= dwellUntil) {
        const speed = FEED * (dir.current === 1 ? 1 : REWIND)
        const next = posRef.current + dir.current * speed * dt
        if (next >= last || next <= 0) {
          go(next >= last ? last : 0)
          dir.current = dir.current === 1 ? -1 : 1
          dwellUntil = now + DWELL
        } else {
          go(next)
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, last])

  const cell = cells[at]

  const onKey = (e: React.KeyboardEvent) => {
    const step: Record<string, number> = {
      ArrowRight: at + 1,
      ArrowLeft: at - 1,
      Home: 0,
      End: last,
    }
    if (e.key in step) {
      e.preventDefault()
      go(step[e.key])
    }
  }

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      {/* the read head's label */}
      <p
        aria-live="off"
        className="flex items-baseline justify-between gap-4 font-mono text-xs text-muted-foreground"
      >
        <span className="shrink-0 whitespace-nowrap">
          <span className="text-brand tabular-nums">
            month {String(at + 1).padStart(2, "0")}
          </span>
          <span className="mx-2 opacity-50">/</span>
          <span className="tabular-nums">{String(n).padStart(2, "0")}</span>
        </span>
        <span className="min-w-0 truncate text-foreground">{cell.title}</span>
      </p>

      {/* the tape */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Months of work, oldest to newest"
        aria-valuemin={1}
        aria-valuemax={n}
        aria-valuenow={at + 1}
        aria-valuetext={`${cell.date}, ${cell.title}`}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, pos: posRef.current }
          e.currentTarget.setPointerCapture(e.pointerId)
          setHeld(true)
        }}
        onPointerMove={(e) => {
          if (!drag.current) return
          go(drag.current.pos - (e.clientX - drag.current.x) / CELL)
        }}
        onPointerUp={(e) => {
          drag.current = null
          e.currentTarget.releasePointerCapture(e.pointerId)
          go(Math.round(posRef.current))
        }}
        onPointerCancel={() => {
          drag.current = null
          go(Math.round(posRef.current))
        }}
        className="tape relative mt-4 cursor-grab touch-pan-y overflow-hidden py-3 select-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none active:cursor-grabbing"
      >
        <div
          ref={stripRef}
          aria-hidden="true"
          className="relative flex will-change-transform"
          style={{
            width: (n + 2 * LEAD) * CELL,
            marginLeft: `calc(50% - ${CELL * (LEAD + 0.5)}px)`,
          }}
        >
          <Leader />
          {cells.map((c, i) => (
            <div
              key={c.iso}
              className={cn(
                "relative flex shrink-0 flex-col items-center border-y border-border bg-background text-foreground transition-colors",
                i === at && "text-brand"
              )}
              style={{ width: CELL }}
            >
              <Sprockets />
              <span
                className="dither-tone mt-2 h-9 w-10"
                style={tone(c.tone)}
              />
              <span className="mt-2 h-4 font-mono text-xs text-muted-foreground tabular-nums">
                {c.year ?? c.month}
              </span>
              <Sprockets />
            </div>
          ))}
          <Leader />
        </div>

        {/* the read head: a window over the cell under it */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 border-x-2 border-foreground"
          style={{ width: CELL + 8 }}
        >
          <span className="absolute -top-px left-0 size-2 bg-brand" />
          <span className="absolute -top-px right-0 size-2 bg-brand" />
          <span className="absolute -bottom-px left-0 size-2 bg-brand" />
          <span className="absolute right-0 -bottom-px size-2 bg-brand" />
        </div>
      </div>

      <p className="mt-4 flex items-baseline justify-between gap-4 font-mono text-xs text-muted-foreground">
        <span className="text-foreground">{cell.date}</span>
        <span className="hidden sm:inline">
          {reduced ? "drag the tape or use the arrow keys" : "drag to scrub"}
        </span>
      </p>
    </div>
  )
}

/** Blank tape at either end: feed holes and nothing printed. */
function Leader() {
  return (
    <>
      {Array.from({ length: LEAD }, (_, i) => (
        <div
          key={i}
          className="flex shrink-0 flex-col items-center justify-between border-y border-border opacity-40"
          style={{ width: CELL }}
        >
          <Sprockets />
          <Sprockets />
        </div>
      ))}
    </>
  )
}

/** A row of punched feed holes, two to a cell. */
function Sprockets() {
  return (
    <span className="flex w-full justify-around py-1.5">
      <span className="size-1.5 border border-muted-foreground/50" />
      <span className="size-1.5 border border-muted-foreground/50" />
    </span>
  )
}
