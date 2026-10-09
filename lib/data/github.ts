/**
 * Live numbers from GitHub, fetched at build time and revalidated daily.
 * Every call degrades to a sensible fallback so a rate limit or an outage
 * never breaks a page.
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
  fork: boolean
}

/** Star counts for my own repositories, keyed by repo name. */
export async function getMyStars(): Promise<Record<string, number>> {
  const repos = await gh<Repo[]>(`/users/${USER}/repos?per_page=100&type=owner`)
  const out: Record<string, number> = {}
  for (const r of repos ?? []) if (!r.fork) out[r.name] = r.stargazers_count
  return out
}
