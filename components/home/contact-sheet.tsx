import type * as React from "react"

import { CopyEmail } from "@/components/home/copy-email"
import { FlipLogo } from "@/components/flip-logo"
import { Sheet } from "@/components/print/sheet"
import { siteConfig, socialLinks } from "@/lib/site"

const email = socialLinks.find((l) => l.key === "email")!

/** Ink that went through the press: a flat tone broken up by the dither. */
const inked = (level: number) =>
  ({
    maskImage: `var(--dither-${level})`,
    WebkitMaskImage: `var(--dither-${level})`,
    maskSize: "var(--dither-tile)",
    WebkitMaskSize: "var(--dither-tile)",
  }) as React.CSSProperties

/**
 * The last sheet before the colophon, set as a reply postcard: the message
 * on the left, the address on ruled lines on the right, with a stamp and a
 * postmark in the corner. Used on the home page, about and case studies.
 */
export function ContactSheet({ index = 4 }: { index?: number }) {
  return (
    <Sheet id="contact" index={index} label="contact">
      <div data-reveal className="grid perforated lg:grid-cols-2">
        {/* message side */}
        <div className="flex flex-col justify-between gap-10 p-6 sm:p-10">
          <div>
            <p className="font-heading text-4xl font-medium tracking-tight text-balance sm:text-5xl">
              Say hello.
              <span className="text-muted-foreground"> I read everything.</span>
            </p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Email is the fastest way to reach me. For anything that needs a
              conversation, book a call.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-foreground px-4 py-2.5 font-mono text-xs text-background transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              book a call
            </a>
            <CopyEmail address={email.handle} />
          </div>
        </div>

        {/* address side */}
        <div className="relative border-t border-dashed border-border p-6 sm:p-10 lg:border-t-0 lg:rule-v">
          <div className="flex items-start justify-between gap-6">
            <p className="pt-1 font-mono text-xs text-muted-foreground">to</p>
            <Stamp />
          </div>

          <dl className="mt-8 space-y-0 sm:mt-10">
            <AddressLine label="name">{siteConfig.name}</AddressLine>
            <AddressLine label="email">
              <a
                href={email.href}
                className="break-all transition-colors hover:text-brand"
              >
                {email.handle}
              </a>
            </AddressLine>
            <AddressLine label="country">{siteConfig.location}</AddressLine>
          </dl>
        </div>
      </div>
    </Sheet>
  )
}

/** One handwritten line on the card: the value sits on a dotted rule. */
function AddressLine({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-dashed border-border py-3">
      <dt className="sr-only">{label}</dt>
      <dd className="font-mono text-base text-foreground sm:text-lg">
        {children}
      </dd>
    </div>
  )
}

/**
 * A postage stamp with square perforations, a dithered terracotta field and
 * the K mark, cancelled by a postmark in broken ink.
 */
function Stamp() {
  const year = new Date().getFullYear()
  return (
    <div aria-hidden="true" className="relative mr-2 shrink-0">
      <div className="stamp relative h-24 w-20 bg-foreground p-1.5 sm:h-28 sm:w-24">
        <div className="relative flex h-full flex-col justify-between bg-[var(--stock-terracotta)] p-1.5">
          <div
            className="dither-tone absolute inset-0 text-[var(--ink-terracotta)]"
            style={{ "--tone": "var(--dither-3)" } as React.CSSProperties}
          />
          <span className="relative w-fit bg-[var(--stock-terracotta)] px-0.5 py-px font-mono text-[9px] leading-none text-[var(--ink-terracotta)]">
            lb
          </span>
          <span className="relative self-center">
            <FlipLogo
              size={34}
              color="var(--ink-terracotta)"
              mode="k"
              label=""
            />
          </span>
          <span className="relative self-end bg-[var(--stock-terracotta)] px-0.5 py-px font-mono text-[9px] leading-none text-[var(--ink-terracotta)]">
            {year}
          </span>
        </div>
      </div>

      {/* postmark: a square cancel with bars, slightly off true */}
      <div
        className="absolute bottom-2 -left-16 z-10 flex -rotate-6 items-center gap-2 text-foreground/80"
        style={inked(11)}
      >
        <div className="border border-current px-2 py-1 font-mono text-[9px] leading-tight whitespace-nowrap">
          posted from
          <br />
          lebanon {year}
        </div>
        <div className="flex flex-col gap-1">
          <span className="block h-px w-16 bg-current" />
          <span className="block h-px w-16 bg-current" />
          <span className="block h-px w-16 bg-current" />
        </div>
      </div>
    </div>
  )
}
