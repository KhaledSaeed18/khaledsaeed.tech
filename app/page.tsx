import { CalendarCheckIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { DitherCharacter } from "@/components/dither-character"
import { FlipLogo } from "@/components/flip-logo"
import { RollingText } from "@/components/rolling-text"
import { SocialLinks } from "@/components/social-links"
import { siteConfig } from "@/lib/site"

export default function Page() {
  return (
    <main className="relative isolate min-h-svh overflow-hidden">
      {/* Top bar: animated mark. */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center px-6 py-5 sm:px-10">
        <Link
          href="/"
          aria-label={`${siteConfig.name}, home`}
          className="inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <FlipLogo size={50} color="var(--brand)" mode="auto" />
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl items-center px-6 pt-28 pb-8 sm:px-10 lg:min-h-svh lg:py-28">
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

          <p className="mt-7 max-w-prose text-base lg:max-w-[40vw] xl:max-w-prose leading-relaxed text-muted-foreground sm:text-lg">
            {siteConfig.intro}
          </p>

          <div className="mt-9 -ml-2">
            <SocialLinks />
          </div>

          <div className="mt-5">
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-secondary inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:border-brand/40 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <HugeiconsIcon
                icon={CalendarCheckIcon}
                className="size-4 transition-colors group-hover:text-brand"
                strokeWidth={1.6}
              />
              Book a call
            </a>
          </div>
        </div>
      </section>

      {/* Dithered self-portrait. Sits beside the content on large screens and
          below it on small ones; purely decorative, input is read globally. */}
      <DitherCharacter className="h-[min(100vw,480px)] mb-12 w-full lg:absolute lg:mb-0 lg:right-0 lg:bottom-0 lg:-z-10 lg:h-[94svh] lg:w-[52vw]" />

      {/* Footer */}
      <footer className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-6 py-5 font-mono text-xs text-muted-foreground sm:px-10">
        <span>
          © {new Date().getFullYear()} {siteConfig.name}
        </span>
        <span className="hidden lg:inline">click me to wave</span>
      </footer>
    </main>
  )
}
