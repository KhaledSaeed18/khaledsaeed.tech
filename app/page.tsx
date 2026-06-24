import Link from "next/link"

import { ChevronField } from "@/components/chevron-field"
import { FlipLogo } from "@/components/flip-logo"
import { RollingText } from "@/components/rolling-text"
import { SocialLinks } from "@/components/social-links"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteConfig } from "@/lib/site"

export default function Page() {
  return (
    <main className="relative isolate min-h-svh overflow-hidden">
      {/* WebGL chevron field, full-bleed behind everything. Interactive on
          devices with a real pointer; a static backdrop on touch screens. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <ChevronField />
      </div>

      {/* Top bar: animated mark + theme toggle. */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          aria-label={`${siteConfig.name}, home`}
          className="inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <FlipLogo size={50} color="var(--brand)" mode="auto" />
        </Link>
        <ThemeToggle />
      </header>

      {/* Hero */}
      <section className="mx-auto flex min-h-svh max-w-6xl items-center px-6 py-28 sm:px-10">
        <div className="max-w-xl lg:max-w-2xl">
          <p className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs tracking-wide text-muted-foreground">
            <span className="text-brand">{siteConfig.role}</span>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <span>{siteConfig.location}</span>
          </p>

          <h1 className="font-heading text-5xl font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>

          <p className="mt-4 text-xl font-medium text-muted-foreground sm:text-2xl">
            <span className="text-foreground">I&apos;m a </span>
            <RollingText items={siteConfig.roles} />
          </p>

          <p className="mt-7 max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg">
            {siteConfig.intro}
          </p>

          <div className="mt-9 -ml-2">
            <SocialLinks />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute inset-x-0 bottom-0  z-20 flex items-center justify-between px-6 py-5 font-mono text-xs text-muted-foreground sm:px-10">
        <span/>
        <span>
          © {new Date().getFullYear()} {siteConfig.name}
        </span>
      </footer>
    </main>
  )
}
