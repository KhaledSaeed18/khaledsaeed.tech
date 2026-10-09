import type { Metadata } from "next"

import { Misprint } from "@/components/misprint/misprint"
import { Suggestions } from "@/components/misprint/suggestions"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { siteRoutes } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page moved or never existed.",
  alternates: { canonical: null },
  robots: { index: false, follow: true },
}

/**
 * The misprint: a 404 that came off the press out of register. Fix the
 * plates if you like; the closest real pages are listed underneath.
 */
export default async function NotFound() {
  const routes = await siteRoutes()
  return (
    <div className="frame pt-32 sm:pt-40">
      <SpecLabel>error 404 / misprint</SpecLabel>
      <Rule className="mt-3" />
      <div className="mt-12 overflow-hidden pb-2">
        <Misprint text="404" />
      </div>
      <h1 className="mt-12 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
        This sheet never made it to print.
      </h1>
      <p className="mt-4 text-muted-foreground">
        The page you are looking for moved or never existed. While you are here,
        the press could use a hand.
      </p>
      <div className="mt-12">
        <Suggestions routes={routes} />
      </div>
    </div>
  )
}
