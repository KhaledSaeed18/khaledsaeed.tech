import Link from "next/link"
import type * as React from "react"

import { Rule, SpecLabel } from "@/components/print/sheet"
import { nav, siteConfig, socialLinks } from "@/lib/site"

/**
 * The colophon. Ends every page like the last sheet of a print run: a density
 * strip (the 17 Bayer levels the whole site is drawn with), press notes and
 * the usual links.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-32 pb-10">
      <div className="frame">
        <SpecLabel>colophon</SpecLabel>
        <Rule className="mt-3" />

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-heading text-2xl font-medium tracking-tight">
              {siteConfig.name}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Set in Hanken Grotesk, Geist and JetBrains Mono. The portrait is
              raymarched in a fragment shader and printed through a 4x4 Bayer
              matrix. Built with Next.js.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 font-mono text-xs md:col-span-7 md:grid-cols-3"
          >
            <div>
              <p className="text-muted-foreground/85">pages</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    home
                  </Link>
                </li>
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground/85">elsewhere</p>
              <ul className="mt-3 space-y-2">
                {socialLinks
                  .filter((l) => l.key !== "email")
                  .map((l) => (
                    <li key={l.key}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label.toLowerCase()}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground/85">feeds</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="/writing/rss.xml"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    rss
                  </a>
                </li>
                <li>
                  <a
                    href="/llms.txt"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    llms.txt
                  </a>
                </li>
                <li>
                  <a
                    href="/sitemap.xml"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    sitemap
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <DensityStrip className="mt-14" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
          <span>
            © {year} {siteConfig.name}
          </span>
          <span>printed in {siteConfig.location.toLowerCase()}</span>
        </div>
      </div>
    </footer>
  )
}

/** A printer's control strip: brand swatches, then all 17 dither densities. */
function DensityStrip({ className }: { className?: string }) {
  const swatches = ["bg-foreground", "bg-[var(--stone)]", "bg-brand", "bg-teal"]
  return (
    <div aria-hidden="true" className={className}>
      <div className="flex h-5 items-stretch gap-px overflow-hidden">
        {swatches.map((s) => (
          <span key={s} className={`w-8 shrink-0 ${s}`} />
        ))}
        <span className="w-3 shrink-0" />
        {Array.from({ length: 17 }, (_, k) => (
          <span
            key={k}
            className="dither-tone min-w-0 flex-1 text-foreground"
            style={{ "--tone": `var(--dither-${k})` } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground/60">
        <span>ink / stone / terracotta / teal</span>
        <span>0 to 16 of 16, bayer 4x4</span>
      </div>
    </div>
  )
}
