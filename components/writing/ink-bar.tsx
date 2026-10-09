"use client"

import * as React from "react"

/**
 * Reading progress for an article: a thin terracotta line under the
 * masthead that fills as the article body scrolls past. Measures the body,
 * not the page, so it reads 100% at the last paragraph, not the footer.
 */
export function InkBar({ target }: { target: string }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const body = document.getElementById(target)
    const bar = ref.current
    if (!body || !bar) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = body.getBoundingClientRect()
      const span = r.height - window.innerHeight * 0.6
      const done = span > 0 ? (window.innerHeight * 0.4 - r.top) / span : 1
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, done))})`
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", queue, { passive: true })
    window.addEventListener("resize", queue)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", queue)
      window.removeEventListener("resize", queue)
    }
  }, [target])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-x-0 top-[calc(4rem+1px)] z-50 h-0.5 origin-left bg-brand"
      // transform, not Tailwind's scale-x (that is the separate `scale`
      // property, which would multiply with this and pin the bar at 0)
      style={{ transform: "scaleX(0)" }}
    />
  )
}
