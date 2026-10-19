import type * as React from "react"

import type { Faq as FaqItem } from "@/lib/content/projects"

/**
 * Questions a reader is likely to ask, answered from the project's own
 * docs. Everything is in the page, nothing folded away: a search engine and
 * a person skimming both get the answers. The same pairs feed the FAQPage
 * structured data on the case study.
 */
export function Faq({ faq }: { faq: FaqItem[] }) {
  return (
    <dl className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
      {faq.map((f, i) => (
        <div
          key={f.q}
          data-reveal
          style={{ "--reveal-delay": i } as React.CSSProperties}
          className="bg-background p-6 sm:p-8 md:[&:last-child:nth-child(odd)]:col-span-2"
        >
          <dt className="font-medium text-pretty">{f.q}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {f.a}
          </dd>
        </div>
      ))}
    </dl>
  )
}
