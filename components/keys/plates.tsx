"use client"

import { usePathname } from "next/navigation"
import * as React from "react"
import { createPortal } from "react-dom"

import { loupeTap } from "@/lib/loupe-tap"
import { cn } from "@/lib/utils"
import { logVisit } from "@/lib/visit"

type PlateId = "paper" | "rules" | "teal" | "terracotta" | "ink"

/** The plates, bottom of the stack first, and the variables each one prints. */
const PLATES: { id: PlateId; swatch: string; vars: string[] }[] = [
  {
    id: "paper",
    swatch: "var(--stone)",
    vars: [
      "--background",
      "--card",
      "--popover",
      "--secondary",
      "--muted",
      "--accent",
      "--primary-foreground",
      "--brand-foreground",
      "--sidebar",
      "--sidebar-accent",
      "--sidebar-primary-foreground",
      "--chart-4",
      "--chart-5",
    ],
  },
  {
    id: "rules",
    swatch: "var(--rule)",
    vars: ["--border", "--input", "--rule", "--sidebar-border"],
  },
  {
    id: "teal",
    swatch: "var(--teal)",
    vars: ["--teal", "--stock-teal", "--chart-2"],
  },
  {
    id: "terracotta",
    swatch: "var(--brand)",
    vars: [
      "--brand",
      "--brand-muted",
      "--ring",
      "--mark",
      "--stock-terracotta",
      "--chart-1",
      "--destructive",
      "--sidebar-primary",
      "--sidebar-ring",
    ],
  },
  {
    id: "ink",
    swatch: "var(--foreground)",
    vars: [
      "--foreground",
      "--card-foreground",
      "--popover-foreground",
      "--primary",
      "--secondary-foreground",
      "--muted-foreground",
      "--accent-foreground",
      "--stone",
      "--stock-bone",
      "--stock-stone",
      // the near-blacks printed on the card stocks
      "--ink-terracotta",
      "--ink-teal",
      "--ink-bone",
      "--ink-stone",
      "--chart-3",
      "--sidebar-foreground",
      "--sidebar-accent-foreground",
    ],
  },
]

/**
 * On a plate, every other plate's variables print nothing. Pulled apart,
 * the rules are shown at full strength: on the page they are faint tints.
 */
const filmFor = (id: PlateId, apart: boolean) =>
  ({
    ...Object.fromEntries(
      PLATES.filter((p) => p.id !== id).flatMap((p) =>
        p.vars.map((v) => [v, "transparent"])
      )
    ),
    ...(id === "rules" && apart
      ? Object.fromEntries(
          ["--border", "--input", "--rule", "--sidebar-border"].map((v) => [
            v,
            "oklch(0.85 0.03 70 / 55%)",
          ])
        )
      : {}),
  }) as React.CSSProperties

/** The view the stack is shown from, and how far apart the plates sit. */
const TILT = 56
const TURN = -34
const MOTION = 900

type Rgba = [number, number, number, number]

/** Any CSS color as rgba, through a one-pixel canvas (it parses oklch too). */
function colorReader() {
  const c = document.createElement("canvas")
  c.width = c.height = 1
  const ctx = c.getContext("2d", { willReadFrequently: true })!
  const cache = new Map<string, Rgba>()
  return (css: string): Rgba => {
    const hit = cache.get(css)
    if (hit) return hit
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = "#000"
    ctx.fillStyle = css
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    const out: Rgba = [d[0], d[1], d[2], d[3] / 255]
    cache.set(css, out)
    return out
  }
}

/** Every ink on the page, resolved, with the plate it belongs to. */
function readPalette(rgba: (css: string) => Rgba) {
  const probe = document.createElement("span")
  document.body.append(probe)
  const out: { c: Rgba; plate: PlateId }[] = []
  for (const p of PLATES)
    for (const v of p.vars) {
      // the stock inks are near the page's own paper: matched by variable only
      if (v.startsWith("--ink-")) continue
      probe.style.color = `var(${v})`
      const c = rgba(getComputedStyle(probe).color)
      if (c[3] > 0.02) out.push({ c, plate: p.id })
    }
  probe.remove()
  return out
}

