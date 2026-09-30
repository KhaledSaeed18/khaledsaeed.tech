import type * as React from "react"

import { Sheet } from "@/components/print/sheet"
import { principles, stack } from "@/lib/content/profile"

/**
 * A component datasheet for a person: the stack by layer on the left, and the
 * operating principles as numbered specs on the right.
 */
export function Datasheet() {
  return (
    <Sheet
      id="stack"
      index={2}
      label="datasheet"
      title="The stack, layer by layer."
      lede="TypeScript end to end, Swift when it belongs on the Mac, and whatever the problem actually needs underneath."
    >
      <div className="grid gap-16 lg:grid-cols-12">
        <dl className="lg:col-span-7">
          {stack.map((row, i) => (
            <div
              key={row.layer}
              data-reveal
              style={{ "--reveal-delay": i } as React.CSSProperties}
              className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 border-b border-dashed border-border py-4 first:pt-0 sm:grid-cols-[9rem_1fr]"
            >
              <dt className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="dither-tone size-3 shrink-0 text-brand"
                  style={
                    {
                      "--tone": `var(--dither-${16 - i * 2})`,
                    } as React.CSSProperties
                  }
                />
                {row.layer.toLowerCase()}
              </dt>
              <dd className="flex flex-wrap gap-x-3 gap-y-1 text-base text-foreground">
                {row.items.map((item, k) => (
                  <span key={item} className="whitespace-nowrap">
                    {item}
                    {k < row.items.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="ml-3 text-muted-foreground/40"
                      >
                        /
                      </span>
                    )}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <ol className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-7">
          {principles.map((p, i) => (
            <li
              key={p.title}
              data-reveal
              style={{ "--reveal-delay": i } as React.CSSProperties}
              className="grid grid-cols-[2.25rem_1fr]"
            >
              <span className="font-mono text-xs text-brand tabular-nums">
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
      </div>
    </Sheet>
  )
}
