import type { Metadata } from "next"

import { BreadcrumbJsonLd } from "@/components/json-ld"
import { PageIntro } from "@/components/print/page-intro"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { siteConfig, socialLinks } from "@/lib/site"
import { pageMeta } from "@/lib/metadata"

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "How to reach Khaled Saeed: email, a booked call, or any of the profiles listed here.",
  path: "/contact",
})

const email = socialLinks.find((l) => l.key === "email")!

export default function ContactPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "contact" }]}
        title="Say hello."
        lede="Email is the fastest way to reach me. For anything that needs a conversation, book a call."
      />

      <div className="frame mt-24 space-y-28">
        <section aria-labelledby="direct">
          <SpecLabel index={1}>direct</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="direct" className="sr-only">
            Direct contact
          </h2>
          <div data-reveal className="mt-8 space-y-6">
            <a
              href={email.href}
              className="block font-mono text-xl break-all underline decoration-border decoration-1 underline-offset-8 transition-colors hover:decoration-brand sm:text-3xl"
            >
              {email.handle}
            </a>
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-foreground px-4 py-2.5 font-mono text-xs text-background transition-opacity hover:opacity-85"
            >
              book a call
            </a>
          </div>
        </section>

        <section aria-labelledby="profiles">
          <SpecLabel index={2}>profiles</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="profiles" className="sr-only">
            Profiles
          </h2>
          <ul className="mt-4">
            {socialLinks
              .filter((l) => l.key !== "email")
              .map((l) => (
                <li
                  key={l.key}
                  data-reveal
                  className="border-b border-dashed border-border"
                >
                  <a
                    href={l.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="group flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="font-medium transition-colors group-hover:text-brand">
                      {l.label}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {l.handle}
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
