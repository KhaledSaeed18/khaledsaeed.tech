import Link from "next/link"
import type * as React from "react"

import { ContributionGrid } from "@/components/open-source/contribution-grid"
import { Sheet } from "@/components/print/sheet"
import { contributions } from "@/lib/content/profile"
import { getCalendar, getProfile, getStars } from "@/lib/data/github"
import { formatCompact, formatNumber } from "@/lib/format"

/** Upstream fixes and a year of activity. Numbers are live, revalidated daily. */
export async function OpenSource() {
  const [stars, calendar, profile] = await Promise.all([
    getStars(contributions.map((c) => c.repo)),
    getCalendar(),
    getProfile(),
  ])
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0)
  const merged = contributions.reduce((n, c) => n + c.prs.length, 0)

  return (
    <Sheet
      id="open-source"
      index={3}
      label="open source"
      title="Fixes merged upstream."
      lede={`${merged} pull requests merged into libraries with ${formatCompact(totalStars)} combined stars, mostly the small, specific bugs that make a component feel broken on a phone.`}
      meta={
        <Link
          href="/open-source"
          className="transition-colors hover:text-foreground"
        >
          every pull request
        </Link>
      }
    >
      <ul className="border-t border-dashed border-border">
        {contributions.map((c, i) => (
          <li
            key={c.repo}
            data-reveal
            style={{ "--reveal-delay": i } as React.CSSProperties}
            className="border-b border-dashed border-border"
          >
            <a
              href={`https://github.com/${c.repo}/pulls?q=is%3Apr+author%3AKhaledSaeed18+is%3Amerged`}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-5 transition-colors sm:grid-cols-[14rem_1fr_auto]"
            >
              <span className="font-heading text-xl font-medium tracking-tight transition-colors group-hover:text-brand">
                {c.project}
              </span>
              <span className="col-span-2 row-start-2 text-sm text-muted-foreground sm:col-span-1 sm:col-start-2 sm:row-start-1">
                {c.blurb}
              </span>
              <span className="col-start-2 row-start-1 text-right font-mono text-xs whitespace-nowrap text-muted-foreground sm:col-start-3">
                {c.prs.length} merged / {formatCompact(stars[c.repo] ?? 0)}{" "}
                stars
              </span>
            </a>
          </li>
        ))}
      </ul>

      {calendar && (
        <div
          data-reveal
          className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-4">
            <p className="font-mono text-xs text-muted-foreground">
              last 12 months on github
            </p>
            <dl className="mt-5 grid grid-cols-3 gap-6 lg:grid-cols-1 lg:gap-5">
              <Stat
                label="contributions"
                value={formatNumber(calendar.total)}
              />
              <Stat
                label="public repositories"
                value={formatNumber(profile.publicRepos)}
              />
              <Stat label="followers" value={formatNumber(profile.followers)} />
            </dl>
          </div>
          <ContributionGrid
            calendar={calendar}
            className="lg:col-span-8 lg:justify-self-end"
          />
        </div>
      )}
    </Sheet>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-heading text-3xl font-medium tracking-tight tabular-nums">
        {value}
      </dd>
    </div>
  )
}
