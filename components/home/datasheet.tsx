import type * as React from "react"

import { Pinout } from "@/components/home/pinout"
import { Sheet } from "@/components/print/sheet"
import { principles, stack } from "@/lib/content/profile"
import { siteConfig } from "@/lib/site"

/**
 * A component datasheet for a person: the operating principles as the
 * features list, and the stack drawn as the part's pin configuration. The
 * quad package needs the room, so the features sit above it until the
 * screen is wide enough to set them beside it.
 */
export function Datasheet({ index }: { index: number }) {
  return (
    <Sheet
      id="stack"
      index={index}
      label="datasheet"
      title="The stack, pin by pin."
      lede="TypeScript end to end, Swift when it belongs on the Mac, and whatever the problem actually needs underneath."
    >
      <div className="grid gap-16 xl:grid-cols-12 xl:gap-10">
        <section aria-labelledby="features" className="xl:col-span-4">
          <h3
            id="features"
            className="font-mono text-xs font-normal text-muted-foreground"
          >
            features
          </h3>
          <ol className="mt-6 grid border-t border-dashed border-border md:grid-cols-2 md:gap-x-10 xl:grid-cols-1">
            {principles.map((p, i) => (
              <li
                key={p.title}
                data-reveal
                style={{ "--reveal-delay": i } as React.CSSProperties}
                className="grid grid-cols-[2.25rem_1fr] border-b border-dashed border-border py-5"
              >
                <span className="pt-0.5 font-mono text-xs text-brand tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="pins" data-reveal className="xl:col-span-8">
          <h3
            id="pins"
            className="font-mono text-xs font-normal text-muted-foreground"
          >
            pin configuration
          </h3>
          <div className="mt-6">
            <Pinout
              layers={stack}
              rev={siteConfig.profileUpdatedAt.slice(0, 4)}
            />
          </div>
        </section>
      </div>
    </Sheet>
  )
}
