import type { Metadata } from "next"
import Link from "next/link"
import type * as React from "react"

import { BreadcrumbJsonLd } from "@/components/json-ld"
import { ContributionGrid } from "@/components/open-source/contribution-grid"
import { PageIntro } from "@/components/print/page-intro"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { contributions } from "@/lib/content/profile"
import { projects } from "@/lib/content/projects"
import {
  getCalendar,
  getMyStars,
  getProfile,
  getStars,
} from "@/lib/data/github"
import { formatCompact, formatNumber } from "@/lib/format"
import { pageMeta } from "@/lib/metadata"

export const metadata: Metadata = pageMeta({
  title: "Open source",
  description:
    "Khaled Saeed's merged pull requests to React Bits, Magic UI, NoScript and Svelte Bits, plus personal open source projects and a year of GitHub activity.",
  path: "/open-source",
})

export default async function OpenSourcePage() {
  const [stars, mine, calendar, profile] = await Promise.all([
    getStars(contributions.map((c) => c.repo)),
    getMyStars(),
    getCalendar(),
    getProfile(),
  ])
  const merged = contributions.reduce((n, c) => n + c.prs.length, 0)
  const own = [...projects].sort(
    (a, b) => (mine[b.repo] ?? 0) - (mine[a.repo] ?? 0)
  )

  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "open source" }]}
        title="Open source"
        lede="Upstream fixes in libraries other people depend on, and everything I build, published in the open."
        meta={`${merged} merged upstream`}
      />

      <div className="mx-auto mt-24 max-w-6xl space-y-28 px-6 sm:px-10">
        {calendar && (
          <section aria-labelledby="activity">
            <SpecLabel index={1}>activity</SpecLabel>
            <Rule className="mt-3" />
            <h2 id="activity" className="sr-only">
              GitHub activity
            </h2>
            <div data-reveal className="mt-10 grid gap-10">
              <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  [
                    "contributions, last 12 months",
                    formatNumber(calendar.total),
                  ],
                  ["public repositories", formatNumber(profile.publicRepos)],
                  ["followers", formatNumber(profile.followers)],
                  ["on github since", String(profile.since)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-xs text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="mt-1 font-heading text-4xl font-medium tracking-tight tabular-nums">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <ContributionGrid calendar={calendar} />
            </div>
          </section>
        )}

        <section aria-labelledby="upstream">
          <SpecLabel index={2}>merged upstream</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="upstream" className="sr-only">
            Merged pull requests
          </h2>
          <div className="mt-4">
            {contributions.map((c, i) => (
              <div
                key={c.repo}
                data-reveal
                style={{ "--reveal-delay": i } as React.CSSProperties}
                className="grid gap-6 border-b border-dashed border-border py-10 md:grid-cols-12"
              >
                <div className="md:col-span-4">
                  <a
                    href={`https://github.com/${c.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-heading text-2xl font-medium tracking-tight transition-colors hover:text-brand"
                  >
                    {c.project}
                  </a>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {c.repo} / {formatCompact(stars[c.repo] ?? 0)} stars
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {c.blurb}
                  </p>
                </div>
                <ul className="space-y-3 md:col-span-8">
                  {c.prs.map((pr) => (
                    <li key={pr.number}>
                      <a
                        href={`https://github.com/${c.repo}/pull/${pr.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid grid-cols-[4.5rem_3rem_1fr] items-baseline gap-3 rounded-md py-1"
                      >
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          #{pr.number}
                        </span>
                        <span
                          className={`font-mono text-xs ${pr.kind === "feat" ? "text-teal" : "text-brand"}`}
                        >
                          {pr.kind}
                        </span>
                        <span className="transition-colors group-hover:text-foreground">
                          {pr.title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="own">
          <SpecLabel index={3}>my own repositories</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="own" className="sr-only">
            My open source projects
          </h2>
          <ul className="mt-4 grid gap-x-10 md:grid-cols-2">
            {own.map((p) => (
              <li key={p.slug} className="border-b border-dashed border-border">
                <Link
                  href={`/work/${p.slug}`}
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <span>
                    <span className="font-medium transition-colors group-hover:text-brand">
                      {p.name}
                    </span>
                    <span className="ml-3 text-sm text-muted-foreground">
                      {p.kind.toLowerCase()}
                    </span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {mine[p.repo] ? `${formatNumber(mine[p.repo])} stars` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Open source", path: "/open-source" },
        ]}
      />
    </>
  )
}
