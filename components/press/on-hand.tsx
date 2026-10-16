"use client"

import * as React from "react"

import { sheetsOnHand } from "@/components/press/offline-press"

type Sheet = { href: string; title: string }

/** A kept page's own title, without the site's name after it. */
const titleOf = (html: string, href: string) => {
  const t = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ""
  const clean = t
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "’")
    .replace(/&quot;/g, '"')
    .split(" | ")[0]
    .trim()
  return clean || href
}

/** The sheets this browser has kept, read straight from the cache. */
export function OnHand() {
  const [sheets, setSheets] = React.useState<Sheet[] | null>(null)

  React.useEffect(() => {
    let live = true
    ;(async () => {
      const out: Sheet[] = []
      for (const req of await sheetsOnHand()) {
        const res = await caches.match(req)
        const url = new URL(req.url)
        const href = url.pathname + url.search
        out.push({ href, title: titleOf(res ? await res.text() : "", href) })
      }
      out.sort((a, b) => a.href.localeCompare(b.href))
      if (live) setSheets(out)
    })().catch(() => live && setSheets([]))
    return () => {
      live = false
    }
  }, [])

  if (sheets === null)
    return <p className="font-mono text-xs text-muted-foreground">counting…</p>
  if (!sheets.length)
    return (
      <p className="text-muted-foreground">
        Nothing is on hand in this browser yet. Pages are kept as you read them,
        once the site has loaded with a connection.
      </p>
    )
  return (
    <ul className="border-t border-dashed border-border">
      {sheets.map((s, k) => (
        <li
          key={s.href}
          className="rise-in border-b border-dashed border-border"
          style={{ "--i": k } as React.CSSProperties}
        >
          {/* a full load: the service worker serves it from the plates */}
          <a
            href={s.href}
            className="group flex items-baseline justify-between gap-6 py-4 transition-colors hover:text-brand"
          >
            <span className="text-lg">{s.title}</span>
            <span className="shrink-0 font-mono text-xs text-muted-foreground group-hover:text-brand">
              {s.href}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
