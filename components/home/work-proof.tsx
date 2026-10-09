"use client"

import Link from "next/link"
import * as React from "react"

import { DitherObject } from "@/components/print/dither-object"
import type { Project } from "@/lib/content/projects"
import { cn } from "@/lib/utils"

/** How long each plate stays on the press before the next one prints. */
const DWELL = 5000

export type ProofProject = Pick<
  Project,
  "slug" | "name" | "kind" | "year" | "tagline" | "stack" | "object" | "stock"
>

/**
 * Selected work as a press proof: one large plate printed on the active
 * project's card stock, beside a numbered index. Hovering or focusing a row
 * reprints the plate; left alone, the press advances by itself while the
 * section is on screen, with a feed line under the active row. Every row and
 * the plate are plain links, so touch and keyboard need nothing special.
 */
export function WorkProof({ projects }: { projects: ProofProject[] }) {
  const [active, setActive] = React.useState(0)
  // the plate that was on the press, kept underneath while the new one prints
  const [under, setUnder] = React.useState<number | null>(null)
  const [held, setHeld] = React.useState(false)
  const [onScreen, setOnScreen] = React.useState(false)
  const [reduced, setReduced] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)

  const activeRef = React.useRef(0)
  const show = React.useCallback((i: number) => {
    const cur = activeRef.current
    if (cur === i) return
    activeRef.current = i
    setUnder(cur)
    setActive(i)
  }, [])

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    const el = rootRef.current
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      {
        threshold: 0.35,
      }
    )
    if (el) io.observe(el)
    return () => {
      mq.removeEventListener("change", sync)
      io.disconnect()
    }
  }, [])

  const running = onScreen && !held && !reduced && projects.length > 1

  React.useEffect(() => {
    if (!running) return
    const id = window.setTimeout(
      () => show((active + 1) % projects.length),
      DWELL
    )
    return () => window.clearTimeout(id)
  }, [running, active, projects.length, show])

  const p = projects[active]

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-12 lg:gap-10"
      onMouseLeave={() => setHeld(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setHeld(false)
      }}
    >
      {/* the plate */}
      <div className="relative isolate aspect-[4/5] sm:aspect-[5/4] lg:col-span-7 lg:aspect-auto lg:min-h-[32rem]">
        {under !== null && under !== active && (
          <Plate
            project={projects[under]}
            index={under}
            total={projects.length}
            inert
          />
        )}
        <Plate
          key={p.slug}
          project={p}
          index={active}
          total={projects.length}
          printing={under !== null}
          onPrinted={() => setUnder(null)}
          onEnter={() => setHeld(true)}
        />
      </div>

      {/* the index */}
      <ol className="flex flex-col border-t border-dashed border-border lg:col-span-5">
        {projects.map((proj, i) => {
          const on = i === active
          return (
            <li
              key={proj.slug}
              className="relative flex-1 border-b border-dashed border-border"
            >
              <Link
                href={`/work/${proj.slug}`}
                onMouseEnter={() => {
                  setHeld(true)
                  show(i)
                }}
                onFocus={() => {
                  setHeld(true)
                  show(i)
                }}
                className="group flex h-full items-center gap-4 py-5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:gap-6"
              >
                <span
                  className={cn(
                    "w-6 shrink-0 font-mono text-xs tabular-nums transition-colors",
                    on ? "text-brand" : "text-muted-foreground"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block font-heading text-2xl font-medium tracking-tight text-balance transition-colors sm:text-3xl lg:text-2xl xl:text-3xl",
                      on
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {proj.name}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-muted-foreground">
                    {proj.kind.toLowerCase()}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground tabular-nums">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 transition-opacity",
                      on ? "opacity-100" : "opacity-0"
                    )}
                    style={{ backgroundColor: `var(--stock-${proj.stock})` }}
                  />
                  {proj.year}
                </span>
              </Link>
              {/* feed line: fills until the next plate prints, solid while held */}
              {on && (
                <span
                  aria-hidden="true"
                  key={`${proj.slug}-${running}`}
                  className={cn(
                    "absolute inset-x-0 -bottom-px h-px origin-left bg-brand",
                    running && "press-feed"
                  )}
                  style={{ "--feed": `${DWELL}ms` } as React.CSSProperties}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Plate({
  project: p,
  index,
  total,
  printing = false,
  inert = false,
  onPrinted,
  onEnter,
}: {
  project: ProofProject
  index: number
  total: number
  printing?: boolean
  inert?: boolean
  onPrinted?: () => void
  onEnter?: () => void
}) {
  const style = {
    backgroundColor: `var(--stock-${p.stock})`,
    color: `var(--ink-${p.stock})`,
  }
  const body = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-xs">
        <span>
          {"// "}
          {p.kind.toLowerCase()}
        </span>
        <span className="tabular-nums">
          plate {String(index + 1).padStart(2, "0")} of{" "}
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="[container-type:size] my-4 flex min-h-0 w-full flex-1 items-center justify-center">
        <DitherObject kind={p.object} stock={p.stock} dot={3} play fluid />
      </div>

      <div>
        <p className="font-heading text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
          {p.name}
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed sm:text-base">
          {p.tagline}
        </p>
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-xs">
          <span>
            {p.year} / {p.stack.slice(0, 3).join(", ").toLowerCase()}
          </span>
          <span className="underline underline-offset-4">
            read the case study
          </span>
        </div>
      </div>
    </>
  )

  const cls = "absolute inset-0 flex flex-col p-5 sm:p-7 lg:p-8"

  if (inert)
    return (
      <div aria-hidden="true" className={cls} style={style}>
        {body}
      </div>
    )

  return (
    <Link
      href={`/work/${p.slug}`}
      onMouseEnter={onEnter}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) onPrinted?.()
      }}
      className={cn(
        cls,
        "focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
        printing && "plate-print"
      )}
      style={style}
    >
      {body}
    </Link>
  )
}
