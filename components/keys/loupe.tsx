"use client"

import { usePathname } from "next/navigation"
import * as React from "react"
import { createPortal } from "react-dom"

import { loupeTap } from "@/lib/loupe-tap"
import { logVisit } from "@/lib/visit"

/** Magnifying powers, stepped through with the wheel. */
const POWERS = [3, 4, 6, 8, 12]
const START_POWER = 6
/** The lens, in CSS pixels. Square, like everything else. */
const LENS = 200
const HALF = LENS / 2

/** The page's inks, by the variable that defines each. */
const INKS: [string, string][] = [
  ["--foreground", "ink"],
  ["--muted-foreground", "grey ink"],
  ["--brand", "terracotta"],
  ["--teal", "teal"],
  ["--stone", "stone"],
  ["--background", "paper"],
]

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

/** A computed color without its alpha, so text-x/70 still names its ink. */
const solid = (c: string) => c.replace(/\s*\/\s*[\d.]+%?\s*\)$/, ")")

/** Resolve each ink variable to the color string the browser computes. */
function readInks() {
  const probe = document.createElement("span")
  document.body.append(probe)
  const out = INKS.map(([v, name]) => {
    probe.style.color = `var(${v})`
    return [solid(getComputedStyle(probe).color), name] as const
  })
  probe.remove()
  return new Map(out)
}

