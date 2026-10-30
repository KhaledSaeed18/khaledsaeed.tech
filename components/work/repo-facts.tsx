import type * as React from "react"

import type { LatestRelease, RepoFacts as Facts } from "@/lib/data/github"
import { formatDate, formatNumber } from "@/lib/format"

/**
 * The repository as GitHub reports it, refreshed daily: stars, forks,
 * license, primary language, the latest release and the last push. Rendered
 * only when the fetch succeeded, so an outage leaves a gap instead of a
 * wrong number. The release cell is what keeps a case study's version
 * current without a copy change: tag the repository and the site follows.
 */
export function RepoFacts({
  repo,
  facts,
  release,
}: {
  repo: string
  facts: Facts
  release?: LatestRelease | null
}) {
  const cells: [string, React.ReactNode][] = [
    ["stars", formatNumber(facts.stars)],
    ["forks", formatNumber(facts.forks)],
    ...(facts.license
      ? ([["license", facts.license]] as [string, string][])
      : []),
    ...(facts.language
      ? ([["language", facts.language]] as [string, string][])
      : []),
    ...(release
      ? ([
          [
            release.tagOnly ? "latest tag" : "latest release",
            <a
              key="release"
              href={release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hit-area underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
            >
              {release.tag}
              {release.publishedAt && (
                <span className="text-muted-foreground">
                  {" "}
                  {formatDate(release.publishedAt).toLowerCase()}
                </span>
              )}
            </a>,
          ],
        ] as [string, React.ReactNode][])
      : []),
    ["last push", formatDate(facts.pushedAt).toLowerCase()],
  ]
  return (
    <div>
      <p className="flex items-baseline justify-between gap-4 font-mono text-xs text-muted-foreground">
        <span>on github</span>
        <a
          href={`https://github.com/KhaledSaeed18/${repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hit-area truncate transition-colors hover:text-foreground"
        >
          {repo}
        </a>
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:grid-cols-2">
        {cells.map(([k, v]) => (
          <div key={k} className="bg-background px-4 py-3">
            <dt className="font-mono text-xs text-muted-foreground">{k}</dt>
            <dd className="mt-1 text-sm tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
