/*
 * The offline press. Every page read is kept as a printed sheet, and the main
 * pages are stocked while the browser is idle, so the site still reads when
 * the connection drops. A page that was never printed here gets /offline,
 * which lists the sheets on hand.
 *
 * Registered by components/press/offline-press.tsx as /sw.js?v=<commit>.
 * Each edition keeps its own caches and drops the last one's on activation,
 * so an old page never runs against a new edition's scripts.
 */

const EDITION = new URL(self.location.href).searchParams.get("v") || "dev"
const PAGES = `ks-${EDITION}-pages`
const STATIC = `ks-${EDITION}-static`
const OFFLINE = "/offline"
/** How long a page waits for the network before the kept sheet is shown. */
const PATIENCE = 4000

self.addEventListener("install", (event) => {
  // the offline sheet and the front page, with everything they are set with
  event.waitUntil(stock([OFFLINE, "/"], true).then(() => self.skipWaiting()))
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("ks-") && k !== PAGES && k !== STATIC)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  )
})

/** Pages and files the press never keeps: tooling and live endpoints. */
const passThrough = (url) =>
  url.pathname.startsWith("/_next/webpack-hmr") ||
  url.pathname.startsWith("/__nextjs") ||
  url.pathname.startsWith("/studio") ||
  url.pathname.startsWith("/_vercel")

/** Files whose names change with their contents: kept for good on first read. */
const hashed = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.startsWith("/_next/image")

/** Plain files: served from the cache, refreshed behind the reader's back. */
const asset = (url) =>
  /\.(png|jpe?g|webp|avif|gif|svg|ico|woff2?|vcf|txt|xml|webmanifest)$/.test(
    url.pathname
  ) || url.pathname.startsWith("/quote/card")

/** A page's cache key: its address, without the router's own parameters. */
const sheetKey = (url) => {
  const u = new URL(url)
  u.hash = ""
  u.searchParams.delete("_rsc")
  return u.href
}

const isPage = (res) =>
  res.ok &&
  res.type === "basic" &&
  (res.headers.get("content-type") || "").includes("text/html")

async function keep(cacheName, key, res) {
  const cache = await caches.open(cacheName)
  await cache.put(key, res)
}

/** Network first, the kept sheet if the network is down or slow, then /offline. */
async function page(event) {
  const key = sheetKey(event.request.url)
  const kept = await caches.match(key, { cacheName: PAGES })
  const fresh = fetch(event.request).then(async (res) => {
    if (isPage(res)) event.waitUntil(keep(PAGES, key, res.clone()))
    return res
  })
  // the kept copy only steps in if the network fails or dawdles
  const late = kept
    ? new Promise((resolve) => setTimeout(() => resolve(kept), PATIENCE))
    : null
  try {
    return await (late ? Promise.race([fresh, late]) : fresh)
  } catch {
    if (kept) return kept
    const offline = await caches.match(OFFLINE, { cacheName: PAGES })
    return (
      offline ||
      new Response("The press is offline.", {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8" },
      })
    )
  }
}

async function cacheFirst(request) {
  const hit = await caches.match(request, { cacheName: STATIC })
  if (hit) return hit
  const res = await fetch(request)
  if (res.ok && res.type === "basic") keep(STATIC, request, res.clone())
  return res
}

async function staleWhileRevalidate(event) {
  const hit = await caches.match(event.request, { cacheName: STATIC })
  const fresh = fetch(event.request)
    .then((res) => {
      if (res.ok && res.type === "basic")
        event.waitUntil(keep(STATIC, event.request, res.clone()))
      return res
    })
    .catch(() => hit || Response.error())
  return hit || fresh
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin || passThrough(url)) return

  if (request.mode === "navigate") return event.respondWith(page(event))
  // the router's data requests: offline, they fail and Next.js loads the
  // page in full, which comes back through page() above
  if (request.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) return
  if (hashed(url)) return event.respondWith(cacheFirst(request))
  if (asset(url)) return event.respondWith(staleWhileRevalidate(event))
})

/** Stock sheets the reader hasn't opened yet, a few at a time, when asked. */
async function stock(urls, fresh = false) {
  const cache = await caches.open(PAGES)
  for (const u of urls) {
    const key = sheetKey(new URL(u, self.location.origin).href)
    if (!fresh && (await cache.match(key))) continue
    try {
      const res = await fetch(key, {
        credentials: "same-origin",
        cache: fresh ? "reload" : "default",
      })
      if (!isPage(res)) continue
      await cache.put(key, res.clone())
      // and the scripts, styles and fonts it is set with
      const html = await res.text()
      const files = new Set(html.match(/\/_next\/static\/[^"'\s)\\]+/g) || [])
      for (const f of files) await cacheFirst(new Request(f)).catch(() => {})
    } catch {
      return
    }
  }
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "stock" && Array.isArray(event.data.urls))
    event.waitUntil(stock(event.data.urls.slice(0, 40)))
})