/** What the loupe is looking at, in a printer's words. */
function describe(el: Element | null, inks: Map<string, string>) {
  if (!el) return ""
  if (el instanceof HTMLCanvasElement) {
    const dot = el.clientWidth / Math.max(1, el.width)
    return `portrait / 1 dot = ${+dot.toFixed(2)}px / webgl`
  }
  const tone = (el.closest(".dither-tone") as HTMLElement | null)?.style
    .getPropertyValue("--tone")
    .match(/dither-(\d+)/)?.[1]
  if (tone) return `dither tone ${tone}/16 / 4x4 bayer`
  const cs = getComputedStyle(el)
  if (cs.maskImage.includes("svg") || cs.webkitMaskImage?.includes("svg"))
    return "dithered plate / 2px cells"
  const hasText = [...el.childNodes].some(
    (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()
  )
  const ink = inks.get(solid(cs.color)) ?? "ink"
  if (hasText) {
    const family = cs.fontFamily.split(",")[0].replace(/["']/g, "")
    return `${family} ${Math.round(parseFloat(cs.fontSize))}px ${cs.fontWeight} / ${ink}`
  }
  if (el instanceof SVGElement) return `vector / ${ink}`
  return `${el.tagName.toLowerCase()} / ${inks.get(solid(cs.backgroundColor)) ?? "paper"}`
}

/** Properties a copy would otherwise lose by leaving its ancestors. */
const INHERITED = [
  "color",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "text-transform",
  "text-align",
  "white-space",
  "font-feature-settings",
  "font-variant-numeric",
]

/** A block's subtree larger than this is not copied whole. */
const MAX_NODES = 400

/** A copy of the block under the pointer, drawn into the lens. */
type Plate = {
  source: HTMLElement
  copy: HTMLElement
  /** the paper it sits on: the nearest background that is not clear */
  paper: string
  canvases: [HTMLCanvasElement, HTMLCanvasElement][]
}

/**
 * The smallest block under the pointer that covers the whole field of view,
 * so the copy only ever holds a paragraph or a card, never the page.
 */
function blockAt(x: number, y: number, field: number): HTMLElement | null {
  const h = field / 2
  const covers = (r: DOMRect) =>
    r.left <= x - h && r.right >= x + h && r.top <= y - h && r.bottom >= y + h
  // canvases ignore the pointer, so find them by their box
  for (const c of document.querySelectorAll("canvas")) {
    if (c.closest(".loupe")) continue
    const r = c.getBoundingClientRect()
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return c
  }
  let el: Element | null | undefined = document
    .elementsFromPoint(x, y)
    .find((n) => !n.closest(".loupe, [role=menu]"))
  while (el && !(el instanceof HTMLElement)) el = el.parentElement
  if (!el) return null
  let block: HTMLElement = el as HTMLElement
  while (
    block.parentElement &&
    block.parentElement !== document.body &&
    !covers(block.getBoundingClientRect()) &&
    block.parentElement.getElementsByTagName("*").length <= MAX_NODES
  )
    block = block.parentElement
  return block
}

/** Copy a block so it lays out exactly as the original does. */
function makePlate(source: HTMLElement): Plate {
  const r = source.getBoundingClientRect()
  const cs = getComputedStyle(source)
  const copy = source.cloneNode(true) as HTMLElement
  for (const prop of INHERITED)
    copy.style.setProperty(prop, cs.getPropertyValue(prop))
  copy.style.cssText += `;position:absolute;left:0;top:0;right:auto;bottom:auto;margin:0;width:${r.width}px;height:${r.height}px;transform-origin:0 0;view-transition-name:none;`
  copy.removeAttribute("id")
  copy.querySelectorAll<HTMLElement>("*").forEach((n) => {
    n.removeAttribute("id")
    n.removeAttribute("data-pending")
    if (n.style?.viewTransitionName) n.style.viewTransitionName = "none"
  })

  let paper = ""
  for (let p: Element | null = source; p && !paper; p = p.parentElement) {
    const bg = getComputedStyle(p).backgroundColor
    if (
      bg &&
      !/^rgba?\(.*,\s*0\)$|transparent/.test(bg) &&
      !/\/\s*0\)$/.test(bg)
    )
      paper = bg
  }

  const from =
    source instanceof HTMLCanvasElement
      ? [source]
      : [...source.querySelectorAll("canvas")]
  const to =
    copy instanceof HTMLCanvasElement
      ? [copy]
      : [...copy.querySelectorAll("canvas")]
  const canvases = from.map((c, i) => {
    to[i].width = c.width
    to[i].height = c.height
    return [c, to[i]] as [HTMLCanvasElement, HTMLCanvasElement]
  })
  return { source, copy, paper: paper || "var(--background)", canvases }
}

/**
 * The printer's loupe. Hold Alt (Option) and the pointer becomes a square
 * magnifier over the live page: the type, the rules and the dither at up to
 * 12x, with a 1px scale along the reticle and a readout of what is under it
 * (the face and size of the type, its ink, a tone's level out of 16, the
 * portrait's dot size). Scroll while holding it to change the power; press
 * l to leave it down. It shows what the site is made of: every grey is a
 * pattern of square dots, and the portrait is one dot per canvas pixel.
 */
export function Loupe() {
  const pathname = usePathname()
  const [on, setOn] = React.useState(false)
  const [sticky, setSticky] = React.useState(false)
  const [power, setPower] = React.useState(START_POWER)
  const pointer = React.useRef({ x: -999, y: -999, seen: false })
  const lens = React.useRef<HTMLDivElement>(null)
  const stage = React.useRef<HTMLDivElement>(null)
  const readout = React.useRef<HTMLParagraphElement>(null)
  const coords = React.useRef<HTMLSpanElement>(null)
  const inks = React.useRef<Map<string, string>>(new Map())
  const frame = React.useRef(0)
  const powerRef = React.useRef(power)
  React.useEffect(() => {
    powerRef.current = power
  }, [power])

  const active = on || sticky

  // a new page puts it away
  const [page, setPage] = React.useState(pathname)
  if (page !== pathname) {
    setPage(pathname)
    setOn(false)
    setSticky(false)
  }

  // where the pointer is, always (cheap: two numbers)
  React.useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return
      pointer.current = { x: e.clientX, y: e.clientY, seen: true }
    }
    window.addEventListener("pointermove", move, { passive: true })
    return () => window.removeEventListener("pointermove", move)
  }, [])

  // hold Alt to look, l to leave it down, Esc to put it away
  React.useEffect(() => {
    const fine = () => window.matchMedia("(hover: hover)").matches
    const down = (e: KeyboardEvent) => {
      if (e.key === "Alt" && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        if (!fine() || !pointer.current.seen) return
        // stops Windows browsers focusing their menu bar on release
        e.preventDefault()
        setOn(true)
        return
      }
      if (e.key === "Escape") {
        setSticky(false)
        setOn(false)
        return
      }
      if (
        e.key.toLowerCase() === "l" &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !typing(e) &&
        fine()
      )
        setSticky((v) => !v)
    }
    const up = (e: KeyboardEvent) => e.key === "Alt" && setOn(false)
    const off = () => setOn(false)
    // the mark-up slip can leave it down too
    const fromMenu = (e: Event) =>
      (e as CustomEvent<string>).detail === "loupe" && setSticky((v) => !v)
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    window.addEventListener("blur", off)
    window.addEventListener("ks:command", fromMenu)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
      window.removeEventListener("blur", off)
      window.removeEventListener("ks:command", fromMenu)
    }
  }, [])

  // while it is down: follow the pointer, copy the block under it into
  // the lens, and read the spot (before paint, so the lens never shows at
  // the corner for a frame)
  React.useLayoutEffect(() => {
    if (!active || !stage.current || !lens.current) return
    const host = stage.current
    const glass = lens.current
    inks.current = readInks()
    logVisit("loupe")
    let plate: Plate | null = null

    // the portrait (and any canvas) arrives frame by frame
    const offTap = loupeTap.listen((source) => {
      for (const [from, to] of plate?.canvases ?? [])
        if (from === source) {
          if (to.width !== from.width) to.width = from.width
          if (to.height !== from.height) to.height = from.height
          to.getContext("2d")?.drawImage(from, 0, 0)
        }
    })

    let seen = ""
    const draw = () => {
      frame.current = requestAnimationFrame(draw)
      const { x, y } = pointer.current
      const z = powerRef.current
      // nothing moved: nothing to do
      const key = `${x},${y},${z},${window.scrollX},${window.scrollY}`
      if (key === seen) return
      seen = key

      glass.style.transform = `translate(${x - HALF}px, ${y - HALF}px)`
      const block = blockAt(x, y, LENS / z)
      if (block !== plate?.source) {
        plate = block ? makePlate(block) : null
        host.replaceChildren(...(plate ? [plate.copy] : []))
        host.style.background = plate?.paper ?? "var(--background)"
      }
      if (plate) {
        const r = plate.source.getBoundingClientRect()
        plate.copy.style.transform = `translate(${(r.left - x) * z + HALF}px, ${(r.top - y) * z + HALF}px) scale(${z})`
      }

      const el = document
        .elementsFromPoint(x, y)
        .find((n) => !n.closest(".loupe, [role=menu]"))
      const text = describe(
        block instanceof HTMLCanvasElement ? block : (el ?? null),
        inks.current
      )
      if (readout.current) readout.current.textContent = text
      if (coords.current)
        coords.current.textContent = `${z}x / x ${String(Math.round(x + window.scrollX)).padStart(4, "0")} y ${String(Math.round(y + window.scrollY)).padStart(4, "0")}`
    }
    draw()

    // the wheel changes the power instead of scrolling while it is down
    const wheel = (e: WheelEvent) => {
      if (!e.altKey) return
      e.preventDefault()
      setPower((p) => {
        const i = POWERS.indexOf(p)
        return POWERS[
          Math.max(0, Math.min(POWERS.length - 1, i + (e.deltaY < 0 ? 1 : -1)))
        ]
      })
    }
    window.addEventListener("wheel", wheel, { passive: false })

    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener("wheel", wheel)
      offTap()
      host.replaceChildren()
    }
  }, [active])

  if (!active) return null

  return createPortal(
    <div
      ref={lens}
      aria-hidden="true"
      className="loupe pointer-events-none fixed top-0 left-0 z-[90] fade-in"
      style={{
        width: LENS,
      }}
    >
      <div
        className="relative overflow-hidden border border-foreground/70 bg-background shadow-2xl"
        style={{ width: LENS, height: LENS, contain: "strict" }}
      >
        <div ref={stage} inert className="loupe-stage absolute inset-0" />
        <Reticle power={power} />
      </div>
      <div className="mt-1.5 border border-border bg-card px-2 py-1 font-mono text-[10px] leading-relaxed text-muted-foreground">
        <span ref={coords} className="block text-brand tabular-nums" />
        <p ref={readout} className="truncate text-foreground" />
        <span className="block text-muted-foreground/70">
          {sticky
            ? "l or esc to lift / alt + scroll for power"
            : "scroll to change power"}
        </span>
      </div>
    </div>,
    document.body
  )
}

