"use client"

import Link from "next/link"
import * as React from "react"

export type Route = { href: string; label: string; kind: string }

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "")

function lev(a: string, b: string) {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]
    d[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j]
      d[j] = Math.min(
        d[j] + 1,
        d[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
      prev = tmp
    }
  }
  return d[b.length]
}

/** How alike two strings are, 0 to 1, with a lift for one containing the other. */
function likeness(a: string, b: string) {
  if (!a || !b) return 0
  const base = 1 - lev(a, b) / Math.max(a.length, b.length)
  return Math.min(1, base + (a.includes(b) || b.includes(a) ? 0.35 : 0))
}

/**
 * The 404's useful half: the real pages closest to the address that was
 * asked for, by edit distance on the whole path and on its last segment.
 */
const noop = () => () => {}

export function Suggestions({ routes }: { routes: Route[] }) {
  // The 404 is prerendered once, without the address that failed, so read it
  // in the browser only; the server pass shows the fallback links.
  const path = React.useSyncExternalStore(
    noop,
    () => window.location.pathname,
    () => ""
  )
  const whole = norm(path)
  const last = norm(path.split("/").filter(Boolean).pop() ?? "")

  const ranked = routes
    .map((r) => {
      const slug = norm(r.href.split("/").filter(Boolean).pop() ?? "")
      const score = Math.max(
        likeness(whole, norm(r.href)),
        likeness(last, slug),
        likeness(last, norm(r.label))
      )
      return { ...r, score }
    })
    .filter((r) => r.score > 0.45 && r.href !== "/")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const list =
    path && ranked.length
      ? ranked
      : routes.filter((r) => r.href === "/" || r.href === "/work")

  return (
    <div>
      <p className="font-mono text-xs text-muted-foreground">
        {path && ranked.length
          ? "closest sheets to what you asked for"
          : "start here"}
      </p>
      <ul className="mt-3 border-t border-dashed border-border">
        {list.map((r) => (
          <li key={r.href} className="border-b border-dashed border-border">
            <Link
              href={r.href}
              className="group flex items-baseline gap-4 py-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="font-heading text-xl font-medium tracking-tight transition-colors group-hover:text-brand sm:text-2xl">
                {r.label}
              </span>
              <span
                aria-hidden="true"
                className="hidden min-w-6 flex-1 translate-y-[-0.3em] self-end border-b border-dotted border-muted-foreground/40 sm:block"
              />
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {r.href}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
