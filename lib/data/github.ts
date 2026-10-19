/**
 * Live numbers from GitHub, fetched at build time and revalidated daily.
 * Every call degrades to a sensible fallback so a rate limit or an outage
 * never breaks a page. One list call covers every repository, so the site
 * stays well inside the unauthenticated rate limit.
 */

const USER = "KhaledSaeed18"
const DAY = 60 * 60 * 24

const headers: HeadersInit = {
  accept: "application/vnd.github+json",
  // Optional: set GITHUB_TOKEN in the environment for a higher rate limit.
  ...(process.env.GITHUB_TOKEN
    ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
}

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers,
      next: { revalidate: DAY, tags: ["github"] },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

type Repo = {
  name: string
  full_name: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  fork: boolean
  pushed_at: string
  language: string | null
  license: { spdx_id: string; name: string } | null
}

/** What a case study shows about its repository, straight from GitHub. */
export type RepoFacts = {
  stars: number
  forks: number
  openIssues: number
  /** ISO timestamp of the last push to any branch. */
  pushedAt: string
  /** GitHub's primary language for the repository. */
  language: string | null
  /** SPDX id, e.g. "MIT"; null when the repository has no license file. */
  license: string | null
}

/** Facts for my own repositories, keyed by repo name. */
export async function getMyRepos(): Promise<Record<string, RepoFacts>> {
  const repos = await gh<Repo[]>(`/users/${USER}/repos?per_page=100&type=owner`)
  const out: Record<string, RepoFacts> = {}
  for (const r of repos ?? []) {
    if (r.fork) continue
    out[r.name] = {
      stars: r.stargazers_count,
      forks: r.forks_count,
      openIssues: r.open_issues_count,
      pushedAt: r.pushed_at,
      language: r.language,
      license:
        r.license && r.license.spdx_id !== "NOASSERTION"
          ? r.license.spdx_id
          : null,
    }
  }
  return out
}

/** Star counts for my own repositories, keyed by repo name. */
export async function getMyStars(): Promise<Record<string, number>> {
  const repos = await getMyRepos()
  return Object.fromEntries(
    Object.entries(repos).map(([name, r]) => [name, r.stars])
  )
}
