"use client"

import * as React from "react"

const ZONE = "Asia/Beirut"

function read() {
  const now = new Date()
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(now)
  const offset =
    new Intl.DateTimeFormat("en-US", {
      timeZone: ZONE,
      timeZoneName: "shortOffset",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")
      ?.value.replace("GMT", "utc") ?? ""
  return `${time}, ${offset}`
}

/**
 * The time in Beirut, in the visitor's browser. Renders a placeholder on the
 * server so the static page never ships a stale time, then ticks each minute.
 */
export function LocalTime() {
  const [text, setText] = React.useState<string | null>(null)
  React.useEffect(() => {
    const tick = () => setText(read())
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      beirut {text ?? "--:--"}
    </span>
  )
}
