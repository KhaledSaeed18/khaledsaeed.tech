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

type Release = {
  tag_name: string
  name: string | null
  html_url: string
  published_at: string
  draft: boolean
  prerelease: boolean
}

type Tag = { name: string; commit: { sha: string; url: string } }

/** The newest printing of a repository, as GitHub reports it. */
export type LatestRelease = {
  /** The tag as written: "v1.2.0". */
  tag: string
  /** Where the release notes are, or the tag's tree when there are none. */
  url: string
  /** ISO timestamp; null when only a tag exists and its date was not read. */
  publishedAt: string | null
  /** True when the version comes from a bare tag with no GitHub release. */
  tagOnly: boolean
}

/**
 * The latest release of one of my repositories, refreshed daily. Falls back
 * to the newest tag when the repository tags without publishing releases,
 * and to null when it has neither, so a case study never prints a version
 * that the repository does not carry.
 */
export async function getLatestRelease(
  repo: string
): Promise<LatestRelease | null> {
  const rel = await gh<Release>(`/repos/${USER}/${repo}/releases/latest`)
  if (rel && !rel.draft) {
    return {
      tag: rel.tag_name,
      url: rel.html_url,
      publishedAt: rel.published_at,
      tagOnly: false,
    }
  }
  const tags = await gh<Tag[]>(`/repos/${USER}/${repo}/tags?per_page=1`)
  const tag = tags?.[0]
  if (!tag) return null
  const commit = await gh<{ commit: { committer: { date: string } } }>(
    `/repos/${USER}/${repo}/commits/${tag.commit.sha}`
  )
  return {
    tag: tag.name,
    url: `https://github.com/${USER}/${repo}/releases/tag/${tag.name}`,
    publishedAt: commit?.commit.committer.date ?? null,
    tagOnly: true,
  }
}

/** Star counts for my own repositories, keyed by repo name. */
export async function getMyStars(): Promise<Record<string, number>> {
  const repos = await getMyRepos()
  return Object.fromEntries(
    Object.entries(repos).map(([name, r]) => [name, r.stars])
  )
}
