import { fallbackStars } from "@/lib/content/profile"

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

export type Profile = { followers: number; publicRepos: number; since: number }

export async function getProfile(): Promise<Profile> {
  const u = await gh<{
    followers: number
    public_repos: number
    created_at: string
  }>(`/users/${USER}`)
  return {
    followers: u?.followers ?? 400,
    publicRepos: u?.public_repos ?? 81,
    since: u ? new Date(u.created_at).getFullYear() : 2023,
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

/** Star counts for repositories I have contributed to, keyed by "owner/name". */
export async function getStars(
  fullNames: string[]
): Promise<Record<string, number>> {
  const entries = await Promise.all(
    fullNames.map(async (n) => {
      const r = await gh<Repo>(`/repos/${n}`)
      return [n, r?.stargazers_count ?? fallbackStars[n] ?? 0] as const
    })
  )
  return Object.fromEntries(entries)
}

export type ContributionDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}
export type Calendar = { days: ContributionDay[]; total: number }

/**
 * The public contribution calendar, parsed from the same HTML fragment
 * github.com renders on a profile. No token needed.
 */
export async function getCalendar(): Promise<Calendar | null> {
  try {
    const res = await fetch(`https://github.com/users/${USER}/contributions`, {
      next: { revalidate: DAY, tags: ["github"] },
    })
    if (!res.ok) return null
    const html = await res.text()

    const counts = new Map<string, number>()
    for (const m of html.matchAll(
      /for="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)<\/tool-tip>/g
    )) {
      const n = /^(\d+|No) contribution/.exec(m[2].trim())
      counts.set(m[1], !n || n[1] === "No" ? 0 : Number(n[1]))
    }
    const days: ContributionDay[] = []
    for (const m of html.matchAll(
      /data-date="(\d{4}-\d{2}-\d{2})" id="(contribution-day-component-[\d-]+)" data-level="(\d)"/g
    )) {
      days.push({
        date: m[1],
        count: counts.get(m[2]) ?? 0,
        level: Number(m[3]) as ContributionDay["level"],
      })
    }
    if (!days.length) return null
    days.sort((a, b) => a.date.localeCompare(b.date))
    const total = days.reduce((s, d) => s + d.count, 0)
    return { days, total }
  } catch {
    return null
  }
}
