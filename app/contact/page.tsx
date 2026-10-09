import type { Metadata } from "next"

import type * as React from "react"

import { LocalTime } from "@/components/contact/local-time"
import { Postcard } from "@/components/home/contact-sheet"
import { BreadcrumbJsonLd } from "@/components/json-ld"
import { PageIntro } from "@/components/print/page-intro"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { LinkIcon } from "@/components/social-links"
import { socialLinks } from "@/lib/site"
import { pageMeta } from "@/lib/metadata"

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "How to reach Khaled Saeed: email, a booked call, or any of the profiles listed here.",
  path: "/contact",
})

/** What each profile is for, so the directory tells you where to go. */
const notes: Record<string, string> = {
  github: "code, releases and pull requests",
  linkedin: "certifications and updates",
  x: "short notes",
  devto: "long-form articles",
  instagram: "life away from the editor",
  discord: "a direct message",
}

export default function ContactPage() {
  const profiles = socialLinks.filter((l) => l.key !== "email")
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "contact" }]}
        title="Contact"
        lede="One address, one booking link, and everywhere else I can be found."
      />

      <div className="frame mt-24 space-y-28">
        <section aria-labelledby="reply-card">
          <SpecLabel index={1}>reply card</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="reply-card" className="sr-only">
            Email and booking
          </h2>
          <div className="mt-10">
            <Postcard />
          </div>
        </section>

        <section aria-labelledby="directory">
          <div className="flex items-end justify-between gap-6">
            <SpecLabel index={2}>directory</SpecLabel>
            <span className="font-mono text-xs text-muted-foreground">
              <LocalTime />
            </span>
          </div>
          <Rule className="mt-3" />
          <h2 id="directory" className="sr-only">
            Profiles
          </h2>
          <ul className="mt-4">
            {profiles.map((l, i) => (
              <li
                key={l.key}
                data-reveal
                style={{ "--reveal-delay": i } as React.CSSProperties}
                className="border-b border-dashed border-border"
              >
                <a
                  href={l.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="group grid grid-cols-[1.25rem_1fr_auto] items-baseline gap-x-4 py-5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:grid-cols-[1.25rem_auto_1fr_auto]"
                >
                  <LinkIcon
                    link={l}
                    className="size-4 translate-y-0.5 self-center text-muted-foreground transition-colors group-hover:text-brand"
                  />
                  <span className="font-heading text-xl font-medium tracking-tight transition-colors group-hover:text-brand sm:text-2xl">
                    {l.label}
                  </span>
                  {/* leader dots, like a printed directory */}
                  <span
                    aria-hidden="true"
                    className="hidden min-w-6 translate-y-[-0.3em] self-end border-b border-dotted border-muted-foreground/40 transition-colors group-hover:border-brand/60 sm:block"
                  />
                  <span className="text-right">
                    <span className="block font-mono text-sm text-foreground">
                      {l.handle}
                    </span>
                    <span className="mt-0.5 hidden font-mono text-xs text-muted-foreground sm:block">
                      {notes[l.key]}
                    </span>
                  </span>
                  <span className="col-span-2 col-start-2 mt-1 font-mono text-xs text-muted-foreground sm:hidden">
                    {notes[l.key]}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
    </>
  )
}
