import type * as React from "react"

import type { Repository } from "@/lib/content/projects"
import type { LatestRelease, RepoFacts } from "@/lib/data/github"
import { formatDate, formatNumber } from "@/lib/format"

/**
 * A project that spans several repositories, one row each: what the
 * repository is for, and what GitHub says about it today. The live cells
 * are refreshed daily and left out when the fetch failed, so a rate limit
 * leaves a gap rather than a stale number.
 */
export function Repositories({
  repos,
  facts,
  releases,
}: {
  repos: Repository[]
  facts: Record<string, RepoFacts>
  releases: Record<string, LatestRelease | null>
}) {
  return (
    <ol>
      {repos.map((r, i) => {
        const live = facts[r.repo]
        const release = releases[r.repo]
        const cells: [string, React.ReactNode][] = live
          ? [
              ["stars", formatNumber(live.stars)],
              ...(live.language
                ? ([["language", live.language]] as [string, string][])
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
                      </a>,
                    ],
                  ] as [string, React.ReactNode][])
                : []),
              ["last push", formatDate(live.pushedAt).toLowerCase()],
            ]
          : []
        return (
          <li
            key={r.repo}
            data-reveal
            style={{ "--reveal-delay": i } as React.CSSProperties}
            className="border-b border-dashed border-border py-5 sm:py-6"
          >
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-[2.25rem_1fr]">
              <span className="font-mono text-xs text-brand tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="font-medium">{r.role}</p>
                  <a
                    href={`https://github.com/KhaledSaeed18/${r.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hit-area truncate font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {r.repo}
                  </a>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {r.body}
                </p>
                {r.stack && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {r.stack.map((s) => (
                      <li
                        key={s}
                        className="border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                {cells.length > 0 && (
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
                    {cells.map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt>{k}</dt>
                        <dd className="text-foreground tabular-nums">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
