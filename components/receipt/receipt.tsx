"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { CopyGlyph, SaveGlyph } from "@/components/print/glyphs"
import { code128 } from "@/lib/code128"
import { cn } from "@/lib/utils"
import {
  duration,
  paper,
  readHistory,
  readVisit,
  saveHistory,
  type History,
  type Visit,
} from "@/lib/visit"

/** Characters across a 58mm thermal roll. */
const WIDTH = 32
const SITE = "khaledsaeed.tech"
/** Quiet zone either side of the barcode, in modules. */
const QUIET = 10

type Line =
  | { kind: "row"; left: string; right?: string; bold?: boolean }
  | { kind: "center"; text: string; big?: boolean }
  | { kind: "rule"; double?: boolean }
  | { kind: "gap" }
  | { kind: "barcode" }

const pad = (n: number, w = 2) => String(n).padStart(w, "0")
const date = (t: number) =>
  new Date(t)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toLowerCase()

const row = (left: string, right?: string, bold?: boolean): Line => ({
  kind: "row",
  left,
  right,
  bold,
})
const center = (text: string, big?: boolean): Line => ({
  kind: "center",
  text,
  big,
})
const rule = (double?: boolean): Line => ({ kind: "rule", double })

/** The receipt, line by line: one model for the paper, the image and the text. */
function compose(
  v: Visit,
  h: History,
  edition: string,
  receipt: number
): Line[] {
  const now = Date.now()
  const total = v.pages.reduce((n, p) => n + p.ms, 0)
  const longest = Object.entries(v.stops).sort((a, b) => b[1] - a[1])[0]
  const c = (k: string) => v.counts[k] ?? 0
  const t = new Date(now)

  const lines: Line[] = [
    center(SITE.toUpperCase(), true),
    center("the press room, beirut"),
    rule(),
    row(`receipt no. ${pad(receipt, 4)}`, date(now)),
    row(
      `printed ${pad(t.getHours())}:${pad(t.getMinutes())}`,
      edition ? `ed. ${edition.slice(0, 7)}` : "proof copy"
    ),
    h.visits > 1
      ? row(`visit no. ${pad(h.visits)}`, `since ${date(h.first)}`)
      : row("first visit", "welcome"),
    rule(),
    row("SHEETS READ", "TIME", true),
  ]

  if (v.pages.length === 0) lines.push(row("nothing read yet"))
  for (const p of v.pages)
    lines.push(row(p.path === "/" ? "/ (home)" : p.path, duration(p.ms)))

  lines.push(
    rule(),
    row("sheets", String(v.pages.length)),
    row("paper scrolled", paper(v.scroll))
  )
  if (longest) {
    const [path, label] = longest[0].split("|")
    lines.push(
      row("longest stop", label),
      row(`  on ${path === "/" ? "home" : path}`, duration(longest[1] * 1000))
    )
  }
  lines.push(
    row(
      "right-clicks",
      c("right-clicks") ? String(c("right-clicks")) : "0 (try one)"
    ),
    row(
      "stamps pressed",
      c("stamps") ? String(c("stamps")) : "0 (right-click)"
    ),
    row("loupe", c("loupe") ? "looked closely" : "hold alt"),
    row("keys pressed", String(c("keys")))
  )
  if (c("copies")) lines.push(row("copied", String(c("copies"))))
  if (c("quotes")) lines.push(row("quote cards set", String(c("quotes"))))

  lines.push(
    rule(true),
    row("TOTAL", duration(total), true),
    row("PAID IN", "ATTENTION", true),
    rule(true),
    { kind: "barcode" },
    center(SITE),
    { kind: "gap" },
    center("thank you for reading."),
    center("keep this receipt. no refunds.")
  )
  return lines
}

