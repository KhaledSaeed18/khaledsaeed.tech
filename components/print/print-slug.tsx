"use client"

import * as React from "react"

/**
 * The slug line at the foot of the printed résumé: which page it was
 * printed from and when. The date is filled in at print time.
 */
const noop = () => () => {}

export function PrintSlug({ edition }: { edition: string }) {
  // read in the browser: a prerendered page (like the 404) does not know
  // the address it will be shown at
  const path = React.useSyncExternalStore(
    noop,
    () => window.location.pathname,
    () => "/"
  )
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
