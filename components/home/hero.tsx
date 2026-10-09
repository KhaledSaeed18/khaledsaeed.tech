import { CalendarCheckIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { DitherCharacter } from "@/components/dither-character"
import { SpecLabel } from "@/components/print/sheet"
import { SocialLinks } from "@/components/social-links"
import { siteConfig } from "@/lib/site"

/** The first sheet: the thesis, how I work, how to reach me, and the portrait. */
export function Hero() {
  return (
    <section aria-label="Introduction" className="relative isolate">
      <div className="mx-auto grid max-w-6xl items-center gap-y-6 px-6 pt-28 pb-8 sm:px-10 lg:min-h-svh lg:grid-cols-12 lg:gap-x-10 lg:py-20">
        <div className="lg:col-span-6">
          <SpecLabel>
            {siteConfig.role.toLowerCase()} /{" "}
            {siteConfig.location.toLowerCase()}
          </SpecLabel>

          <h1 className="mt-6 font-heading text-5xl leading-[1.02] font-medium tracking-tight text-balance sm:text-6xl 2xl:text-7xl">
            <span className="block whitespace-nowrap">{siteConfig.name}</span>
            <span className="text-muted-foreground">
              builds software that
            </span>{" "}
            <span className="text-brand">explains itself.</span>
          </h1>

          <p className="mt-7 text-base leading-relaxed text-muted-foreground sm:text-lg">
            I design and build products end to end: interfaces people enjoy
            using, backends that hold up in production, and the tooling in
            between. Some of it ships with a team, some of it stays private, and
            some of it I give away. All of it gets the same standard: clear
            behaviour, honest errors, and nothing left for the next person to
            guess.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-foreground px-4 py-2.5 font-mono text-xs tracking-wide text-background transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <HugeiconsIcon
                icon={CalendarCheckIcon}
                className="size-4"
                strokeWidth={1.6}
              />
              book a call
            </a>
            <SocialLinks />
          </div>
        </div>

        {/* Dithered self-portrait. Sits in its own column on large screens and
            below the text on small ones; purely decorative, input is read
            globally, so hovering any link lights him up. */}
        <DitherCharacter className="h-[min(110vw,520px)] w-full lg:col-span-6 lg:h-[min(86svh,760px)]" />
      </div>
    </section>
  )
}
