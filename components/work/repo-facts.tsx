import type { RepoFacts as Facts } from "@/lib/data/github"
import { formatDate, formatNumber } from "@/lib/format"

/**
 * The repository as GitHub reports it, refreshed daily: stars, forks,
 * license, primary language and the last push. Rendered only when the
 * fetch succeeded, so an outage leaves a gap instead of a wrong number.
 */
export function RepoFacts({ repo, facts }: { repo: string; facts: Facts }) {
  const cells: [string, string][] = [
    ["stars", formatNumber(facts.stars)],
    ["forks", formatNumber(facts.forks)],
    ...(facts.license ? ([["license", facts.license]] as [string, string][]) : []),
    ...(facts.language
      ? ([["language", facts.language]] as [string, string][])
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
