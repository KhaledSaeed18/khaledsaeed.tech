"use client"

import * as React from "react"

declare global {
  interface Window {
    colophon?: () => void
    __consoleProof?: boolean
  }
}

/** The K mark at 1 bit: stem, a gap, then the chevron. */
const MARK = [
  "██      ██",
  "██     ██ ",
  "██    ██  ",
  "██   ██   ",
  "██  ██    ",
  "██   ██   ",
  "██    ██  ",
  "██     ██ ",
  "██      ██",
]

/** The puzzle: these bytes spell a page that is not linked anywhere. */
const SECRET = "/register"

const mono = "font-family: ui-monospace, Menlo, monospace; font-size: 12px;"
const ink = `${mono} color: #d9634a; line-height: 1;`
const dim = `${mono} color: #a6a09a;`
const bone = `${mono} color: #ebe7e1;`

/**
 * A press proof for whoever opens DevTools: the mark, a note, a colophon()
 * command and a small puzzle. Printed once per visit, never in a way that
 * gets in the way of debugging.
 */
export function ConsoleProof() {
  React.useEffect(() => {
    if (window.__consoleProof) return
    window.__consoleProof = true

    const edition = (process.env.BUILD_COMMIT ?? "").slice(0, 7)
    const bytes = [...SECRET]
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ")

    window.colophon = () => {
      const rows: [string, string][] = [
        ["frame", "80rem, dotted rails, full-width rules, registration marks"],
        ["dither", "one 4x4 Bayer lattice, 17 tones, used as a texture"],
        [
          "portrait",
          "a signed distance field raymarched in one fragment shader",
        ],
        [
          "objects",
          "16-frame 1-bit sprites rendered from SDFs in a dev studio",
        ],
        ["type", "Hanken Grotesk, Geist, JetBrains Mono"],
        ["stack", "Next.js 16, React 19, Tailwind CSS 4, TypeScript"],
        ["scores", "Lighthouse 99 / 100 / 100 / 100 on real throttling"],
        ["edition", edition || "local"],
      ]
      console.log(
        rows.map(([k, v]) => `%c${k.padEnd(10)}%c${v}`).join("\n"),
        ...rows.flatMap(() => [dim, bone])
      )
    }

    console.log(`%c${MARK.join("\n")}`, ink)
    console.log(
      "%c// khaledsaeed.tech / the back room\n\n" +
        "%cYou opened the console, so you are probably an engineer. Hello.\n\n" +
        "%ccolophon()%c   how this site is put together\n" +
        "%c" +
        bytes +
        "%c   8 bits a letter; visit what it spells\n\n" +
        "%cThe fastest way to reach me is still contact@khaledsaeed.tech",
      dim,
      bone,
      ink,
      dim,
      ink,
      dim,
      dim
    )
  }, [])

  return null
}
