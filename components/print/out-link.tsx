import type * as React from "react"

/**
 * A small mono button that opens an outside page in a new tab: an issuer's
 * credential page, a certificate scan. `context` is read to screen readers
 * only, so a row of similar buttons says what each one is for.
 */
export function OutLink({
  href,
  context,
  children,
}: {
  href: string
  context: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center border border-border bg-secondary px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {children}
      <span className="sr-only"> {context}, opens in a new tab</span>
    </a>
  )
}
