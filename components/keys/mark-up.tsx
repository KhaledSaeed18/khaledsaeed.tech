"use client"

import { usePathname } from "next/navigation"
import * as React from "react"
import { createPortal } from "react-dom"

import { requestQuoteCard } from "@/components/keys/quote-card"
import { fragment, quoteFits } from "@/lib/quote-text"
import { cn } from "@/lib/utils"
import { logVisit } from "@/lib/visit"

const REPO = "https://github.com/KhaledSaeed18/khaledsaeed.tech"

/** A proofreader's stamps, in the order they come off the rack. */
const STAMPS = ["ok to print", "stet", "approved", "seen", "pass"]

/** Most stamps one sheet can take before the oldest is cleaned off. */
const MAX_STAMPS = 12

type Item = {
  id: string
  label: string
  hint?: string
  run: () => void
}
type Group = { title: string; items: Item[] }

/** What was under the pointer when the slip was called up. */
type Spot = {
  /** client coordinates, where the slip is pinned */
  x: number
  y: number
  /** document coordinates, where a stamp lands */
  px: number
  py: number
  selection: string
  link: { href: string; text: string } | null
  section: { id: string; label: string } | null
}

type Stamp = {
  id: number
  x: number
  y: number
  rot: number
  word: string
  no: number
}

/** The file a route is built from, for "view source". */
function sourceFile(pathname: string) {
  if (pathname === "/") return "app/page.tsx"
  const [, top, slug] = pathname.split("/")
  if (slug && (top === "work" || top === "writing"))
    return `app/${top}/[slug]/page.tsx`
  return `app${pathname}/page.tsx`
}

/** The section the pointer sat in, by its heading. */
function sectionAt(el: Element): Spot["section"] {
  const heading = el.closest("h1[id], h2[id], h3[id]")
  if (heading)
    return { id: heading.id, label: heading.textContent?.trim() ?? "" }
  const section = el.closest("section[aria-labelledby]")
  const id = section?.getAttribute("aria-labelledby")
  const label = id && document.getElementById(id)?.textContent?.trim()
  return id && label ? { id, label } : null
}

/** Right-clicks that keep the browser's own menu. */
function wantsNative(e: MouseEvent) {
  const t = e.target as HTMLElement | null
  return (
    e.shiftKey ||
    !t ||
    !window.matchMedia("(pointer: fine)").matches ||
    t.isContentEditable ||
    !!t.closest("input, textarea, select, img, video, [data-native-menu]")
  )
}

const say = (text: string) =>
  window.dispatchEvent(new CustomEvent("ks:notice", { detail: text }))
const command = (name: "palette" | "proof" | "loupe" | "receipt") =>
  window.dispatchEvent(new CustomEvent("ks:command", { detail: name }))

const copy = (text: string, done: string) =>
  navigator.clipboard?.writeText(text).then(
    () => say(done),
    () => say("the clipboard said no")
  )

/**
 * The mark-up slip. Right-click anywhere on a sheet and a proofreader's slip
 * is pinned where you clicked: a registration mark on the spot, a leader
 * line out to the slip, and the things you can do with what is under the
 * pointer (a passage, a link, a section), then with the sheet itself. One
 * of them stamps the proof. Shift + right-click, fields and images keep the
 * browser's own menu.
 */
