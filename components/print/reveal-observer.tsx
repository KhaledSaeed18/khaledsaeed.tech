"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

/**
 * One IntersectionObserver for the whole site. Any element with `data-reveal`
 * fades in (see app/dither.css) the first time it scrolls into view, so
 * server components can opt in with an attribute instead of a client wrapper.
 *
 * Only content below the fold is ever hidden: whatever is on screen when a
 * page loads stays painted, so the reveal never delays the largest paint.
 * Re-scans after every navigation and for content streamed in later.
 */
export function RevealObserver() {
  const pathname = usePathname()

  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.removeAttribute("data-pending")
          e.target.setAttribute("data-shown", "")
          io.unobserve(e.target)
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    )
    const scan = () =>
      document
        .querySelectorAll("[data-reveal]:not([data-shown]):not([data-static])")
        .forEach((el) => {
          // left pending by a previous page (the footer survives navigation)
          if (el.hasAttribute("data-pending")) return io.observe(el)
          const r = el.getBoundingClientRect()
          if (r.top < window.innerHeight && r.bottom > 0) {
            // already on screen: leave it painted
            el.setAttribute("data-static", "")
            return
          }
          el.setAttribute("data-pending", "")
          io.observe(el)
        })
    scan()
    // content streamed in after the first paint
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
