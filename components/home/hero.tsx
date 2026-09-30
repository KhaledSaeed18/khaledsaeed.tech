import { CalendarCheckIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { DitherCharacter } from "@/components/dither-character"
import { RollingText } from "@/components/rolling-text"
import { SocialLinks } from "@/components/social-links"
import { siteConfig } from "@/lib/site"

/** The first sheet: who, what, how to reach me, and the portrait. */
export function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="relative isolate overflow-hidden lg:min-h-svh"
    >
      <div className="mx-auto flex max-w-6xl items-center px-6 pt-28 pb-8 sm:px-10 lg:min-h-svh lg:py-28">
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

          <p className="mt-7 max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg lg:max-w-[40vw] xl:max-w-prose">
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
              className="group inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:border-brand/40 hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
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
      </div>

      {/* Dithered self-portrait. Sits beside the content on large screens and
          below it on small ones; purely decorative, input is read globally. */}
      <DitherCharacter className="mb-12 h-[min(100vw,480px)] w-full lg:absolute lg:right-0 lg:bottom-0 lg:-z-10 lg:mb-0 lg:h-[94svh] lg:w-[52vw]" />
      <p className="absolute right-6 bottom-6 hidden font-mono text-xs text-muted-foreground sm:right-10 lg:block">
        click me to wave
      </p>
    </section>
  )
}