/** The plate a color prints on: the nearest ink, alpha counted lightly. */
function nearest(palette: { c: Rgba; plate: PlateId }[], c: Rgba) {
  let best: PlateId = "ink"
  let min = Infinity
  for (const e of palette) {
    const d =
      (e.c[0] - c[0]) ** 2 +
      (e.c[1] - c[1]) ** 2 +
      (e.c[2] - c[2]) ** 2 +
      ((e.c[3] - c[3]) * 120) ** 2
    if (d < min) {
      min = d
      best = e.plate
    }
  }
  return best
}

const SIDES = ["top", "right", "bottom", "left"] as const
const SHAPES = new Set([
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "text",
])

/**
 * What one element prints, and on which plate: each color property it
 * shows, classified by its nearest ink. Theme colors are already separated
 * by their variables; this catches the hard-coded ones too.
 */
type Inks = { prop: string; plate: PlateId }[]

function separate(
  el: Element,
  rgba: (css: string) => Rgba,
  palette: { c: Rgba; plate: PlateId }[]
): { inks: Inks; marks: Set<PlateId> } {
  const cs = getComputedStyle(el)
  const inks: Inks = []
  const marks = new Set<PlateId>()
  const seen = el.getClientRects().length > 0 && cs.visibility !== "hidden"
  const add = (prop: string, value: string, counts: boolean, rule = false) => {
    if (!value || value === "none") return
    const c = rgba(value)
    if (c[3] < 0.02) return
    let plate = nearest(palette, c)
    // a line drawn in ink is a rule
    if (rule && plate === "ink") plate = "rules"
    inks.push({ prop, plate })
    if (counts && seen) marks.add(plate)
  }

  if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) {
    if (seen) marks.add("ink")
    return { inks: [{ prop: "visibility", plate: "ink" }], marks }
  }
  const svg = el instanceof SVGElement
  const text = [...el.childNodes].some(
    (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()
  )
  add("color", cs.color, text)
  add("background-color", cs.backgroundColor, true)
  for (const s of SIDES)
    if (
      parseFloat(cs.getPropertyValue(`border-${s}-width`)) > 0 &&
      cs.getPropertyValue(`border-${s}-style`) !== "none"
    )
      add(
        `border-${s}-color`,
        cs.getPropertyValue(`border-${s}-color`),
        true,
        true
      )
  if (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0)
    add("outline-color", cs.outlineColor, true, true)
  if (cs.textDecorationLine !== "none")
    add("text-decoration-color", cs.textDecorationColor, text, true)
  if (svg) {
    const shape = SHAPES.has(el.tagName)
    add("fill", cs.fill, shape)
    add("stroke", cs.stroke, shape && cs.strokeWidth !== "0px")
  }
  return { inks, marks }
}

/** A canvas's frame, split by ink onto each plate's copy of it. */
function splitCanvas(
  from: HTMLCanvasElement,
  to: Map<PlateId, HTMLCanvasElement>,
  scratch: CanvasRenderingContext2D,
  plateOf: (r: number, g: number, b: number) => PlateId
) {
  const { width: w, height: h } = from
  if (!w || !h) return
  if (scratch.canvas.width !== w) scratch.canvas.width = w
  if (scratch.canvas.height !== h) scratch.canvas.height = h
  scratch.clearRect(0, 0, w, h)
  scratch.drawImage(from, 0, 0)
  const src = scratch.getImageData(0, 0, w, h).data
  for (const [id, cnv] of to) {
    if (cnv.width !== w) cnv.width = w
    if (cnv.height !== h) cnv.height = h
    const ctx = cnv.getContext("2d")
    if (!ctx) continue
    const out = ctx.createImageData(w, h)
    const d = out.data
    for (let i = 0; i < src.length; i += 4) {
      if (src[i + 3] === 0) continue
      if (plateOf(src[i], src[i + 1], src[i + 2]) !== id) continue
      d[i] = src[i]
      d[i + 1] = src[i + 1]
      d[i + 2] = src[i + 2]
      d[i + 3] = src[i + 3]
    }
    ctx.putImageData(out, 0, 0)
  }
}