/** Fit `s` into `n` characters, cutting the end with an ellipsis. */
const fit = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, Math.max(0, n - 1))}…` : s

/** The receipt as plain text, 32 columns, for the clipboard. */
function asText(lines: Line[]) {
  const mid = (s: string) =>
    " ".repeat(Math.max(0, Math.floor((WIDTH - s.length) / 2))) + s
  return lines
    .map((l) => {
      switch (l.kind) {
        case "row": {
          // the value never takes more than two thirds of the roll
          const right = fit(l.right ?? "", Math.floor((WIDTH * 2) / 3))
          const left = fit(l.left, WIDTH - right.length - (right ? 1 : 0))
          return left + " ".repeat(WIDTH - left.length - right.length) + right
        }
        case "center":
          return mid(l.text)
        case "rule":
          return (l.double ? "=" : "-").repeat(WIDTH)
        case "gap":
          return ""
        case "barcode":
          return mid("|| ||| | |||| || | ||| || |")
      }
    })
    .join("\n")
}

/** Line heights, in CSS pixels, shared by the paper and the image. */
const LEAD = { row: 19, center: 19, rule: 14, gap: 12, barcode: 56 }
const BIG = 28
const lineHeight = (l: Line) =>
  l.kind === "center" && l.big ? BIG : LEAD[l.kind]

/** The receipt drawn on a canvas, for saving as an image. */
async function asImage(lines: Line[], font: string) {
  const scale = 3
  const width = 320
  const padX = 22
  const padY = 26
  const inner = width - padX * 2
  const height = lines.reduce((h, l) => h + lineHeight(l), 0) + padY + 34
  const bars = code128(`https://${SITE}`)

  const canvas = document.createElement("canvas")
  canvas.width = width * scale
  canvas.height = height * scale
  const ctx = canvas.getContext("2d")!
  ctx.scale(scale, scale)
  const css = getComputedStyle(document.documentElement)
  const sheet = css.getPropertyValue("--foreground").trim() || "#ebe7e1"
  const ink = css.getPropertyValue("--background").trim() || "#1a1715"

  // the paper, its bottom edge torn in square teeth
  ctx.fillStyle = sheet
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(width, 0)
  for (let x = width, k = 0; x >= 0; x -= 8, k++)
    ctx.lineTo(x, height - (k % 2 ? 6 : 0))
  ctx.lineTo(0, 0)
  ctx.fill()

  ctx.fillStyle = ink
  ctx.strokeStyle = ink
  ctx.textBaseline = "middle"
  const text = (s: string, x: number, y: number, max: number) => {
    let t = s
    while (t.length > 1 && ctx.measureText(t).width > max)
      t = `${t.slice(0, -2)}…`
    ctx.fillText(t, x, y)
  }

  let y = padY
  for (const l of lines) {
    const h = lineHeight(l)
    const mid = y + h / 2
    if (l.kind === "row") {
      ctx.font = `${l.bold ? 700 : 400} 12px ${font}`
      const rw = l.right
        ? Math.min(ctx.measureText(l.right).width, (inner * 2) / 3)
        : 0
      if (l.right) {
        ctx.textAlign = "right"
        text(l.right, padX + inner, mid, (inner * 2) / 3)
        ctx.textAlign = "left"
      }
      text(l.left, padX, mid, inner - rw - 10)
    } else if (l.kind === "center") {
      ctx.font = `${l.big ? 700 : 400} ${l.big ? 15 : 12}px ${font}`
      ctx.textAlign = "center"
      text(l.text, width / 2, mid, inner)
      ctx.textAlign = "left"
    } else if (l.kind === "rule") {
      ctx.lineWidth = 1
      ctx.setLineDash(l.double ? [] : [3, 3])
      ctx.beginPath()
      for (const dy of l.double ? [-2, 2] : [0]) {
        ctx.moveTo(padX, Math.round(mid + dy) + 0.5)
        ctx.lineTo(padX + inner, Math.round(mid + dy) + 0.5)
      }
      ctx.stroke()
    } else if (l.kind === "barcode") {
      const total = bars.reduce((a, b) => a + b, 0) + QUIET * 2
      const m = inner / total
      let x = padX + QUIET * m
      bars.forEach((w, i) => {
        if (i % 2 === 0) ctx.fillRect(x, y + 6, w * m, h - 12)
        x += w * m
      })
    }
    y += h
  }
  return new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"))
}

/** The barcode, as an SVG that scales to the paper's width. */
function Barcode({ text }: { text: string }) {
  const bars = code128(text)
  const total = bars.reduce((a, b) => a + b, 0) + QUIET * 2
  // each bar starts where the widths before it end
  const starts = bars.map(
    (_, i) => QUIET + bars.slice(0, i).reduce((a, b) => a + b, 0)
  )
  return (
    <svg
      viewBox={`0 0 ${total} 40`}
      preserveAspectRatio="none"
      className="my-1 h-11 w-full"
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Barcode for ${text}`}
    >
      {bars.map((w, i) =>
        i % 2 === 0 ? (
          <rect
            key={i}
            x={starts[i]}
            y={0}
            width={w}
            height={40}
            fill="currentColor"
          />
        ) : null
      )}
    </svg>
  )
}

/** One line of the paper, at the same height it has in the image. */
function PaperLine({ line: l }: { line: Line }) {
  const style = { height: lineHeight(l) }
  switch (l.kind) {
    case "row":
      return (
        <p
          style={style}
          className={cn(
            "flex items-center justify-between gap-3 whitespace-pre",
            l.bold && "font-bold"
          )}
        >
          <span className="min-w-0 truncate" style={{ whiteSpace: "pre" }}>
            {l.left}
          </span>
          {l.right && (
            <span className="max-w-[66%] shrink-0 truncate text-right">
              {l.right}
            </span>
          )}
        </p>
      )
    case "center":
      return (
        <p
          style={style}
          className={cn(
            "flex items-center justify-center truncate",
            l.big && "text-[15px] font-bold tracking-wider"
          )}
        >
          {l.text}
        </p>
      )
    case "rule":
      return (
        <div style={style} className="flex items-center" aria-hidden="true">
          <div
            className={cn(
              "w-full border-current",
              l.double ? "h-[5px] border-y" : "border-t border-dashed"
            )}
          />
        </div>
      )
    case "gap":
      return <div style={style} aria-hidden="true" />
    case "barcode":
      return (
        <div style={style} className="flex items-center">
          <Barcode text={`https://${SITE}`} />
        </div>
      )
  }
}

