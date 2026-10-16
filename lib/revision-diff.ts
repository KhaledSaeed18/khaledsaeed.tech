/**
 * The word diff behind revision marks (lib/revisions.ts), kept apart so the
 * browser can mark up a printing without loading the history itself.
 */

export type Seg = { op: "=" | "-" | "+"; text: string }

export const tokens = (s: string) => s.match(/\S+\s*/g) ?? []
export const bare = (t: string) => t.trim()

/**
 * A word diff, read like a proof: kept words, cut words and set words. Short
 * runs of kept words inside a rewrite ("the", "and") are folded into the
 * change, so a rewritten sentence reads as one cut and one insertion
 * instead of confetti.
 */
export function diffWords(before: string, after: string): Seg[] {
  const a = tokens(before)
  const b = tokens(after)
  const n = a.length
  const m = b.length
  // longest common subsequence, by table: copy is a few hundred words at most
  const lcs = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1))
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      lcs[i][j] =
        bare(a[i]) === bare(b[j])
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1])

  const raw: { op: Seg["op"]; a: string; b: string }[] = []
  let i = 0
  let j = 0
  while (i < n || j < m) {
    if (i < n && j < m && bare(a[i]) === bare(b[j])) {
      raw.push({ op: "=", a: a[i++], b: b[j++] })
    } else if (j < m && (i >= n || lcs[i][j + 1] >= lcs[i + 1][j])) {
      raw.push({ op: "+", a: "", b: b[j++] })
    } else {
      raw.push({ op: "-", a: a[i++], b: "" })
    }
  }

  // fold short kept runs that sit between changes into the change
  const runs: { op: Seg["op"] | "~"; a: string[]; b: string[] }[] = []
  for (const r of raw) {
    const last = runs[runs.length - 1]
    if (last && last.op === r.op) {
      last.a.push(r.a)
      last.b.push(r.b)
    } else runs.push({ op: r.op, a: [r.a], b: [r.b] })
  }
  for (let k = 1; k < runs.length - 1; k++)
    if (runs[k].op === "=" && runs[k].a.length <= 2) runs[k].op = "~"

  const out: Seg[] = []
  const push = (op: Seg["op"], text: string) => {
    if (!text) return
    const last = out[out.length - 1]
    if (last?.op === op) last.text += text
    else out.push({ op, text })
  }
  // within a change, every cut is printed before every insertion
  let cut = ""
  let set = ""
  const flush = () => {
    push("-", cut)
    push("+", set)
    cut = set = ""
  }
  for (const r of runs) {
    if (r.op === "=") {
      flush()
      push("=", r.b.join(""))
    } else {
      cut += r.a.join("")
      set += r.b.join("")
    }
  }
  flush()
  return out
}
