"use client"

import { usePathname, useRouter } from "next/navigation"
import * as React from "react"
import { createPortal } from "react-dom"

import { fuzzyScore } from "@/components/keys/fuzzy"
import type { SiteRoute } from "@/lib/routes"
import { cn } from "@/lib/utils"

type Item = {
  id: string
  label: string
  kind: string
  hint?: string
  run: () => void
}

/** `g` then one of these, within a second, goes to that page. */
const GOTO: Record<string, string> = {
  h: "/",
  w: "/work",
  a: "/about",
  r: "/writing",
  c: "/contact",
}

const LEGEND: [string[], string][] = [
  [["⌘", "K"], "open the job ticket (also /)"],
  [["g", "h"], "home"],
  [["g", "w"], "work"],
  [["g", "a"], "about"],
  [["g", "r"], "writing"],
  [["g", "c"], "contact"],
  [["j", "k"], "next and previous item in a list"],
  [["p"], "proof mode: grid, frame and type"],
  [["⌘", "P"], "print the one-page résumé"],
  [["?"], "this legend"],
  [["esc"], "close"],
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

/**
 * The keyboard layer: a command palette styled as a print job ticket,
 * g-key navigation, j/k through lists, a key legend and proof mode. One
 * global listener; nothing here runs until a key is pressed.
 */
export function KeyboardLayer({
  routes,
  email,
  bookingUrl,
}: {
  routes: SiteRoute[]
  email: string
  bookingUrl: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = React.useState<"palette" | "legend" | null>(null)
  const [proof, setProof] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [active, setActive] = React.useState(0)
  const [notice, setNotice] = React.useState("")
  const pending = React.useRef<{ key: string; at: number } | null>(null)
  const input = React.useRef<HTMLInputElement>(null)
  const list = React.useRef<HTMLUListElement>(null)

  const close = React.useCallback(() => {
    setOpen(null)
    setQuery("")
    setActive(0)
  }, [])

  const actions: Item[] = React.useMemo(
    () => [
      {
        id: "copy-email",
        label: "Copy email address",
        kind: "action",
        hint: email,
        run: () => {
          navigator.clipboard?.writeText(email).then(
            () => setNotice(`copied ${email}`),
            () => (window.location.href = `mailto:${email}`)
          )
        },
      },
      {
        id: "book",
        label: "Book a call",
        kind: "action",
        hint: "cal.com",
        run: () => window.open(bookingUrl, "_blank", "noopener"),
      },
      {
        id: "print",
        label: "Print the one-page résumé",
        kind: "action",
        hint: "⌘P",
        run: () => window.setTimeout(() => window.print(), 50),
      },
      {
        id: "vcard",
        label: "Save contact card",
        kind: "action",
        hint: ".vcf",
        run: () => {
          // a download, not a page: click a real download link
          const a = document.createElement("a")
          a.href = "/khaled-saeed.vcf"
          a.download = "khaled-saeed.vcf"
          a.click()
        },
      },
      {
        id: "proof",
        label: "Toggle proof mode",
        kind: "action",
        hint: "p",
        run: () => setProof((v) => !v),
      },
      {
        id: "keys",
        label: "Show keyboard shortcuts",
        kind: "action",
        hint: "?",
        run: () => window.setTimeout(() => setOpen("legend"), 0),
      },
      {
        id: "source",
        label: "View this site's source",
        kind: "action",
        hint: "github",
        run: () =>
          window.open(
            "https://github.com/KhaledSaeed18/khaledsaeed.tech",
            "_blank",
            "noopener"
          ),
      },
    ],
    [email, bookingUrl]
  )

  const items: Item[] = React.useMemo(() => {
    const pages: Item[] = routes.map((r) => ({
      id: r.href,
      label: r.label,
      kind: r.kind,
      hint: r.href,
      run: () => router.push(r.href),
    }))
    if (!query.trim())
      return [...pages.filter((p) => p.kind === "page"), ...actions]
    return [...pages, ...actions]
      .map((it) => ({
        it,
        s: Math.max(
          fuzzyScore(query, it.label),
          fuzzyScore(query, it.hint ?? "") - 50
        ),
      }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.it)
  }, [routes, actions, query, router])

  const choose = (it: Item) => {
    close()
    it.run()
  }

  // the one global listener
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => (o === "palette" ? null : "palette"))
        return
      }
      if (e.key === "Escape") {
        if (open) close()
        else if (proof) setProof(false)
        return
      }
      if (open || mod || e.altKey || typing(e)) return

      const now = Date.now()
      const g = pending.current
      if (g && g.key === "g" && now - g.at < 1000 && GOTO[e.key]) {
        e.preventDefault()
        pending.current = null
        router.push(GOTO[e.key])
        return
      }
      pending.current = e.key === "g" ? { key: "g", at: now } : null

      if (e.key === "/") {
        e.preventDefault()
        setOpen("palette")
      } else if (e.key === "?") {
        e.preventDefault()
        setOpen("legend")
      } else if (e.key === "p") {
        setProof((v) => !v)
      } else if (e.key === "j" || e.key === "k") {
        const nav = [
          ...document.querySelectorAll<HTMLElement>("[data-nav-item]"),
        ].filter((el) => el.getClientRects().length)
        if (!nav.length) return
        e.preventDefault()
        const at = nav.indexOf(document.activeElement as HTMLElement)
        const next =
          at < 0
            ? e.key === "j"
              ? 0
              : nav.length - 1
            : Math.min(
                nav.length - 1,
                Math.max(0, at + (e.key === "j" ? 1 : -1))
              )
        nav[next].focus({ preventScroll: true })
        nav[next].scrollIntoView({ block: "center", behavior: "smooth" })
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, proof, close, router])

  // focus the field when the ticket opens; lock the page behind it
  React.useEffect(() => {
    if (!open) return
    if (open === "palette") input.current?.focus()
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  // keep the highlighted row in view
  React.useEffect(() => {
    list.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [active])

  // the copied-email notice clears itself
  React.useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(""), 2200)
    return () => window.clearTimeout(id)
  }, [notice])

  // a ticket number that changes per visit to a page
  const ticket = React.useMemo(
    () =>
      String(
        (pathname.split("").reduce((n, c) => n * 31 + c.charCodeAt(0), 7) %
          9000) +
          1000
      ),
    [pathname]
  )

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm fade-in"
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          {open === "palette" ? (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Job ticket: go anywhere on the site"
              className="rise-in mx-auto mt-[12vh] w-[min(40rem,calc(100%-2rem))] border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-dashed border-border px-4 py-2.5 font-mono text-xs text-muted-foreground">
                <span>
                  <span className="text-brand">{"// "}</span>job ticket
                </span>
                <span className="tabular-nums">no. {ticket}</span>
              </div>
              <input
                ref={input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || (e.ctrlKey && e.key === "n")) {
                    e.preventDefault()
                    setActive((a) => Math.min(items.length - 1, a + 1))
                  } else if (
                    e.key === "ArrowUp" ||
                    (e.ctrlKey && e.key === "p")
                  ) {
                    e.preventDefault()
                    setActive((a) => Math.max(0, a - 1))
                  } else if (e.key === "Enter" && items[active]) {
                    e.preventDefault()
                    choose(items[active])
                  }
                }}
                placeholder="where to? pages, projects, writing, actions"
                aria-label="Search pages, projects, writing and actions"
                aria-controls="ticket-results"
                aria-activedescendant={
                  items[active] ? `ticket-${active}` : undefined
                }
                className="w-full bg-transparent px-4 py-4 text-lg outline-none placeholder:text-muted-foreground/60"
              />
              <ul
                ref={list}
                id="ticket-results"
                role="listbox"
                className="max-h-[50vh] overflow-y-auto border-t border-dashed border-border py-1"
              >
                {items.length === 0 && (
                  <li className="px-4 py-6 font-mono text-xs text-muted-foreground">
                    nothing on file for “{query}”
                  </li>
                )}
                {items.map((it, i) => (
                  <li
                    key={it.id}
                    id={`ticket-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={() => choose(it)}
                    className={cn(
                      "flex cursor-pointer items-baseline gap-3 px-4 py-2.5",
                      i === active && "bg-accent"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 shrink-0 translate-y-[-0.1em] self-center",
                        i === active ? "bg-brand" : "bg-transparent"
                      )}
                    />
                    <span className="min-w-[45%] flex-1 truncate">
                      {it.label}
                    </span>
                    <span className="hidden max-w-[40%] min-w-0 truncate font-mono text-xs text-muted-foreground sm:inline">
                      {it.hint}
                    </span>
                    <span className="w-14 shrink-0 text-right font-mono text-xs text-muted-foreground/70">
                      {it.kind}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-dashed border-border px-4 py-2.5 font-mono text-xs text-muted-foreground">
                <span>↑↓ move</span>
                <span>↵ open</span>
                <span>esc close</span>
                <span className="ml-auto">? keys</span>
              </div>
            </div>
          ) : (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Keyboard shortcuts"
              className="rise-in mx-auto mt-[12vh] w-[min(34rem,calc(100%-2rem))] border border-border bg-card p-6 shadow-2xl"
            >
              <p className="font-mono text-xs text-muted-foreground">
                <span className="text-brand">{"// "}</span>key legend
              </p>
              <dl className="mt-5 grid gap-y-3">
                {LEGEND.map(([keys, what]) => (
                  <div key={what} className="flex items-center gap-4">
                    <dt className="flex w-24 shrink-0 gap-1.5">
                      {keys.map((k) => (
                        <kbd
                          key={k}
                          className="inline-flex h-7 min-w-7 items-center justify-center border border-border px-1.5 font-mono text-xs text-foreground"
                        >
                          {k}
                        </kbd>
                      ))}
                    </dt>
                    <dd className="text-sm text-muted-foreground">{what}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      )}

      {proof && <ProofMode onExit={() => setProof(false)} />}

      {notice && (
        <p
          role="status"
          className="rise-in fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 border border-border bg-card px-4 py-2.5 font-mono text-xs text-brand"
        >
          {notice}
        </p>
      )}
    </>
  )
}

type TypeTag = { top: number; left: number; text: string; w: number; h: number }

/**
 * Proof mode: the designer's proof over the live page. The 12-column grid
 * inside the frame, the frame's own numbers, and every heading outlined
 * with its real typeface, size, line height and weight.
 */
function ProofMode({ onExit }: { onExit: () => void }) {
  const pathname = usePathname()
  const [tags, setTags] = React.useState<TypeTag[]>([])
  const [frame, setFrame] = React.useState("")

  React.useEffect(() => {
    const measure = () => {
      const rails = document.querySelector(".rails")?.getBoundingClientRect()
      const content = document.querySelector("main .frame")
      const px = (v: string) => Math.round(parseFloat(v))
      if (content) {
        const cs = getComputedStyle(content)
        setFrame(
          `frame ${Math.round(content.getBoundingClientRect().width)}px / pad ${px(cs.paddingLeft)}px / gutter ${Math.round(rails?.left ?? 0)}px`
        )
      }
      const next: TypeTag[] = []
      document
        .querySelectorAll<HTMLElement>(
          "main h1, main h2:not(.sr-only), main h3:not(.sr-only), main p.font-heading"
        )
        .forEach((el) => {
          const r = el.getBoundingClientRect()
          if (!r.width || !r.height) return
          const cs = getComputedStyle(el)
          const family = cs.fontFamily.split(",")[0].replace(/["']/g, "")
          next.push({
            top: r.top + window.scrollY,
            left: r.left + window.scrollX,
            w: r.width,
            h: r.height,
            text: `${family} ${px(cs.fontSize)}/${px(cs.lineHeight) || "normal"} ${cs.fontWeight}`,
          })
        })
      setTags(next)
    }
    const id = window.setTimeout(measure, 0)
    window.addEventListener("resize", measure)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener("resize", measure)
    }
  }, [pathname])

  return createPortal(
    <>
      {/* the grid, fixed to the viewport, inside the frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[56] fade-in"
      >
        <div className="frame grid h-full grid-cols-4 gap-x-6 sm:grid-cols-12 lg:gap-x-10">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-full border-x border-dashed border-brand/40 bg-brand/[0.06]",
                i >= 4 && "hidden sm:block"
              )}
            />
          ))}
        </div>
      </div>

      {/* type labels, in document coordinates */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-[57] w-full fade-in"
      >
        {tags.map((t, i) => (
          <div
            key={i}
            className="absolute outline outline-1 outline-offset-2 outline-brand/70 outline-dashed"
            style={{ top: t.top, left: t.left, width: t.w, height: t.h }}
          >
            <span className="absolute -top-6 left-0 bg-brand px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-brand-foreground">
              {t.text}
            </span>
          </div>
        ))}
      </div>

      {/* the readout */}
      <div className="rise-in fixed bottom-6 left-1/2 z-[58] flex -translate-x-1/2 items-center gap-4 border border-brand/50 bg-card px-4 py-2.5 font-mono text-xs whitespace-nowrap">
        <span className="text-brand">proof mode</span>
        <span className="hidden text-muted-foreground sm:inline">
          12 columns / {frame}
        </span>
        <button
          type="button"
          onClick={onExit}
          className="hit-area text-foreground underline decoration-border underline-offset-4 hover:decoration-brand"
        >
          exit (p)
        </button>
      </div>
    </>,
    document.body
  )
}
