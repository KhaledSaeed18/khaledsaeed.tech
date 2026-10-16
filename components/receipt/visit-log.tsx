"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

import {
  emptyVisit,
  readHistory,
  readVisit,
  saveHistory,
  saveVisit,
  type Visit,
} from "@/lib/visit"

/** True while the user is typing, so their words are not counted as keys. */
const typing = (t: EventTarget | null) => {
  const el = t as HTMLElement | null
  return (
    !!el?.tagName &&
    (el.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))
  )
}

/** The section at the middle of the screen, by its label. */
function sectionInView() {
  const el = document
    .elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
    ?.closest("section[aria-labelledby], section[aria-label]")
  if (!el) return ""
  // the section's spec label ("// 02 experience") is the short name
  const spec = [...el.querySelectorAll("p")].find(
    (p) => p.firstElementChild?.textContent === "//"
  )
  const short = spec?.lastElementChild?.textContent?.trim()
  if (short && spec?.childElementCount && spec.childElementCount > 1)
    return short.toLowerCase()
  const by = el.getAttribute("aria-labelledby")
  const label = by
    ? document.getElementById(by)?.textContent
    : el.getAttribute("aria-label")
  return label?.trim().toLowerCase() ?? ""
}

/**
 * Keeps the visit log the receipt is printed from: time on each page (only
 * while the tab is visible), paper scrolled, the section read longest, and a
 * tally of right-clicks, stamps, keys and copies. No UI; nothing leaves the
 * browser.
 */
export function VisitLog() {
  const pathname = usePathname()
  const visit = React.useRef<Visit | null>(null)

  // open this visit's log, or start one and count the visit
  React.useEffect(() => {
    const open = readVisit()
    if (open) {
      visit.current = open
      return
    }
    visit.current = emptyVisit()
    const h = readHistory()
    // a stored history means this browser has been here before
    if (localStorage.getItem("ks:history")) h.visits += 1
    saveHistory(h)
    saveVisit(visit.current)
  }, [])

  // a page is read: open its line on the receipt
  React.useEffect(() => {
    const v = visit.current ?? readVisit()
    if (!v) return
    if (!v.pages.some((p) => p.path === pathname))
      v.pages.push({ path: pathname, title: document.title, ms: 0 })
    saveVisit(v)
  }, [pathname])

  // the clock, the paper and the tally
  React.useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const v = visit.current
      if (!v) return
      v.scroll += Math.abs(window.scrollY - lastY)
      lastY = window.scrollY
    }
    const count = (what: string) => {
      const v = visit.current
      if (v) v.counts[what] = (v.counts[what] ?? 0) + 1
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || typing(e.target)) return
      if (e.key.length === 1 || e.key === "Escape") count("keys")
    }
    const onMenu = () => count("right-clicks")
    const onLog = (e: Event) => count((e as CustomEvent<string>).detail)
    const onNotice = (e: Event) =>
      (e as CustomEvent<string>).detail.startsWith("copied") && count("copies")

    const tick = window.setInterval(() => {
      const v = visit.current
      if (!v || document.visibilityState !== "visible") return
      const path = window.location.pathname
      const page = v.pages.find((p) => p.path === path)
      if (page) {
        page.ms += 1000
        page.title = document.title
      }
      const stop = sectionInView()
      if (stop) {
        const key = `${path}|${stop}`
        v.stops[key] = (v.stops[key] ?? 0) + 1
      }
      saveVisit(v)
    }, 1000)
    const flush = () => visit.current && saveVisit(visit.current)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("keydown", onKey)
    window.addEventListener("contextmenu", onMenu)
    window.addEventListener("ks:log", onLog)
    window.addEventListener("ks:notice", onNotice)
    window.addEventListener("pagehide", flush)
    document.addEventListener("visibilitychange", flush)
    window.addEventListener("ks:receipt-read", flush)
    return () => {
      window.clearInterval(tick)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("contextmenu", onMenu)
      window.removeEventListener("ks:log", onLog)
      window.removeEventListener("ks:notice", onNotice)
      window.removeEventListener("pagehide", flush)
      document.removeEventListener("visibilitychange", flush)
      window.removeEventListener("ks:receipt-read", flush)
    }
  }, [])

  return null
}
