"use client"

import Link from "next/link"
import * as React from "react"

import type { Stock } from "@/lib/content/projects"
import { cn } from "@/lib/utils"

/** A certificate as the deck prints it, resolved on the server. */
export type DeckCard = {
  slug: string
  /** Issue number on /about/certifications, oldest first. */
  no: number
  href: string
  name: string
  issuer: string
  /** Two or three letters for the seal. */
  mark: string
  /** "sep 2026" */
  issued: string
  category: string
  stock: Stock
  credentialId?: string
  distinction?: string
}

/** How long a card stays on top before the next one is dealt. */
const DWELL = 3400
/** Cards drawn in the pile; the last one waits unseen, ready to fade in. */
const DEPTH = 5
/** Drag distance, in pixels, that throws the top card off the pile. */
const THROW = 96

/** A fixed lean per card, so the pile looks hand-stacked but stays put between renders. */
function lean(slug: string) {
  let h = 0
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) | 0
  return ((Math.abs(h) % 7) - 3) * 0.4
}

const shortId = (id: string) =>
  id.length > 24 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id

type Throw = { card: DeckCard; dx: number; dy: number; r: number; dir: 1 | -1 }

/**
 * Every certificate as a printed card in one pile, newest on top. Left alone
 * while on screen, the top card is thrown off every few seconds and the pile
 * shuffles up; hovering or focusing holds it. The top card tilts toward the
 * pointer and can be dragged and thrown by hand, and clicking it opens the
 * certificate. Buttons, arrow keys and a strip of ticks (one per
 * certificate) work the deck too. Under reduced motion nothing plays by
 * itself and cards swap without moving.
 */
