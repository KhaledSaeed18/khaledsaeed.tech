import Image from "next/image"
import type * as React from "react"

import type { Screen } from "@/lib/content/projects"

/**
 * The product as it runs: captured screens in hairline cells, numbered like
 * the rest of the sheet. The first screen and an odd last one span the full
 * width.
 */
export function Screens({
  slug,
  screens,
}: {
  slug: string
  screens: Screen[]
}) {
  return (
    <ol className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
      {screens.map((s, i) => (
        <li
          key={s.src}
          data-reveal
          style={{ "--reveal-delay": i % 4 } as React.CSSProperties}
          className="bg-background p-4 first:col-span-full sm:p-6 md:[&:last-child:nth-child(even)]:col-span-2"
        >
          <figure>
            <Image
              src={`/work/${slug}/${s.src}.png`}
              alt={`${s.title}: ${s.caption}`}
              width={2880}
              height={1800}
              sizes={i === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
              className="block border border-border"
            />
            <figcaption className="mt-4 flex gap-4">
              <span className="font-mono text-xs text-brand tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block font-medium">{s.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {s.caption}
                </span>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  )
}
