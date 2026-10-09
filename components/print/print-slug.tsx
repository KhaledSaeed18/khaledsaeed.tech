"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

/**
 * The slug line at the foot of the printed résumé: which page it was
 * printed from and when. The date is filled in at print time.
 */
export function PrintSlug({ edition }: { edition: string }) {
  const path = usePathname()
  const date = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const stamp = () => {
      if (date.current)
        date.current.textContent = new Date()
          .toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
          .toLowerCase()
    }
    stamp()
    window.addEventListener("beforeprint", stamp)
    return () => window.removeEventListener("beforeprint", stamp)
  }, [])

  return (
    <>
      proof printed from khaledsaeed.tech{path === "/" ? "" : path}
      {edition && <>, edition {edition}</>}, <span ref={date} />
    </>
  )
}