/** True while the user is typing, so single-key shortcuts stay out of the way. */
const typing = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null
  return (
    !!t &&
    (t.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) ||
      t.getAttribute("role") === "slider")
  )
}

/** The stack's size on screen, so it fits the window whatever its shape. */
function fit(w: number, h: number, gap: number, room: number) {
  const a = (TILT * Math.PI) / 180
  const b = (Math.abs(TURN) * Math.PI) / 180
  const across = w * Math.cos(b) + h * Math.sin(b)
  const down =
    (w * Math.sin(b) + h * Math.cos(b)) * Math.cos(a) +
    gap * (PLATES.length - 1) * Math.sin(a)
  return Math.min((window.innerWidth * 0.9) / across, (room * 0.86) / down)
}

type Box = { w: number; h: number; gap: number; scale: number }

/** The window, measured as the plates are pulled. */
function measure(): Box {
  const w = document.documentElement.clientWidth
  const h = window.innerHeight
  const gap = Math.round(Math.min(220, h * 0.22))
  const room = h - (w < 640 ? 150 : 96)
  return { w, h, gap, scale: fit(w, h, gap, room) }
}

/**
 * Plate separation. Press x and the page comes apart into the plates it is
 * printed from, the way a printer checks a job: paper, rules, teal,
 * terracotta and ink, each a copy of the live page carrying only its own
 * ink (the portrait is split pixel by pixel). Toggle plates with 1-5, drag
 * to turn the stack, scroll to move the sheet, and space or x to put it
 * back in register.
 */
