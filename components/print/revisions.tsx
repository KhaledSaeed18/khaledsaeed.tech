"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { formatDate } from "@/lib/format"
import { diffWords, tokens, type Seg } from "@/lib/revision-diff"
import type { RevisionData } from "@/lib/revisions"
import { logVisit } from "@/lib/visit"

type State = {
  data: RevisionData
  /** Earlier printings there are to compare with. */
  count: number
  on: boolean
  /** The printing the page is compared with. */
  at: number
  toggle: () => void
  step: (by: number) => void
}

const Ctx = React.createContext<State | null>(null)

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

/**
 * Revision marks: the case study as a marked-up proof. Words cut since an
 * earlier printing are struck through, words set since are underlined, and
 * the slip at the foot of the page steps back through the printings, each
 * one a commit in the site's history. `v` turns it on and off; there is
 * deliberately no button, like the loupe and the plates.
 */
export function Revisions({
  data,
  children,
}: {
  data: RevisionData
  children: React.ReactNode
}) {
  const count = data.printings.length - 1
  const [on, setOn] = React.useState(false)
  const [at, setAt] = React.useState(Math.max(0, count - 1))

  const toggle = React.useCallback(() => {
    if (!count) return
    setOn((v) => {
      if (!v) logVisit("revisions")
      return !v
    })
  }, [count])
  const step = React.useCallback(
    (by: number) => setAt((a) => Math.min(count - 1, Math.max(0, a + by))),
    [count]
  )

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e)) return
      if (e.key === "v") toggle()
      else if (on && e.key === "Escape") setOn(false)
      else if (on && e.key === "ArrowLeft") step(-1)
      else if (on && e.key === "ArrowRight") step(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [on, toggle, step])

  const state = React.useMemo(
    () => ({ data, count, on, at, toggle, step }),
    [data, count, on, at, toggle, step]
  )

  return (
    <Ctx.Provider value={state}>
      {children}
      {on && <Slip />}
    </Ctx.Provider>
  )
}

/** The page's words in the printing compared with, as proof segments. */
function segsFor(data: RevisionData, id: string, at: number): Seg[] {
  const now = data.now[id] ?? ""
  const then = data.fields[id]?.[at]
  if (then === undefined) return [{ op: "=", text: now }]
  if (then === null) return [{ op: "+", text: now }]
  return diffWords(then, now)
}

function Marks({ segs }: { segs: Seg[] }) {
  return segs.map((s, k) =>
    s.op === "=" ? (
      <React.Fragment key={k}>{s.text}</React.Fragment>
    ) : s.op === "-" ? (
      <del
        key={k}
        className="text-brand/80 decoration-brand decoration-1 fade-in"
      >
        {s.text}
      </del>
    ) : (
      <ins
        key={k}
        className="bg-teal/10 text-inherit underline decoration-teal decoration-2 underline-offset-4 fade-in"
      >
        {s.text}
      </ins>
    )
  )
}

/** A field of the case study: plain, or marked up while revisions are on. */
export function Rev({ id, text }: { id: string; text: string }) {
  const s = React.useContext(Ctx)
  if (!s?.on) return text
  return <Marks segs={segsFor(s.data, id, s.at)} />
}

/** What a section cut since the printing compared with, struck through. */
export function RevCuts({ section }: { section: "approach" | "highlights" }) {
  const s = React.useContext(Ctx)
  const cut = s?.on ? (s.data.cuts[section][s.at] ?? []) : []
  if (!cut.length) return null
  return (
    <div className="mt-8 border border-dashed border-brand/40 p-5 font-mono text-xs fade-in">
      <p className="text-brand">
        {"// "}cut since rev {s!.at + 1}
      </p>
      <ul className="mt-3 space-y-2">
        {cut.map((c) => (
          <li key={c}>
            <del className="text-muted-foreground decoration-brand">{c}</del>
          </li>
        ))}
      </ul>
    </div>
  )
}

const words = (s: string) => tokens(s).length

/** The slip at the foot of the page: which printing, and what changed. */
function Slip() {
  const s = React.useContext(Ctx)!
  const { data, at, count } = s
  const then = data.printings[at]
  const tally = React.useMemo(() => {
    let cut = 0
    let set = 0
    for (const id of Object.keys(data.now))
      for (const g of segsFor(data, id, at))
        if (g.op === "-") cut += words(g.text)
        else if (g.op === "+") set += words(g.text)
    for (const c of [...data.cuts.approach[at], ...data.cuts.highlights[at]])
      cut += words(c)
    return { cut, set }
  }, [data, at])

  const arrow =
    "border border-border px-2 py-1 transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-30"

  return createPortal(
    <div
      role="region"
      aria-label="Revisions"
      className="rise-in fixed inset-x-0 bottom-0 z-40 border-t border-dashed border-border bg-background/95 font-mono text-xs text-muted-foreground"
    >
      <div className="frame flex flex-wrap items-center gap-x-5 gap-y-2 py-3">
        <span>
          <span className="text-brand">{"// "}</span>revisions
        </span>
        <span className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Earlier printing"
            disabled={at === 0}
            onClick={() => s.step(-1)}
            className={arrow}
          >
            ←
          </button>
          <span className="text-foreground tabular-nums" aria-live="polite">
            since rev {at + 1} of {count + 1}
          </span>
          <button
            type="button"
            aria-label="Later printing"
            disabled={at === count - 1}
            onClick={() => s.step(1)}
            className={arrow}
          >
            →
          </button>
        </span>
        <span className="min-w-0 truncate">
          {formatDate(then.date).toLowerCase()} / {then.sha} “{then.subject}”
        </span>
        <span className="tabular-nums">
          <del className="text-brand decoration-brand">{tally.cut} cut</del>
          {" / "}
          <ins className="text-foreground underline decoration-teal decoration-2 underline-offset-4">
            {tally.set} set
          </ins>
        </span>
        <button
          type="button"
          onClick={s.toggle}
          className="ml-auto border border-border px-2 py-1 transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          close (v)
        </button>
      </div>
    </div>,
    document.body
  )
}
