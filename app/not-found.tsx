import type { Metadata } from "next"
import Link from "next/link"

import { Rule, SpecLabel } from "@/components/print/sheet"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 sm:px-10 sm:pt-40">
      <SpecLabel>error 404</SpecLabel>
      <Rule className="mt-3" />
      <p
        aria-hidden="true"
        className="mt-12 font-heading text-[clamp(7rem,28vw,18rem)] leading-none font-medium tracking-tighter"
        style={{
          maskImage: "var(--dither-9)",
          WebkitMaskImage: "var(--dither-9)",
          maskSize: "var(--dither-tile)",
          WebkitMaskSize: "var(--dither-tile)",
        }}
      >
        404
      </p>
      <h1 className="mt-6 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
        This sheet never made it to print.
      </h1>
      <p className="mt-4 max-w-prose text-muted-foreground">
        The page you are looking for moved or never existed. Everything that did
        get printed is one click away.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs">
        <Link
          href="/"
          className="rounded-lg bg-foreground px-4 py-2.5 text-background transition-opacity hover:opacity-85"
        >
          back home
        </Link>
        <Link
          href="/work"
          className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          see the work
        </Link>
      </div>
    </div>
  )
}
