import Link from "next/link"
import type * as React from "react"

import { Rule, SpecLabel } from "@/components/print/sheet"
import { formatDate } from "@/lib/format"
import { nav, siteConfig, socialLinks } from "@/lib/site"

/** When and from which commit this build was made (set in next.config.ts). */
const printed = new Date(process.env.BUILD_DATE as string)
const edition = process.env.BUILD_COMMIT ?? ""

/**
 * The back cover. Ends every page like the last sheet of a print run: a short
 * note, the usual links, a density strip (the 17 Bayer levels the site is
 * drawn with), and the name printed large and cut off by the page edge.
 */
export function SiteFooter() {
  return (
    <footer className="mt-32">
      <div className="frame">
        <SpecLabel>back cover</SpecLabel>
        <Rule className="mt-3" />

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="max-w-sm font-heading text-xl leading-snug font-medium tracking-tight text-balance sm:text-2xl">
              Full-stack engineer in Lebanon.{" "}
              <span className="text-muted-foreground">
                Interfaces, backends and the tooling in between, built to
                explain themselves.
              </span>
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
                    className="hit-area inline-block min-w-6 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    home
                  </Link>
                </li>
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="hit-area inline-block min-w-6 text-muted-foreground transition-colors hover:text-foreground"
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
                        className="hit-area inline-block min-w-6 text-muted-foreground transition-colors hover:text-foreground"
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
                    className="hit-area inline-block min-w-6 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    rss
                  </a>
                </li>
                <li>
                  <a
                    href="/llms.txt"
                    className="hit-area inline-block min-w-6 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    llms.txt
                  </a>
                </li>
                <li>
                  <a
                    href="/sitemap.xml"
                    className="hit-area inline-block min-w-6 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    sitemap
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <DensityStrip className="mt-14" />

        <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-xs text-muted-foreground sm:grid-cols-3">
          <span>
            © {printed.getFullYear()} {siteConfig.name}
          </span>
          <span className="hidden text-center sm:block">
            {edition ? (
              <>
                edition{" "}
                <a
                  href={`https://github.com/KhaledSaeed18/khaledsaeed.tech/commit/${edition}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hit-area text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
                >
                  {edition.slice(0, 7)}
                </a>
                ,{" "}
              </>
            ) : (
              "last printed "
            )}
            <time dateTime={printed.toISOString()}>
              {formatDate(printed.toISOString()).toLowerCase()}
            </time>
          </span>
          <a
            href="#content"
            className="hit-area justify-self-end transition-colors hover:text-foreground"
          >
            back to top
          </a>
        </div>

        <Wordmark className="mt-14" />
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
    </div>
  )
}

/**
 * The name set across the full width of the frame and cut off by the bottom
 * of the page, printed in a light dither. SVG so it fits the width exactly at
 * every size. Hovering inks it up: the dither thickens and the ink turns
 * terracotta, then it fades back when the pointer leaves.
 */
function Wordmark({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="wordmark overflow-hidden">
        <svg viewBox="0 0 1000 150" className="block w-full translate-y-[30%]">
          <text
            x="0"
            y="132"
            textLength="1000"
            lengthAdjust="spacing"
            fill="currentColor"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 168,
              fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            {siteConfig.name}
          </text>
        </svg>
      </div>
    </div>
  )
}
