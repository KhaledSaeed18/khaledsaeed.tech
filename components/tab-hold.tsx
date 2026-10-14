"use client"

import * as React from "react"

/**
 * Lines the tab shows while it sits in the background. Press-room voice:
 * the run is paused, the plate is still inked, nothing is lost.
 */
const HOLD = [
  "press paused",
  "plate still inked",
  "holding your place",
  "run paused mid-sheet",
  "the proof is still wet",
  "rails idle",
]

/** Once the ink has dried the line settles into this one. */
const LATE = "ink's dry. still here."

/**
 * The ink, as an ASCII ramp. Each step the ramp shifts one tone lighter, the
 * way a dithered edge fades: full, then the shades, then paper. Plain ASCII
 * because tab strips draw the Unicode shade blocks as identical grey boxes.
 */
const RAMP = "#=-."
const INK_WIDTH = 6
const DRY_STEP_MS = 15_000

function ink(step: number) {
  // step 0: #=-..., 1: =-...., 2: -....., 3: ...... (paper).
  const tones = RAMP.slice(Math.min(step, RAMP.length - 1))
  return tones.padEnd(INK_WIDTH, tones.at(-1)).slice(0, INK_WIDTH)
}

/**
 * Swaps the tab title for a dithered press-room line while the tab is hidden
 * and puts the real title back the moment it is visible again.
 *
 * Nothing runs on the server or at first paint, so crawlers, link previews
 * and history entries see the real title. The restore only happens if the
 * title is still the one we set, so a route change while hidden wins.
 */
export function TabHold() {
  React.useEffect(() => {
    let saved: string | null = null
    let set: string | null = null
    let timer: number | undefined
    const still =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false

    const put = (line: string) => {
      set = line
      document.title = line
    }

    const hide = () => {
      if (saved !== null) return
      saved = document.title
      const line = HOLD[Math.floor(Math.random() * HOLD.length)]
      let step = 0
      put(`${ink(step)} ${line}`)
      if (still) return
      const dry = () => {
        if (document.title !== set) return
        step += 1
        const last = step >= RAMP.length
        put(`${ink(step)} ${last ? LATE : line}`)
        if (!last) timer = window.setTimeout(dry, DRY_STEP_MS)
      }
      timer = window.setTimeout(dry, DRY_STEP_MS)
    }

    const show = () => {
      window.clearTimeout(timer)
      if (saved !== null && document.title === set) document.title = saved
      saved = null
      set = null
    }

    const onChange = () => (document.hidden ? hide() : show())

    document.addEventListener("visibilitychange", onChange)
    window.addEventListener("pageshow", show)
    return () => {
      document.removeEventListener("visibilitychange", onChange)
      window.removeEventListener("pageshow", show)
      show()
    }
  }, [])

  return null
}
