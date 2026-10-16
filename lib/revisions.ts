import type { Project } from "@/lib/content/projects"
import history from "@/lib/content/revisions.json"
import { bare, tokens } from "@/lib/revision-diff"

/**
 * Revision marks for the case studies. scripts/revisions.mjs reads the git
 * history of their copy into lib/content/revisions.json; this turns it into
 * what a marked-up proof needs: each printing, and for every field on the
 * page, the words it had in that printing.
 */

type Words = {
  tagline: string
  summary: string
  problem: string
  approach: { title: string; body: string }[]
  highlights: string[]
}

type Recorded = { sha: string; date: string; subject: string; words?: Words }

export type Printing = { sha: string; date: string; subject: string }

export type RevisionData = {
  /** Every printing, oldest first; the last is the one on the page. */
  printings: Printing[]
  /** Field id -> its words on the page now. */
  now: Record<string, string>
  /** Field id -> its words in each earlier printing (null: not yet set). */
  fields: Record<string, (string | null)[]>
  /** Section -> items each earlier printing had that this one cut. */
  cuts: Record<"approach" | "highlights", string[][]>
}

/** How alike two passages are, by shared words (0..1). */
function likeness(a: string, b: string) {
  const wa = new Set(tokens(a.toLowerCase()).map(bare))
  const wb = new Set(tokens(b.toLowerCase()).map(bare))
  if (!wa.size || !wb.size) return 0
  let both = 0
  for (const w of wa) if (wb.has(w)) both++
  return (2 * both) / (wa.size + wb.size)
}

/**
 * Which earlier item each current item grew from: the same text, or else the
 * most alike, if alike enough. Unclaimed earlier items were cut.
 */
function pair(now: string[], then: string[]) {
  const from: (number | null)[] = now.map(() => null)
  const taken = new Set<number>()
  now.forEach((s, k) => {
    const same = then.findIndex((t, i) => t === s && !taken.has(i))
    if (same >= 0) {
      from[k] = same
      taken.add(same)
    }
  })
  const candidates: [number, number, number][] = []
  now.forEach((s, k) => {
    if (from[k] !== null) return
    then.forEach((t, i) => {
      if (!taken.has(i)) candidates.push([likeness(s, t), k, i])
    })
  })
  for (const [score, k, i] of candidates.sort((x, y) => y[0] - x[0])) {
    if (score < 0.3) break
    if (from[k] !== null || taken.has(i)) continue
    from[k] = i
    taken.add(i)
  }
  return { from, cut: then.filter((_, i) => !taken.has(i)) }
}

const wordsOf = (p: Project): Words => ({
  tagline: p.tagline,
  summary: p.summary,
  problem: p.problem,
  approach: p.approach.map((a) => ({ title: a.title, body: a.body })),
  highlights: p.highlights,
})

/** A case study's printings, and what every field said in each of them. */
export function revisionsOf(p: Project): RevisionData {
  const recorded = ((history as Record<string, Recorded[]>)[p.slug] ??
    []) as Recorded[]
  const now = wordsOf(p)
  const last = recorded[recorded.length - 1]
  // the page may be ahead of the last commit (an edit not yet committed)
  const ahead =
    !!last?.words && JSON.stringify(last.words) !== JSON.stringify(now)
  const earlier = (ahead ? recorded : recorded.slice(0, -1)).filter(
    (r): r is Required<Recorded> => !!r.words
  )
  const printings: Printing[] = recorded.map(({ sha, date, subject }) => ({
    sha,
    date,
    subject,
  }))
  if (ahead || !printings.length)
    printings.push({ sha: "", date: "", subject: "This printing" })

  const fields: RevisionData["fields"] = {
    tagline: earlier.map((r) => r.words.tagline),
    summary: earlier.map((r) => r.words.summary),
    problem: earlier.map((r) => r.words.problem),
  }
  const cuts: RevisionData["cuts"] = { approach: [], highlights: [] }

  const steps = now.approach.map((a) => `${a.title}\n${a.body}`)
  now.approach.forEach((_, k) => {
    fields[`approach.${k}.title`] = []
    fields[`approach.${k}.body`] = []
  })
  now.highlights.forEach((_, k) => (fields[`highlights.${k}`] = []))

  for (const r of earlier) {
    const was = r.words.approach
    const a = pair(
      steps,
      was.map((x) => `${x.title}\n${x.body}`)
    )
    a.from.forEach((i, k) => {
      fields[`approach.${k}.title`].push(i === null ? null : was[i].title)
      fields[`approach.${k}.body`].push(i === null ? null : was[i].body)
    })
    cuts.approach.push(a.cut.map((s) => s.split("\n")[0]))

    const h = pair(now.highlights, r.words.highlights)
    h.from.forEach((i, k) =>
      fields[`highlights.${k}`].push(i === null ? null : r.words.highlights[i])
    )
    cuts.highlights.push(h.cut)
  }

  const current: RevisionData["now"] = {
    tagline: now.tagline,
    summary: now.summary,
    problem: now.problem,
  }
  now.approach.forEach((a, k) => {
    current[`approach.${k}.title`] = a.title
    current[`approach.${k}.body`] = a.body
  })
  now.highlights.forEach((h, k) => (current[`highlights.${k}`] = h))

  return { printings, now: current, fields, cuts }
}