/** Square teeth along the bottom of the paper, where it was torn off. */
const TORN = `polygon(0 0, 100% 0, ${Array.from({ length: 41 }, (_, i) => {
  const x = 100 - i * 2.5
  return `${x}% calc(100% - ${i % 2 ? 6 : 0}px)`
}).join(", ")})`

/**
 * The visit receipt. A thermal printer feeds out a till receipt for this
 * visit: every sheet read and for how long, paper scrolled in real
 * millimetres, the section read longest, right-clicks, stamps and keys, and
 * a Code 128 barcode that scans back to the site. Save it as an image or
 * copy it as text. Built from this browser's own log (lib/visit.ts).
 */
export function Receipt({ edition }: { edition: string }) {
  const [lines, setLines] = React.useState<Line[] | null>(null)
  const [copied, setCopied] = React.useState(false)
  const [no, setNo] = React.useState(0)
  const paperRef = React.useRef<HTMLDivElement>(null)
  const closeRef = React.useRef<HTMLButtonElement>(null)

  const close = React.useCallback(() => {
    setLines(null)
    setCopied(false)
  }, [])

  // printed on request: from the footer, the slip or the ticket
  React.useEffect(() => {
    const onCommand = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== "receipt") return
      // the log writes itself out first, so the receipt is to the second
      window.dispatchEvent(new Event("ks:receipt-read"))
      const v = readVisit()
      if (!v) return
      const h = readHistory()
      h.receipts += 1
      saveHistory(h)
      setNo(h.receipts)
      setLines(compose(v, h, edition, h.receipts))
    }
    window.addEventListener("ks:command", onCommand)
    return () => window.removeEventListener("ks:command", onCommand)
  }, [edition])

  // Esc tears it off; the page behind stays put
  React.useEffect(() => {
    if (!lines) return
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    window.addEventListener("keydown", onKey)
    document.documentElement.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = ""
    }
  }, [lines, close])

  React.useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(id)
  }, [copied])

  if (!lines) return null

  const save = async () => {
    const font = paperRef.current
      ? getComputedStyle(paperRef.current).fontFamily
      : "monospace"
    await document.fonts.ready
    const blob = await asImage(lines, font)
    if (!blob) return
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `khaledsaeed-receipt-${pad(no, 4)}.png`
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  const copy = () =>
    navigator.clipboard?.writeText(asText(lines)).then(
      () => setCopied(true),
      () => undefined
    )

  return createPortal(
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-background/80 backdrop-blur-sm fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your visit receipt"
        className="mx-auto my-[6vh] w-[min(22rem,calc(100%-2rem))]"
      >
        {/* the printer head, with the slot the paper comes out of */}
        <div className="border border-border bg-card px-3 pt-2 pb-3 font-mono text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>
              <span className="text-brand">{"// "}</span>ks-58 thermal
            </span>
            <span className="tabular-nums">no. {pad(no, 4)}</span>
          </div>
          <div className="mt-2.5 h-1.5 bg-background" />
        </div>

        <div className="-mt-3 overflow-hidden px-2">
          <div
            ref={paperRef}
            className="receipt-feed bg-foreground px-[22px] pt-[26px] pb-[34px] font-mono text-[12px] text-background"
            style={{ clipPath: TORN }}
          >
            {lines.map((l, i) => (
              <PaperLine key={i} line={l} />
            ))}
          </div>
        </div>

        <div className="rise-in mt-4 flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={save}
            className="group inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <SaveGlyph className="size-4" />
            save image
          </button>
          <button
            type="button"
            onClick={copy}
            className={cn(
              "group inline-flex items-center gap-2 border border-border bg-card px-3 py-2 transition-colors hover:border-brand/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              copied ? "text-brand" : "text-muted-foreground"
            )}
          >
            <CopyGlyph done={copied} className="size-4" />
            <span aria-live="polite">{copied ? "copied" : "copy as text"}</span>
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="border border-border bg-card px-3 py-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            tear off (esc)
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

/** A link-styled button that asks the printer for a receipt. */
export function ReceiptButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("ks:command", { detail: "receipt" })
        )
      }
      className={cn(
        "hit-area text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      print my receipt
    </button>
  )
}
