/**
 * The visit log behind the receipt. Everything stays in this browser:
 * this visit in sessionStorage (one tab, gone when it closes), and only a
 * visit count, the first visit's date and a receipt counter in localStorage.
 * Nothing is sent anywhere.
 */

export type Visit = {
  start: number
  /** one entry per page, in the order first read */
  pages: { path: string; title: string; ms: number }[]
  /** CSS pixels scrolled, both directions */
  scroll: number
  /** seconds spent on each section, keyed "path|section" */
  stops: Record<string, number>
  /** things done: right-clicks, stamps, keys, copies, loupe... */
  counts: Record<string, number>
}

export type History = { visits: number; first: number; receipts: number }

const VISIT = "ks:visit"
const HISTORY = "ks:history"

export const emptyVisit = (): Visit => ({
  start: Date.now(),
  pages: [],
  scroll: 0,
  stops: {},
  counts: {},
})

function read<T>(store: Storage, key: string): T | null {
  try {
    const raw = store.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(store: Storage, key: string, value: unknown) {
  try {
    store.setItem(key, JSON.stringify(value))
  } catch {
    // private mode or full storage: the receipt just shows less
  }
}

export const readVisit = () => read<Visit>(sessionStorage, VISIT)
export const saveVisit = (v: Visit) => write(sessionStorage, VISIT, v)

export const readHistory = (): History =>
  read<History>(localStorage, HISTORY) ?? {
    visits: 1,
    first: Date.now(),
    receipts: 0,
  }
export const saveHistory = (h: History) => write(localStorage, HISTORY, h)

/** Note that something happened, for the receipt's tally. */
export const logVisit = (what: string) =>
  window.dispatchEvent(new CustomEvent("ks:log", { detail: what }))

/** 42s, 2m 14s, 1h 02m. */
export function duration(ms: number) {
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, "0")}s`
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`
}

/** CSS pixels to paper: 96 px to the inch, 25.4 mm to the inch. */
export function paper(px: number) {
  const mm = (px / 96) * 25.4
  return mm < 1000 ? `${Math.round(mm)} mm` : `${(mm / 1000).toFixed(2)} m`
}
