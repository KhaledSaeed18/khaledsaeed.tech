"use client"

import Link from "next/link"
import * as React from "react"

import { DitherObject } from "@/components/print/dither-object"
import { ProjectCard } from "@/components/work/project-card"
import type { Project, ProjectGroup } from "@/lib/content/projects"
import { cn } from "@/lib/utils"

type Group = { key: ProjectGroup; title: string; blurb: string }

/**
 * The work page as a print shop's job book: drawer tabs to filter by group,
 * a ledger with one row per project, and on large screens a sticky proof of
 * the hovered or focused project printed on its card stock.
 */
export function WorkLedger({
  projects,
  groups,
}: {
  projects: Project[]
  groups: Group[]
}) {
  const [drawer, setDrawer] = React.useState<ProjectGroup | "all">("all")
  const [active, setActive] = React.useState(projects[0].slug)
  const [printing, setPrinting] = React.useState(false)

  // job numbers stay fixed whichever drawer is open
  const number = new Map(projects.map((p, i) => [p.slug, i + 1]))
  const rows =
    drawer === "all" ? projects : projects.filter((p) => p.group === drawer)
  const open = groups.find((g) => g.key === drawer)
  const proof = projects.find((p) => p.slug === active) ?? rows[0]

  const show = (slug: string) => {
    if (slug === active) return
    setActive(slug)
    setPrinting(true)
  }

  const pick = (d: ProjectGroup | "all") => {
    setDrawer(d)
    const first =
      d === "all" ? projects[0] : projects.find((p) => p.group === d)
    if (first) show(first.slug)
  }

  return (
    <div>
      {/* drawers */}
      <div
        role="group"
        aria-label="Filter projects"
        className="mx-[calc(var(--frame-pad)*-1)] flex [scrollbar-width:none] gap-1 overflow-x-auto px-(--frame-pad) pb-1 font-mono text-xs sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {[
          { key: "all" as const, title: "all", count: projects.length },
          ...groups.map((g) => ({
            key: g.key,
            title: g.title.toLowerCase(),
            count: projects.filter((p) => p.group === g.key).length,
          })),
        ].map((d) => {
          const on = drawer === d.key
          return (
            <button
              key={d.key}
              type="button"
              aria-pressed={on}
              onClick={() => pick(d.key)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 border px-3 py-2 whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                on
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-muted-foreground/60 hover:text-foreground"
              )}
            >
              {d.title}
              <span className={on ? "opacity-80" : "opacity-70"}>
                {d.count}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-5 min-h-[1.5em] text-muted-foreground">
        {open ? (
          open.blurb
        ) : (
          <>
            Every project, in the order it went to press.
            <span className="hidden lg:inline">
              {" "}
              Hover a job to pull its proof.
            </span>
          </>
        )}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        {/* ledger */}
        <div className="lg:col-span-8">
          <div
            aria-hidden="true"
            className="hidden grid-cols-[3rem_1fr_11rem_4rem] gap-4 border-y border-dashed border-border py-2.5 font-mono text-xs text-muted-foreground sm:grid"
          >
            <span>job</span>
            <span>project</span>
            <span>kind</span>
            <span className="text-right">year</span>
          </div>
          <ol className="border-t border-dashed border-border sm:border-t-0">
            {rows.map((p) => {
              const on = p.slug === proof.slug
              return (
                <li
                  key={p.slug}
                  data-reveal
                  data-shown
                  className="border-b border-dashed border-border"
                >
                  <Link
                    href={`/work/${p.slug}`}
                    onMouseEnter={() => show(p.slug)}
                    onFocus={() => show(p.slug)}
                    className="group grid grid-cols-[4rem_1fr_auto] items-center gap-4 py-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:grid-cols-[3rem_1fr_11rem_4rem] sm:py-5"
                  >
                    {/* job number on wide screens, a stock thumbnail on phones */}
                    <span
                      className={cn(
                        "hidden font-mono text-xs tabular-nums transition-colors sm:block",
                        on ? "text-brand" : "text-muted-foreground"
                      )}
                    >
                      {String(number.get(p.slug)).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="[container-type:size] flex size-16 items-center justify-center sm:hidden"
                      style={{ backgroundColor: `var(--stock-${p.stock})` }}
                    >
                      <DitherObject kind={p.object} stock={p.stock} dot={0.5} />
                    </span>

                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block font-heading text-xl font-medium tracking-tight transition-colors sm:text-2xl",
                          on
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {p.name}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground sm:line-clamp-1">
                        {p.tagline}
                      </span>
                      <span className="mt-1.5 block font-mono text-xs text-muted-foreground sm:hidden">
                        {p.kind.toLowerCase()}
                      </span>
                    </span>

                    <span className="hidden items-center gap-2 font-mono text-xs text-muted-foreground sm:flex">
                      <span
                        aria-hidden="true"
                        className="size-2 shrink-0"
                        style={{ backgroundColor: `var(--stock-${p.stock})` }}
                      />
                      <span className="truncate">{p.kind.toLowerCase()}</span>
                    </span>
                    <span className="self-start pt-1.5 text-right font-mono text-xs text-muted-foreground tabular-nums sm:self-center sm:pt-0">
                      {p.year}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>

        {/* proof */}
        <aside aria-hidden="true" className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24">
            <p className="mb-3 flex justify-between font-mono text-xs text-muted-foreground">
              <span>proof</span>
              <span className="tabular-nums">
                job {String(number.get(proof.slug)).padStart(2, "0")}
              </span>
            </p>
            <div
              key={proof.slug}
              className={cn(printing && "plate-print")}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) setPrinting(false)
              }}
            >
              <ProjectCard
                project={proof}
                index={number.get(proof.slug) ?? 1}
                still
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {proof.tagline}
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {proof.stack.slice(0, 4).join(", ").toLowerCase()}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
