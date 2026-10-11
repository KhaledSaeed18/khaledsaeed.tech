import Link from "next/link"

import { RunTape, type TapeCell } from "@/components/home/run-tape"
import { Sheet } from "@/components/print/sheet"
import { SheetLink } from "@/components/print/sheet-link"
import {
  careerStart,
  chapters,
  formatTenure,
  inkOf,
  monthsBetween,
  monthsOfRun,
} from "@/lib/content/experience"
import { formatMonth } from "@/lib/format"

const monthName = new Intl.DateTimeFormat("en", {
  month: "short",
  timeZone: "UTC",
})

/**
 * Experience on the home page: the run so far as a length of paper tape,
 * one cell a month, and the way into the full record. No names here; the
 * companies, chapters and what was built are on /experience.
 */
export function Experience({ index }: { index: number }) {
  const months = monthsOfRun()
  const total = monthsBetween(careerStart)
  const roles = new Set(chapters.map((c) => c.role.title)).size
  const cells: TapeCell[] = months.map(({ year, month, chapter }, i) => {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}`
    const c = chapters[chapter]
    return {
      iso,
      month: monthName.format(new Date(Date.UTC(year, month))).toLowerCase(),
      year: month === 0 || i === 0 ? `'${String(year).slice(2)}` : undefined,
      tone: chapter === -1 ? 2 : inkOf(chapter),
      title: c ? c.role.title.toLowerCase() : "between jobs",
      date: formatMonth(iso).toLowerCase(),
    }
  })

  return (
    <Sheet
      id="experience"
      index={index}
      label="experience"
      title={`${formatTenure(total)} on the clock.`}
      lede={`Client work since ${formatMonth(careerStart)}, without a gap: an internship that turned into a developer's desk, then an engineer's. Every month of it is on the tape. The companies, the chapters and what was built are on their own page.`}
      meta={
        <Link
          href="/experience"
          className="hit-area transition-colors hover:text-foreground"
        >
          experience
        </Link>
      }
    >
      {/* folio line */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-y border-dashed border-border py-2.5 font-mono text-xs text-muted-foreground">
        <span>{total} months</span>
        <span>{chapters.length} chapters</span>
        <span>{roles} titles</span>
        <span className="hidden sm:inline">no gaps</span>
      </div>

      <div data-reveal className="mt-10">
        <RunTape cells={cells} />
      </div>

      <nav
        aria-label="Experience"
        data-reveal
        className="mt-12 grid gap-4 sm:grid-cols-2"
      >
        <SheetLink
          href="/experience"
          eyebrow={`${total} months, ${chapters.length} chapters`}
          title="Experience"
        />
        <SheetLink
          href="/work"
          eyebrow="the open-source half"
          title="Work"
          alignEnd
        />
      </nav>
    </Sheet>
  )
}