export function CertificateDeck({ cards }: { cards: DeckCard[] }) {
  const n = cards.length
  const [top, setTop] = React.useState(0)
  const [thrown, setThrown] = React.useState<(Throw & { key: string }) | null>(
    null
  )
  const [entering, setEntering] = React.useState<string | null>(null)
  const [held, setHeld] = React.useState(false)
  const [onScreen, setOnScreen] = React.useState(false)
  const [reduced, setReduced] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const drag = React.useRef<{
    x: number
    y: number
    dx: number
    dy: number
    moved: boolean
  } | null>(null)
  const swallowClick = React.useRef(false)

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    const el = rootRef.current
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { threshold: 0.35 }
    )
    if (el) io.observe(el)
    return () => {
      mq.removeEventListener("change", sync)
      io.disconnect()
    }
  }, [])

  /** Deal the next card: the top one is thrown and goes to the bottom. */
  const next = (from: Omit<Throw, "card"> = { dx: 0, dy: 0, r: 0, dir: 1 }) => {
    if (n < 2) return
    if (!reduced) {
      const card = cards[top]
      setThrown({ card, ...from, key: `${card.slug}-${Date.now()}` })
    }
    setTop((top + 1) % n)
  }

  /** Put a card on top from anywhere in the pile. */
  const show = (i: number) => {
    if (i === top) return
    if (i === (top + 1) % n) return next()
    setEntering(cards[i].slug)
    setTop(i)
  }

  const running = onScreen && !held && !reduced && n > 1
  const deal = React.useEffectEvent(() => next())
  React.useEffect(() => {
    if (!running) return
    const id = window.setTimeout(deal, DWELL)
    return () => window.clearTimeout(id)
  }, [running, top])

  const pile = Array.from(
    { length: Math.min(DEPTH, n) },
    (_, d) => [cards[(top + d) % n], d] as const
  )
  const current = cards[top]

  const setVars = (el: HTMLElement, vars: Record<string, string>) => {
    for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v)
  }
  const settle = (el: HTMLElement) =>
    setVars(el, { "--dx": "0px", "--dy": "0px", "--r": "0deg" })

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Certificates"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setHeld(false)
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault()
          next()
        } else if (e.key === "ArrowLeft") {
          e.preventDefault()
          show((top - 1 + n) % n)
        }
      }}
    >
      {/* the pile peeks out to the top right, so leave it room */}
      <div className="relative mt-8 mr-8 aspect-square sm:aspect-[3/2]">
        {pile
          .map(([c, d]) => (
            <div
              key={c.slug}
              aria-hidden={d > 0 || undefined}
              inert={d > 0}
              className="absolute inset-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{
                zIndex: DEPTH - d,
                opacity: d === DEPTH - 1 ? 0 : 1,
                transform: `translate(${d * 0.55}rem, ${d * -0.55}rem) rotate(${d === 0 ? 0 : lean(c.slug)}deg)`,
              }}
            >
              {d === 0 ? (
                <Link
                  href={c.href}
                  draggable={false}
                  onAnimationEnd={(e) => {
                    if (e.target === e.currentTarget) setEntering(null)
                  }}
                  onPointerDown={(e) => {
                    if (e.button !== 0) return
                    // a new press: whatever the last gesture was, it is over
                    swallowClick.current = false
                    drag.current = {
                      x: e.clientX,
                      y: e.clientY,
                      dx: 0,
                      dy: 0,
                      moved: false,
                    }
                    e.currentTarget.setPointerCapture(e.pointerId)
                    e.currentTarget.dataset.dragging = ""
                  }}
                  onPointerMove={(e) => {
                    const el = e.currentTarget
                    const g = drag.current
                    if (g) {
                      g.dx = e.clientX - g.x
                      g.dy = e.clientY - g.y
                      if (Math.hypot(g.dx, g.dy) > 6) g.moved = true
                      setVars(el, {
                        "--dx": `${g.dx}px`,
                        "--dy": `${g.dy * 0.35}px`,
                        "--r": `${g.dx * 0.04}deg`,
                      })
                    } else if (!reduced && e.pointerType === "mouse") {
                      const box = el.getBoundingClientRect()
                      const px = (e.clientX - box.left) / box.width - 0.5
                      const py = (e.clientY - box.top) / box.height - 0.5
                      setVars(el, {
                        "--ry": `${px * 6}deg`,
                        "--rx": `${py * -5}deg`,
                      })
                    }
                  }}
                  onPointerUp={(e) => {
                    const g = drag.current
                    if (!g) return
                    drag.current = null
                    delete e.currentTarget.dataset.dragging
                    if (g.moved) swallowClick.current = true
                    if (Math.abs(g.dx) > THROW) {
                      next({
                        dx: g.dx,
                        dy: g.dy * 0.35,
                        r: g.dx * 0.04,
                        dir: g.dx > 0 ? 1 : -1,
                      })
                    }
                    settle(e.currentTarget)
                  }}
                  onPointerCancel={(e) => {
                    drag.current = null
                    delete e.currentTarget.dataset.dragging
                    settle(e.currentTarget)
                  }}
                  onPointerLeave={(e) => {
                    if (!drag.current)
                      setVars(e.currentTarget, {
                        "--rx": "0deg",
                        "--ry": "0deg",
                      })
                  }}
                  onClick={(e) => {
                    if (!swallowClick.current) return
                    swallowClick.current = false
                    e.preventDefault()
                  }}
                  className={cn(
                    "block h-full cursor-grab touch-pan-y transition-transform duration-200 ease-out will-change-transform select-none backface-hidden focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none active:cursor-grabbing data-[dragging]:transition-none motion-reduce:transition-none",
                    entering === c.slug && "fade-in"
                  )}
                  style={{
                    transform:
                      "translate3d(var(--dx, 0px), var(--dy, 0px), 0) rotate(var(--r, 0deg)) perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
                  }}
                >
                  <Face card={c} />
                </Link>
              ) : (
                <Face card={c} />
              )}
            </div>
          ))
          .reverse()}

        {thrown && (
          <div
            key={thrown.key}
            aria-hidden="true"
            className="deck-throw pointer-events-none absolute inset-0"
            style={
              {
                zIndex: DEPTH + 1,
                "--dx": `${thrown.dx}px`,
                "--dy": `${thrown.dy}px`,
                "--r": `${thrown.r}deg`,
                "--dir": thrown.dir,
              } as React.CSSProperties
            }
            onAnimationEnd={() => setThrown(null)}
          >
            <Face card={thrown.card} />
          </div>
        )}
      </div>

      {/* controls */}
      <div className="mt-6 flex items-center gap-1 font-mono text-xs">
        <DeckButton onClick={() => show((top - 1 + n) % n)}>prev</DeckButton>
        <DeckButton onClick={() => next()}>next</DeckButton>
        <span className="ml-auto text-muted-foreground tabular-nums">
          {String(top + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
      </div>

      {/* one tick per certificate, in its card stock */}
      <div
        role="group"
        aria-label="Jump to a certificate"
        className="mt-4 flex items-end gap-px"
      >
        {cards.map((c, i) => {
          const on = i === top
          return (
            <button
              key={c.slug}
              type="button"
              aria-label={`${c.name}, ${c.issuer}`}
              aria-current={on || undefined}
              onClick={() => show(i)}
              className="group flex h-6 min-w-0 flex-1 items-end focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span
                className={cn(
                  "block w-full transition-[height,opacity] duration-300 motion-reduce:transition-none",
                  on
                    ? "h-5"
                    : "h-2 opacity-45 group-hover:h-3.5 group-hover:opacity-90"
                )}
                style={{ backgroundColor: `var(--stock-${c.stock})` }}
              />
            </button>
          )
        })}
      </div>

      {/* feed line: fills until the next card is dealt, solid while held */}
      <div className="relative mt-2 h-px bg-border">
        <span
          key={`${top}-${running}`}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 origin-left bg-brand",
            running && "press-feed"
          )}
          style={{ "--feed": `${DWELL}ms` } as React.CSSProperties}
        />
      </div>

      <p className="sr-only" aria-live={running ? "off" : "polite"}>
        Certificate {top + 1} of {n}: {current.name}, {current.issuer},{" "}
        {current.issued}.
      </p>
    </div>
  )
}

function DeckButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center border border-border px-3 py-2 text-muted-foreground transition-colors hover:border-muted-foreground/60 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {children}
    </button>
  )
}

/** One certificate printed on its category's card stock, with a seal. */
function Face({ card: c }: { card: DeckCard }) {
  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden p-4 sm:p-6 lg:p-7"
      style={{
        backgroundColor: `var(--stock-${c.stock})`,
        color: `var(--ink-${c.stock})`,
      }}
    >
      <div className="flex items-center justify-between gap-4 font-mono text-xs">
        <span className="truncate">
          {"// certificate"}
          <span className="hidden sm:inline"> of completion</span>
        </span>
        <span className="shrink-0 tabular-nums">
          no. {String(c.no).padStart(2, "0")}
        </span>
      </div>

      <div className="min-w-0">
        <p className="font-mono text-xs opacity-80">{c.category}</p>
        <p className="mt-1.5 line-clamp-2 font-heading text-2xl leading-tight font-medium tracking-tight text-balance sm:text-3xl lg:text-4xl">
          {c.name}
        </p>
        <p className="mt-1.5 text-sm sm:text-base">{c.issuer}</p>
        {c.distinction && (
          <p className="mt-2 hidden font-mono text-xs sm:block">
            {c.distinction}
          </p>
        )}
      </div>

      <div className="flex items-end justify-between gap-4 border-t border-dashed border-current/30 pt-3 sm:pt-4">
        <div className="min-w-0 font-mono text-xs leading-relaxed">
          <p>issued {c.issued}</p>
          {c.credentialId && (
            <p className="truncate opacity-80">id {shortId(c.credentialId)}</p>
          )}
        </div>
        <Seal mark={c.mark} stock={c.stock} />
      </div>
    </div>
  )
}

/** The issuer's mark in a square seal on a dithered field, like the postcard stamp. */
function Seal({ mark, stock }: { mark: string; stock: Stock }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-12 shrink-0 border-2 border-current p-0.5 sm:size-16"
    >
      <span className="relative grid place-items-center">
        <span
          className="dither-tone absolute inset-0"
          style={{ "--tone": "var(--dither-5)" } as React.CSSProperties}
        />
        <span
          className="relative px-1 font-mono text-xs font-medium tracking-tight sm:text-sm"
          style={{ backgroundColor: `var(--stock-${stock})` }}
        >
          {mark}
        </span>
      </span>
    </span>
  )
}