/** The crosshair and a scale of 1px steps, etched on the glass. */
function Reticle({ power }: { power: number }) {
  // one tick per CSS pixel of the page, a long one every five
  const ticks = Math.floor(LENS / power / 2)
  return (
    <svg
      className="pointer-events-none absolute inset-0 text-brand"
      width={LENS}
      height={LENS}
      viewBox={`0 0 ${LENS} ${LENS}`}
    >
      <g stroke="currentColor" strokeWidth={1} shapeRendering="crispEdges">
        <line x1={HALF - 14} y1={HALF + 0.5} x2={HALF - 4} y2={HALF + 0.5} />
        <line x1={HALF + 4} y1={HALF + 0.5} x2={HALF + 14} y2={HALF + 0.5} />
        <line x1={HALF + 0.5} y1={HALF - 14} x2={HALF + 0.5} y2={HALF - 4} />
        <line x1={HALF + 0.5} y1={HALF + 4} x2={HALF + 0.5} y2={HALF + 14} />
        {Array.from({ length: ticks * 2 + 1 }, (_, i) => {
          const k = i - ticks
          const x = Math.round(HALF + k * power) + 0.5
          const long = k % 5 === 0
          return (
            <line
              key={k}
              x1={x}
              x2={x}
              y1={LENS - 1}
              y2={LENS - (long ? 9 : 5)}
            />
          )
        })}
      </g>
      <text
        x={LENS - 6}
        y={LENS - 12}
        textAnchor="end"
        fill="currentColor"
        style={{ font: "9px var(--font-mono), monospace" }}
      >
        1 tick = 1px
      </text>
    </svg>
  )
}
