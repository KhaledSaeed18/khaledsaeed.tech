"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** Copies an address to the clipboard and says so for a moment. */
export function CopyEmail({
  address,
  className,
}: {
  address: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(id)
  }, [copied])

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(address)
          setCopied(true)
        } catch {
          window.location.href = `mailto:${address}`
        }
      }}
      className={cn(
        "inline-flex items-center gap-2 border border-border px-4 py-2.5 font-mono text-xs transition-colors hover:border-brand/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        copied ? "text-brand" : "text-muted-foreground",
        className
      )}
    >
      <span aria-live="polite">{copied ? "copied" : "copy address"}</span>
    </button>
  )
}