export function Plates() {
  const pathname = usePathname()
  const [box, setBox] = React.useState<Box | null>(null)
  const open = box !== null
  const [apart, setApart] = React.useState(false)
  const [off, setOff] = React.useState<PlateId[]>([])
  const [solo, setSolo] = React.useState<PlateId | null>(null)
  const [marks, setMarks] = React.useState<Record<string, number>>({})
  const [view, setView] = React.useState({ tilt: TILT, turn: TURN })
  const [dragging, setDragging] = React.useState(false)
  const sheets = React.useRef(new Map<PlateId, HTMLDivElement>())
  const closing = React.useRef(0)

  // a new page puts it away
  const [page, setPage] = React.useState(pathname)
  if (page !== pathname) {
    setPage(pathname)
    setBox(null)
    setApart(false)
  }

  const close = React.useCallback(() => {
    if (closing.current) return
    setApart(false)
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    closing.current = window.setTimeout(
      () => {
        closing.current = 0
        // the page lands where the sheet was scrolled to
        const top = sheets.current.get("paper")?.scrollTop
        if (top !== undefined)
          window.scrollTo({ top, behavior: "instant" as ScrollBehavior })
        setBox(null)
        setOff([])
        setSolo(null)
        setView({ tilt: TILT, turn: TURN })
      },
      still ? 0 : MOTION
    )
  }, [])

  // in register and out again, without putting the plates away
  const toggle = React.useCallback(() => setApart((a) => !a), [])

  // x, or the mark-up slip and the job ticket
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e)) return
      if (e.key === "x" || e.key === "X") {
        e.preventDefault()
        if (open) close()
        else setBox(measure())
        return
      }
      if (!open) return
      if (e.key === "Escape") return close()
      if (e.key === " ") {
        e.preventDefault()
        return toggle()
      }
      const n = Number(e.key)
      if (n >= 1 && n <= PLATES.length) {
        const id = PLATES[n - 1].id
        setOff((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]))
        return
      }
      // the page underneath stays put
      if (
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(
          e.key
        )
      )
        e.preventDefault()
    }
    const onCommand = (e: Event) =>
      (e as CustomEvent<string>).detail === "plates" &&
      (open ? close() : setBox(measure()))
    window.addEventListener("keydown", onKey)
    window.addEventListener("ks:command", onCommand)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("ks:command", onCommand)
    }
  }, [open, close, toggle])

  React.useEffect(() => () => window.clearTimeout(closing.current), [])

  // pull the plates: copy the page once per plate, each with only its ink
  React.useLayoutEffect(() => {
    if (!open) return
    const { w } = box
    const y = window.scrollY
    logVisit("plates")

    const rgba = colorReader()
    const palette = readPalette(rgba)
    const sources = [...document.body.children].filter(
      (el) =>
        ["HEADER", "MAIN", "FOOTER"].includes(el.tagName) ||
        el.classList.contains("rails")
    )
    const live = sources.flatMap((s) => [s, ...s.querySelectorAll("*")])
    const read = live.map((el) => separate(el, rgba, palette))
    const count: Record<string, number> = {}
    for (const r of read)
      for (const m of r.marks) count[m] = (count[m] ?? 0) + 1

    const liveCanvases = live.filter(
      (el): el is HTMLCanvasElement => el instanceof HTMLCanvasElement
    )
    const copies = liveCanvases.map(() => new Map<PlateId, HTMLCanvasElement>())

    for (const plate of PLATES) {
      const sheet = sheets.current.get(plate.id)
      if (!sheet) continue
      const paper = document.createElement("div")
      paper.className = "plate-paper bg-background text-foreground"
      paper.style.width = `${w}px`
      const clones = sources.map((s) => s.cloneNode(true) as Element)
      paper.append(...clones)
      const copy = clones.flatMap((c) => [c, ...c.querySelectorAll("*")])
      copy.forEach((el, i) => {
        el.removeAttribute("id")
        el.removeAttribute("data-nav-item")
        const style = (el as HTMLElement).style
        if (!style) return
        for (const ink of read[i]?.inks ?? []) {
          if (ink.plate === plate.id) continue
          if (ink.prop === "visibility") style.setProperty(ink.prop, "hidden")
          else style.setProperty(ink.prop, "transparent", "important")
        }
      })
      copy
        .filter(
          (el): el is HTMLCanvasElement => el instanceof HTMLCanvasElement
        )
        .forEach((c, i) => copies[i]?.set(plate.id, c))
      sheet.replaceChildren(paper)
      sheet.scrollTop = y
    }

    // the portrait, split pixel by pixel as it draws
    const scratch = document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: true })!
    const memo = new Map<number, PlateId>()
    const plateOf = (r: number, g: number, b: number) => {
      const k = (r << 16) | (g << 8) | b
      let p = memo.get(k)
      if (!p) memo.set(k, (p = nearest(palette, [r, g, b, 1])))
      return p
    }
    let last = 0
    const offTap = loupeTap.listen((source) => {
      const i = liveCanvases.indexOf(source)
      const now = performance.now()
      if (i < 0 || now - last < 60) return
      last = now
      splitCanvas(source, copies[i], scratch, plateOf)
    })
    liveCanvases.forEach((c, i) => {
      try {
        splitCanvas(c, copies[i], scratch, plateOf)
      } catch {}
    })

    // then fan them out, once the copies are on screen in register
    let raf = requestAnimationFrame(() => {
      setMarks(count)
      raf = requestAnimationFrame(() => setApart(true))
    })
    const stash = sheets.current
    return () => {
      cancelAnimationFrame(raf)
      offTap()
      stash.forEach((s) => s.replaceChildren())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per pull
  }, [open])

  // scroll moves every sheet together; the page underneath stays put
  const stage = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const el = stage.current
    if (!open || !el) return
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      sheets.current.forEach((s) => (s.scrollTop += e.deltaY))
    }
    el.addEventListener("wheel", wheel, { passive: false })
    return () => el.removeEventListener("wheel", wheel)
  }, [open])

  // drag to turn the stack
  const drag = React.useRef<{
    x: number
    y: number
    tilt: number
    turn: number
  } | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (!apart || (e.target as HTMLElement).closest("button")) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, ...view }
    setDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    setView({
      turn: Math.max(-80, Math.min(80, d.turn + (e.clientX - d.x) * 0.25)),
      tilt: Math.max(0, Math.min(75, d.tilt - (e.clientY - d.y) * 0.2)),
    })
  }
  const onPointerUp = () => {
    drag.current = null
    setDragging(false)
  }

  if (!box) return null

  const stack = apart
    ? `translateY(${box.w < 640 ? -40 : -24}px) scale(${box.scale}) rotateX(${view.tilt}deg) rotateZ(${view.turn}deg)`
    : "none"

  return createPortal(
    <div
      ref={stage}
      role="dialog"
      aria-modal="true"
      aria-label="Plate separation"
      className={cn(
        "plates fixed inset-0 z-[75] touch-none overflow-hidden bg-background select-none",
        apart && (dragging ? "cursor-grabbing" : "cursor-grab")
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        aria-hidden="true"
        inert
        className={cn(
          "plates-stack absolute top-0 left-0",
          dragging && "dragging"
        )}
        style={{ width: box.w, height: box.h, transform: stack }}
      >
        {PLATES.map((p, i) => {
          const hidden = off.includes(p.id) || (solo !== null && solo !== p.id)
          return (
            <div
              key={p.id}
              className="plate absolute inset-0"
              style={{
                transform: `translateZ(${apart ? (i - (PLATES.length - 1) / 2) * box.gap : 0}px)`,
                opacity: hidden ? (solo ? 0.08 : 0) : 1,
              }}
            >
              <div
                ref={(el) => {
                  if (el) sheets.current.set(p.id, el)
                }}
                className="absolute inset-0 overflow-hidden"
                style={filmFor(p.id, apart)}
              />
              <div
                className={cn(
                  "plate-film pointer-events-none absolute inset-0 border border-dashed transition-opacity duration-500",
                  p.id !== "paper" && "bg-foreground/[0.025]",
                  apart ? "opacity-100" : "opacity-0"
                )}
                style={{ borderColor: p.swatch }}
              />
              <p
                className={cn(
                  "absolute bottom-full left-0 mb-3 font-mono text-[28px] whitespace-nowrap transition-opacity duration-500",
                  apart ? "opacity-100" : "opacity-0"
                )}
                style={{ color: p.id === "paper" ? "var(--stone)" : p.swatch }}
              >
                {String(i + 1).padStart(2, "0")} {p.id}
                <span className="text-muted-foreground">
                  {" "}
                  / {(marks[p.id] ?? 0).toLocaleString("en")} marks
                </span>
              </p>
            </div>
          )
        })}
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 border-t border-dashed border-border bg-background/90 font-mono text-xs text-muted-foreground transition-opacity duration-500",
          apart ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="frame flex flex-wrap items-center gap-x-5 gap-y-2 py-3">
          <span>
            <span className="text-brand">{"// "}</span>plate separation
          </span>
          <span className="flex flex-wrap gap-1.5">
            {PLATES.map((p, i) => {
              const on = !off.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    setOff((o) =>
                      on ? [...o, p.id] : o.filter((x) => x !== p.id)
                    )
                  }
                  onPointerEnter={() => setSolo(p.id)}
                  onPointerLeave={() => setSolo(null)}
                  onFocus={() => setSolo(p.id)}
                  onBlur={() => setSolo(null)}
                  className={cn(
                    "inline-flex items-center gap-2 border border-border px-2 py-1 transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    on ? "text-foreground" : "line-through opacity-50"
                  )}
                >
                  <span className="text-muted-foreground">{i + 1}</span>
                  <span
                    aria-hidden="true"
                    className="size-2.5 border border-border"
                    style={{ background: on ? p.swatch : "transparent" }}
                  />
                  {p.id}
                </button>
              )
            })}
          </span>
          <span className="hidden lg:inline">
            drag to turn / scroll to read / space to register
          </span>
          <button
            type="button"
            onClick={close}
            className="ml-auto border border-border px-2 py-1 transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            close (x)
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
