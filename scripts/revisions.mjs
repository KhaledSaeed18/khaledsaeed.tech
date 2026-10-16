#!/usr/bin/env node
/**
 * Reads the git history of the case study copy and writes
 * lib/content/revisions.json: for each project, every printing of its words
 * that differs from the one before, with the commit's date and subject. The
 * case study pages turn it into revision marks.
 *
 *   node scripts/revisions.mjs      # also runs before every build
 *
 * A shallow clone (Vercel's) has no history to read, so the script leaves the
 * committed file alone there.
 */
import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import ts from "typescript"

const FILE = "lib/content/projects.ts"
const OUT = "lib/content/revisions.json"

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 << 20 })

let shallow = "true"
try {
  shallow = git("rev-parse", "--is-shallow-repository").trim()
} catch {}
if (shallow !== "false") {
  console.log("revisions: no full git history here, keeping", OUT)
  process.exit(0)
}

/** A version of the file, loaded as a module. */
async function load(sha) {
  const src = git("show", `${sha}:${FILE}`)
  const js = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText
  const mod = await import(
    `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`
  )
  return mod.projects ?? []
}

/** The words a reader sees, and nothing else. */
const words = (p) => ({
  tagline: p.tagline ?? "",
  summary: p.summary ?? "",
  problem: p.problem ?? "",
  approach: (p.approach ?? []).map((a) => ({ title: a.title, body: a.body })),
  highlights: p.highlights ?? [],
})

/** "feat(work): update the SleepTrack case study" -> "Update the SleepTrack case study" */
const tidy = (s) => {
  const t = s.replace(/^\w+(\([^)]*\))?!?:\s*/, "").trim()
  return t[0].toUpperCase() + t.slice(1)
}

const log = git("log", "--reverse", "--format=%H%x09%as%x09%s", "--", FILE)
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((l) => {
    const [sha, date, subject] = l.split("\t")
    return { sha, date, subject }
  })

const out = {}
for (const c of log) {
  for (const p of await load(c.sha)) {
    const w = words(p)
    const list = (out[p.slug] ??= [])
    const last = list[list.length - 1]
    if (last && JSON.stringify(last.words) === JSON.stringify(w)) continue
    list.push({
      sha: c.sha.slice(0, 7),
      date: c.date,
      subject: tidy(c.subject),
      words: w,
    })
  }
}

// a case study printed once needs only its date: its words are the live ones
for (const list of Object.values(out))
  if (list.length === 1) delete list[0].words

const json = JSON.stringify(out, null, 2) + "\n"
let before = ""
try {
  before = readFileSync(OUT, "utf8")
} catch {}
if (json !== before) writeFileSync(OUT, json)
const revised = Object.values(out).filter((l) => l.length > 1).length
console.log(
  `revisions: ${log.length} commits, ${revised} case studies with revisions${json === before ? " (unchanged)" : ""}`
)