export function MarkUp() {
  const pathname = usePathname()
  const [spot, setSpot] = React.useState<Spot | null>(null)
  const [place, setPlace] = React.useState<{
    left: number
    top: number
    cx: number
    cy: number
  } | null>(null)
  const [stamps, setStamps] = React.useState<Stamp[]>([])
  const [count, setCount] = React.useState(0)
  const slip = React.useRef<HTMLDivElement>(null)
  const returnTo = React.useRef<HTMLElement | null>(null)

  const close = React.useCallback((restore = true) => {
    setSpot(null)
    setPlace(null)
    if (restore) returnTo.current?.focus({ preventScroll: true })
    returnTo.current = null
  }, [])

  // a new sheet: put the slip away and wash the stamps off
  const [sheet, setSheet] = React.useState(pathname)
  if (sheet !== pathname) {
    setSheet(pathname)
    setSpot(null)
    setPlace(null)
    setStamps([])
  }

  // the one listener that calls the slip up
  React.useEffect(() => {
    const onMenu = (e: MouseEvent) => {
      if (slip.current?.contains(e.target as Node)) {
        e.preventDefault()
        return
      }
      if (wantsNative(e)) return
      e.preventDefault()
      const target = e.target as Element
      let x = e.clientX
      let y = e.clientY
      // from the keyboard (menu key, shift+F10): pin it to the focused thing
      if (x === 0 && y === 0) {
        const r = target.getBoundingClientRect()
        x = r.left + Math.min(24, r.width / 2)
        y = r.top + Math.min(24, r.height / 2)
      }
      const a = target.closest<HTMLAnchorElement>("a[href]")
      returnTo.current = document.activeElement as HTMLElement | null
      setPlace(null)
      setSpot({
        x,
        y,
        px: x + window.scrollX,
        py: y + window.scrollY,
        selection: window.getSelection()?.toString().trim() ?? "",
        link: a
          ? {
              href: a.href,
              text: (a.getAttribute("aria-label") || a.textContent || "")
                .trim()
                .slice(0, 40),
            }
          : null,
        section: sectionAt(target),
      })
    }
    window.addEventListener("contextmenu", onMenu)
    return () => window.removeEventListener("contextmenu", onMenu)
  }, [])

  // while it is up: anything else puts it away
  React.useEffect(() => {
    if (!spot) return
    const away = (e: Event) => {
      if (slip.current?.contains(e.target as Node)) return
      close(false)
    }
    const quiet = () => close(false)
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close()
    window.addEventListener("pointerdown", away, true)
    window.addEventListener("scroll", quiet, { passive: true })
    window.addEventListener("resize", quiet)
    window.addEventListener("blur", quiet)
    window.addEventListener("keydown", esc)
    return () => {
      window.removeEventListener("keydown", esc)
      window.removeEventListener("pointerdown", away, true)
      window.removeEventListener("scroll", quiet)
      window.removeEventListener("resize", quiet)
      window.removeEventListener("blur", quiet)
    }
  }, [spot, close])

  // place the slip beside the mark, on whichever side has room
  React.useLayoutEffect(() => {
    if (!spot || !slip.current) return
    const { width: w, height: h } = slip.current.getBoundingClientRect()
    const gap = 22
    const vw = window.innerWidth
    const vh = window.innerHeight
    const right = spot.x + gap + w <= vw - 8
    const below = spot.y + gap + h <= vh - 8
    const left = Math.max(8, right ? spot.x + gap : spot.x - gap - w)
    const top = Math.max(8, below ? spot.y + gap : spot.y - gap - h)
    setPlace({
      left,
      top,
      // the slip corner nearest the mark, where the leader line lands
      cx: right ? left : left + w,
      cy: below ? top : top + h,
    })
    slip.current.querySelector<HTMLElement>("[role=menuitem]")?.focus({
      preventScroll: true,
    })
  }, [spot])

  const stamp = React.useCallback(() => {
    if (!spot) return
    const no = count + 1
    setCount(no)
    logVisit("stamps")
    setStamps((s) =>
      [
        ...s,
        {
          id: Date.now(),
          x: spot.px,
          y: spot.py,
          rot: Math.round((Math.random() * 2 - 1) * 9),
          word: STAMPS[count % STAMPS.length],
          no,
        },
      ].slice(-MAX_STAMPS)
    )
  }, [spot, count])

  const groups: Group[] = React.useMemo(() => {
    if (!spot) return []
    const url = `${window.location.origin}${pathname}`
    const here: Item[] = []
    if (spot.selection) {
      const words = spot.selection.split(/\s+/).length
      const passage = `${url}#:~:text=${fragment(spot.selection)}`
      here.push(
        {
          id: "quote",
          label: "Quote the selection",
          hint: `${words} word${words === 1 ? "" : "s"}`,
          run: () =>
            copy(
              `> ${spot.selection.replace(/\n+/g, "\n> ")}\n\n— ${document.title}\n${passage}`,
              "copied the quote, with a link back"
            ),
        },
        {
          id: "passage",
          label: "Link straight to this passage",
          hint: "#:~:text",
          run: () => copy(passage, "copied a link that lands on the passage"),
        }
      )
      if (quoteFits(spot.selection) && pathname !== "/quote")
        here.push({
          id: "card",
          label: "Set it as a quote card",
          hint: "1200×630",
          run: () => requestQuoteCard({ text: spot.selection, from: pathname }),
        })
    }
    if (spot.link) {
      const link = spot.link
      here.push(
        {
          id: "open",
          label: "Open the link in a new tab",
          hint: link.text || new URL(link.href).hostname,
          run: () => window.open(link.href, "_blank", "noopener"),
        },
        {
          id: "copy-link",
          label: "Copy the link address",
          run: () => copy(link.href, "copied the link"),
        }
      )
    }
    if (spot.section) {
      const section = spot.section
      here.push({
        id: "section",
        label: "Copy a link to this section",
        hint: section.label.toLowerCase(),
        run: () => copy(`${url}#${section.id}`, `copied #${section.id}`),
      })
    }

    const sheet: Item[] = [
      {
        id: "stamp",
        label: "Stamp the proof",
        hint: `“${STAMPS[count % STAMPS.length]}”`,
        run: stamp,
      },
      ...(stamps.length
        ? [
            {
              id: "wash",
              label: "Wash the stamps off",
              hint: String(stamps.length),
              run: () => setStamps([]),
            },
          ]
        : []),
      {
        id: "page",
        label: "Copy the link to this sheet",
        hint: pathname,
        run: () => copy(url, "copied the link to this sheet"),
      },
      {
        id: "proof",
        label: "Proof mode",
        hint: "p",
        run: () => command("proof"),
      },
      {
        id: "loupe",
        label: "Printer's loupe",
        hint: "hold ⌥ / l",
        run: () => command("loupe"),
      },
      {
        id: "receipt",
        label: "Print my visit receipt",
        hint: "ks-58",
        run: () => command("receipt"),
      },
      {
        id: "print",
        label: "Print this sheet",
        hint: "⌘P",
        run: () => window.setTimeout(() => window.print(), 50),
      },
      {
        id: "source",
        label: "View how this sheet is made",
        hint: sourceFile(pathname).replace(/^app\//, ""),
        run: () =>
          window.open(
            `${REPO}/blob/main/${sourceFile(pathname)}`,
            "_blank",
            "noopener"
          ),
      },
      {
        id: "ticket",
        label: "Go anywhere",
        hint: "⌘K",
        run: () => command("palette"),
      },
    ]

    return [
      ...(here.length ? [{ title: "here", items: here }] : []),
      { title: "this sheet", items: sheet },
    ]
  }, [spot, pathname, count, stamps.length, stamp])

  const choose = (it: Item) => {
    close()
    it.run()
  }

  const onKey = (e: React.KeyboardEvent) => {
    const items = [
      ...(slip.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []),
    ]
    const at = items.indexOf(document.activeElement as HTMLElement)
    const go = (i: number) =>
      items[(i + items.length) % items.length]?.focus({ preventScroll: true })
    if (e.key === "ArrowDown") go(at + 1)
    else if (e.key === "ArrowUp") go(at - 1)
    else if (e.key === "Home") go(0)
    else if (e.key === "End") go(items.length - 1)
    else if (e.key === "Escape") close()
    else if (e.key === "Tab") close(false)
    else return
    e.preventDefault()
  }

  // running index across groups, so the rows rise in one after another
  const offsets = groups.map((_, g) =>
    groups.slice(0, g).reduce((n, x) => n + x.items.length, 0)
  )

  return (
    <>
      {stamps.length > 0 &&
        createPortal(
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[54] h-0 overflow-x-clip print:hidden"
          >
            {stamps.map((s) => (
              <ProofStamp key={s.id} stamp={s} />
            ))}
          </div>,
          document.body
        )}

      {spot &&
        createPortal(
          <>
            {/* the registration mark on the spot, and the leader to the slip */}
            <svg
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-[71] h-full w-full text-brand"
            >
              {place && (
                <line
                  x1={spot.x}
                  y1={spot.y}
                  x2={place.cx}
                  y2={place.cy}
                  stroke="currentColor"
                  strokeWidth={1}
                  strokeDasharray="2 4"
                  className="fade-in"
                />
              )}
              <g className="fade-in" stroke="currentColor" strokeWidth={1}>
                <line x1={spot.x - 9} y1={spot.y} x2={spot.x + 9} y2={spot.y} />
                <line x1={spot.x} y1={spot.y - 9} x2={spot.x} y2={spot.y + 9} />
                <rect
                  x={spot.x - 3.5}
                  y={spot.y - 3.5}
                  width={7}
                  height={7}
                  fill="none"
                />
              </g>
            </svg>

            <div
              ref={slip}
              role="menu"
              aria-label="Mark-up slip"
              onKeyDown={onKey}
              className={cn(
                "fixed z-[72] max-h-[calc(100dvh-1rem)] w-80 overflow-y-auto border border-border bg-card font-mono text-xs shadow-2xl",
                place ? "rise-in" : "invisible"
              )}
              style={{ left: place?.left ?? 0, top: place?.top ?? 0 }}
            >
              <div className="flex items-center justify-between border-b border-dashed border-border px-3 py-2 text-muted-foreground">
                <span>
                  <span className="text-brand">{"// "}</span>mark-up
                </span>
                <span className="tabular-nums">
                  x {String(Math.round(spot.px)).padStart(4, "0")} · y{" "}
                  {String(Math.round(spot.py)).padStart(4, "0")}
                </span>
              </div>

              {groups.map((g, gi) => (
                <div
                  key={g.title}
                  role="group"
                  aria-label={g.title}
                  className="border-b border-dashed border-border py-1 last:border-b-0"
                >
                  <p
                    aria-hidden="true"
                    className="px-3 pt-1.5 pb-1 text-[10px] tracking-widest text-muted-foreground/70 uppercase"
                  >
                    {g.title}
                  </p>
                  {g.items.map((it, i) => (
                    <button
                      key={it.id}
                      type="button"
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => choose(it)}
                      onPointerMove={(e) =>
                        e.currentTarget.focus({ preventScroll: true })
                      }
                      style={{ "--i": offsets[gi] + i } as React.CSSProperties}
                      className="group rise-in flex w-full items-baseline gap-2.5 px-3 py-1.5 text-left outline-none focus:bg-accent"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 shrink-0 self-center bg-transparent group-focus:bg-brand"
                      />
                      <span className="shrink-0 font-sans text-sm text-foreground">
                        {it.label}
                      </span>
                      {it.hint && (
                        <span className="ml-auto min-w-0 truncate pl-2 text-muted-foreground">
                          {it.hint}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}

              <p className="border-t border-dashed border-border px-3 py-2 text-[10px] text-muted-foreground/70">
                shift + right-click for the browser&apos;s menu
              </p>
            </div>
          </>,
          document.body
        )}
    </>
  )
}

/** A rubber stamp pressed into the sheet, ink broken up by the dither. */
function ProofStamp({ stamp }: { stamp: Stamp }) {
  const date = new Date(stamp.id)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
    .toLowerCase()
  return (
    <div
      className="proof-stamp absolute"
      style={
        {
          left: stamp.x,
          top: stamp.y,
          "--rot": `${stamp.rot}deg`,
        } as React.CSSProperties
      }
    >
      <div className="border-2 border-brand px-3 py-1.5 text-center font-mono text-brand outline-1 outline-offset-2 outline-brand outline-solid">
        <p className="text-base font-semibold tracking-[0.25em] whitespace-nowrap uppercase">
          {stamp.word}
        </p>
        <p className="mt-0.5 flex justify-between gap-4 border-t border-brand pt-0.5 text-[10px] tracking-wider whitespace-nowrap tabular-nums">
          <span>k.s.</span>
          <span>{date}</span>
          <span>no. {String(stamp.no).padStart(2, "0")}</span>
        </p>
      </div>
    </div>
  )
}
