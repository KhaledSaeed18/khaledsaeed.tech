import { Sheet } from "@/components/print/sheet"
import { siteConfig, socialLinks } from "@/lib/site"

const email = socialLinks.find((l) => l.key === "email")!

/** The last sheet before the colophon: one address, one booking link. */
export function ContactSheet({ index = 4 }: { index?: number }) {
  return (
    <Sheet id="contact" index={index} label="contact">
      <div data-reveal className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="font-heading text-4xl font-medium tracking-tight text-balance sm:text-6xl">
            Say hello.
            <span className="text-muted-foreground"> I read everything.</span>
          </p>
          <a
            href={email.href}
            className="group mt-8 inline-flex items-baseline gap-3 font-mono text-base break-all text-foreground sm:text-xl"
          >
            <span className="underline decoration-border decoration-1 underline-offset-8 transition-colors group-hover:decoration-brand">
              {email.handle}
            </span>
          </a>
        </div>
        <div className="flex flex-col gap-3 font-mono text-xs lg:col-span-4 lg:items-end">
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-muted-foreground transition-colors hover:border-brand/40 hover:bg-accent hover:text-foreground"
          >
            book a call
          </a>
          <p className="text-muted-foreground">
            based in {siteConfig.location.toLowerCase()}
          </p>
        </div>
      </div>
    </Sheet>
  )
}
