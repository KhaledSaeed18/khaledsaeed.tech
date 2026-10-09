/**
 * A small fuzzy matcher for the palette: whole-word and prefix matches rank
 * first, then substrings, then letters in order (so "drsc" finds
 * "drainscope"). Returns -1 when the query does not match at all.
 */
export function fuzzyScore(query: string, text: string) {
  const q = query.toLowerCase().trim()
  const t = text.toLowerCase()
  if (!q) return 0
  if (t.startsWith(q)) return 1000 - t.length
  const word = t.split(/[\s/\-.]+/).findIndex((w) => w.startsWith(q))
  if (word >= 0) return 800 - word * 10 - t.length
  const at = t.indexOf(q)
  if (at >= 0) return 600 - at - t.length
  let i = 0
  let gaps = 0
  let last = -1
  for (let j = 0; j < t.length && i < q.length; j++) {
    if (t[j] === q[i]) {
      if (last >= 0) gaps += j - last - 1
      last = j
      i++
    }
  }
  return i === q.length ? 300 - gaps - t.length : -1
}
