"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

/**
 * One IntersectionObserver for the whole site. Any element with `data-reveal`
 * dissolves in (see app/dither.css) the first time it scrolls into view, so
 * server components can opt in with an attribute instead of a client wrapper.
 * Re-scans after every navigation.
 */
export function RevealObserver() {
  const pathname = usePathname()

  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute("data-shown", "")
          io.unobserve(e.target)
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    )
    const scan = () =>
      document
        .querySelectorAll("[data-reveal]:not([data-shown])")
        .forEach((el) => io.observe(el))
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
