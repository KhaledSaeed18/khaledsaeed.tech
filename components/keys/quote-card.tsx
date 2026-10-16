"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import {
  CopyGlyph,
  SaveGlyph,
  XGlyph,
  LinkedinGlyph,
} from "@/components/print/glyphs"
import { cn } from "@/lib/utils"
import { quoteQuery } from "@/lib/quote-text"
import { logVisit } from "@/lib/visit"

type Job = { text: string; from: string }

/** Ask for a quote card from anywhere (the right-click slip does). */
export const requestQuoteCard = (job: Job) =>
  window.dispatchEvent(new CustomEvent("ks:quote", { detail: job }))

const button =
  "group inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"

/**
 * The pull-quote proof. Selected words are set as a 1200x630 card by the
 * server (app/quote/card), which first checks they really are on the page,
 * and shown here as a proof with a share link. The link opens a page whose
 * preview on X, LinkedIn or a chat app is the card itself, and which leads
 * back to the passage, highlighted.
 */
export function QuoteCard() {
  const [job, setJob] = React.useState<Job | null>(null)
  const [state, setState] = React.useState<"setting" | "ready" | "refused">(
    "setting"
  )
  const [copied, setCopied] = React.useState(false)
  const closeRef = React.useRef<HTMLButtonElement>(null)

  const close = React.useCallback(() => {
    setJob(null)
    setCopied(false)
  }, [])

  React.useEffect(() => {
    const onQuote = (e: Event) => {
      setState("setting")
      setJob((e as CustomEvent<Job>).detail)
      logVisit("quotes")
    }
    window.addEventListener("ks:quote", onQuote)
    return () => window.removeEventListener("ks:quote", onQuote)
  }, [])

  React.useEffect(() => {
    if (!job) return
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    window.addEventListener("keydown", onKey)
    document.documentElement.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = ""
    }
  }, [job, close])

  React.useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(id)
  }, [copied])

  if (!job) return null

  const query = quoteQuery(job.text, job.from)
  const card = `/quote/card?${query}`
  const share = `${window.location.origin}/quote?${query}`
  const post = encodeURIComponent(share)

  const download = async () => {
    const res = await fetch(card)
    if (!res.ok) return
    const a = document.createElement("a")
    a.href = URL.createObjectURL(await res.blob())
    a.download = "khaledsaeed-quote.png"
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-background/80 backdrop-blur-sm fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pull-quote card"
        className="rise-in mx-auto my-[8vh] w-[min(46rem,calc(100%-2rem))] border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-dashed border-border px-4 py-2.5 font-mono text-xs text-muted-foreground">
          <span>
            <span className="text-brand">{"// "}</span>pull quote
          </span>
          <span aria-live="polite">
            {state === "setting"
              ? "setting type…"
              : state === "ready"
                ? "checked against the page"
                : "refused"}
          </span>
        </div>

        <div className="relative m-4 aspect-[1200/630] border border-border bg-background">
          {state !== "refused" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={card}
              src={card}
              alt={`Card: “${job.text}”`}
              onLoad={() => setState("ready")}
              onError={() => setState("refused")}
              className={cn(
                "absolute inset-0 h-full w-full transition-opacity duration-300",
                state === "ready" ? "opacity-100" : "opacity-0"
              )}
            />
          )}
          {state !== "ready" && (
            <p className="absolute inset-0 flex items-center justify-center p-8 text-center font-mono text-xs text-muted-foreground">
              {state === "setting"
                ? "setting type, and checking the words are on the page…"
                : "these words aren’t all on this page as printed, so there is no card for them. select a passage from the page itself."}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-border px-4 py-3 font-mono text-xs">
          <button
            type="button"
            disabled={state !== "ready"}
            onClick={() =>
              navigator.clipboard?.writeText(share).then(() => setCopied(true))
            }
            className={cn(
              button,
              copied && "text-brand",
              "disabled:opacity-40"
            )}
          >
            <CopyGlyph done={copied} className="size-4" />
            <span aria-live="polite">
              {copied ? "copied" : "copy share link"}
            </span>
          </button>
          <button
            type="button"
            disabled={state !== "ready"}
            onClick={download}
            className={cn(button, "disabled:opacity-40")}
          >
            <SaveGlyph className="size-4" />
            save card
          </button>
          <a
            href={`https://x.com/intent/post?url=${post}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={state !== "ready"}
            className={cn(
              button,
              state !== "ready" && "pointer-events-none opacity-40"
            )}
          >
            <XGlyph className="size-4" />
            post
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${post}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={state !== "ready"}
            className={cn(
              button,
              state !== "ready" && "pointer-events-none opacity-40"
            )}
          >
            <LinkedinGlyph className="size-4" />
            share
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className={cn(button, "ml-auto")}
          >
            close (esc)
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
