"use client"

import * as React from "react"

/** The pages kept by public/sw.js, newest edition first. */
export async function sheetsOnHand(): Promise<Request[]> {
  if (!("caches" in window)) return []
  const names = (await caches.keys()).filter(
    (k) => k.startsWith("ks-") && k.endsWith("-pages")
  )
  const seen = new Set<string>()
  const out: Request[] = []
  for (const name of names)
    for (const req of await (await caches.open(name)).keys()) {
      const path = new URL(req.url).pathname
      if (path === "/offline" || seen.has(req.url)) continue
      seen.add(req.url)
      out.push(req)
    }
  return out
}

/** How long a reader stays before the main pages are stocked for offline. */
const STAY = 15000

const subscribe = (on: () => void) => {
  window.addEventListener("online", on)
  window.addEventListener("offline", on)
  return () => {
    window.removeEventListener("online", on)
    window.removeEventListener("offline", on)
  }
}

/**
 * The offline press: registers the service worker that keeps every page
 * read (public/sw.js), stocks the main pages while the browser is idle, and
 * says so when the connection drops: the press is reading from its plates.
 */
export function OfflinePress({
  edition,
  sheets,
}: {
  edition: string
  sheets: string[]
}) {
  const online = React.useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  )
  const [count, setCount] = React.useState<number | null>(null)

  // register once the page has settled, and stock the main pages when idle
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return
    let idle = 0
    const start = async () => {
      try {
        await navigator.serviceWorker.register(
          `/sw.js?v=${edition.slice(0, 7) || "local"}`,
          { scope: "/", updateViaCache: "none" }
        )
        const reg = await navigator.serviceWorker.ready
        const conn = (
          navigator as Navigator & {
            connection?: { saveData?: boolean; effectiveType?: string }
          }
        ).connection
        if (conn?.saveData || /2g/.test(conn?.effectiveType ?? "")) return
        const ask = () =>
          reg.active?.postMessage({ type: "stock", urls: sheets })
        // only for a reader who stayed: a quick visit costs nothing extra
        idle = window.setTimeout(() => {
          if (typeof window.requestIdleCallback === "function")
            idle = window.requestIdleCallback(ask, { timeout: 10000 })
          else ask()
        }, STAY)
      } catch {}
    }
    if (document.readyState === "complete") start()
    else window.addEventListener("load", start, { once: true })
    return () => {
      window.removeEventListener("load", start)
      if (typeof window.cancelIdleCallback === "function")
        window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
    }
  }, [edition, sheets])

  // count the sheets on hand when the wire goes down; say when it is back
  const [was, setWas] = React.useState(online)
  if (was !== online) {
    setWas(online)
    if (online) setCount(null)
  }
  React.useEffect(() => {
    if (online) return
    let live = true
    sheetsOnHand().then((s) => live && setCount(s.length))
    return () => {
      live = false
      if (!navigator.onLine) return
      window.dispatchEvent(
        new CustomEvent("ks:notice", { detail: "back on the wire" })
      )
    }
  }, [online])

  if (online) return null
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-[calc(4rem+1px)] z-40 border-b border-dashed border-border bg-background/95 font-mono text-xs text-muted-foreground fade-in"
    >
      <p className="frame flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
        <span>
          <span className="text-brand">{"// "}</span>press offline
        </span>
        <span>reading from the plates</span>
        {count !== null && (
          <a
            href="/offline"
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
          >
            {count} {count === 1 ? "sheet" : "sheets"} on hand
          </a>
        )}
      </p>
    </div>
  )
}
