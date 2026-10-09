import { CalendarCheckIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { DitherCharacter } from "@/components/dither-character"
import { SpecLabel } from "@/components/print/sheet"
import { SocialLinks } from "@/components/social-links"
import { getProject } from "@/lib/content/projects"
import { siteConfig } from "@/lib/site"

/**
 * Questions people kept asking, and the project that answers each one. Set
 * like the index of a printed booklet. Every claim here is backed by the
 * project's case study, so keep them in sync when either changes.
 */
const answers = [
  { q: "who can read this row?", slug: "patchgrid" },
  { q: "where does this token break?", slug: "jwt-toolkit" },
  { q: "why won't this process die?", slug: "sever" },
  { q: "why is this Mac still awake?", slug: "wakehold" },
  { q: "what is eating my disk?", slug: "dir-analysis-tool" },
].map((a) => ({ ...a, project: getProject(a.slug)! }))

/** The first sheet: the thesis, the proof, how to reach me, and the portrait. */
export function Hero() {
  return (
    <section aria-label="Introduction" className="relative isolate">
      <div className="mx-auto grid max-w-6xl items-center gap-y-6 px-6 pt-28 pb-8 sm:px-10 lg:min-h-svh lg:grid-cols-12 lg:gap-x-10 lg:py-20">
        <div className="lg:col-span-7">
          <SpecLabel>
            {siteConfig.role.toLowerCase()} /{" "}
            {siteConfig.location.toLowerCase()}
          </SpecLabel>

          <h1 className="mt-6 font-heading text-5xl leading-[1.02] font-medium tracking-tight text-balance sm:text-6xl 2xl:text-7xl">
            {siteConfig.name}{" "}
            <span className="text-muted-foreground">builds software that</span>{" "}
            <span className="text-brand">explains itself.</span>
          </h1>

          <p className="mt-7 text-base leading-relaxed text-muted-foreground sm:text-lg">
            I work across the whole stack in TypeScript, from the database rules
            up to the last pixel, and in Swift when a tool belongs on my own
            Mac. Most of it started as a question I got tired of asking:
          </p>

          <ol className="mt-6 border-t border-dashed border-border font-mono text-xs sm:text-sm">
            {answers.map(({ q, project }) => (
              <li
                key={project.slug}
                className="border-b border-dashed border-border"
              >
                <Link
                  href={`/work/${project.slug}`}
                  aria-label={`${q} ${project.name}: ${project.tagline}`}
                  className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="whitespace-nowrap text-foreground/85 transition-colors group-hover:text-foreground">
                    {q}
                  </span>
                  {/* leader dots, like a table of contents */}
                  <span
                    aria-hidden="true"
                    className="min-w-6 flex-1 translate-y-[-0.2em] self-end border-b border-dotted border-muted-foreground/40 transition-colors group-hover:border-brand/60"
                  />
                  <span className="ml-auto flex items-center gap-2 whitespace-nowrap text-muted-foreground transition-colors group-hover:text-brand">
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0"
                      style={{
                        backgroundColor: `var(--stock-${project.stock})`,
                      }}
                    />
                    {project.name}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
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
            globally, so hovering any link on the left lights him up. */}
        <DitherCharacter className="h-[min(100vw,460px)] w-full lg:col-span-5 lg:h-[min(76svh,620px)]" />
      </div>
    </section>
  )
}
