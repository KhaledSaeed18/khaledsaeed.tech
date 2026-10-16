import type { Metadata } from "next"

import { PageIntro } from "@/components/print/page-intro"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { OnHand } from "@/components/press/on-hand"

export const metadata: Metadata = {
  title: "Press offline",
  description: "The pages this browser kept for reading offline.",
  alternates: { canonical: null },
  robots: { index: false, follow: false },
}

/**
 * Served by the service worker (public/sw.js) for a page that was never
 * printed to this browser, while the connection is down: the sheets it
 * does have, read from the cache.
 */
export default function OfflinePage() {
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "offline" }]}
        title="Off the wire"
        lede="The connection dropped before this sheet was printed to your browser. These ones were, and they read without a connection."
      />
      <div className="frame mt-24">
        <section aria-labelledby="on-hand">
          <SpecLabel index={1}>on hand</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="on-hand" className="sr-only">
            Sheets on hand
          </h2>
          <div className="mt-8">
            <OnHand />
          </div>
        </section>
      </div>
    </>
  )
}
