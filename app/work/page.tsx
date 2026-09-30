import type { Metadata } from "next"
import type * as React from "react"

import { BreadcrumbJsonLd } from "@/components/json-ld"
import { PageIntro } from "@/components/print/page-intro"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { ProjectCard } from "@/components/work/project-card"
import { groups, projects, type ProjectGroup } from "@/lib/content/projects"
import { pageMeta } from "@/lib/metadata"

export const metadata: Metadata = pageMeta({
  title: "Work",
  description:
    "Projects by Khaled Saeed: multi-tenant platforms, backend templates, security and developer CLIs, and native macOS apps, each with a case study.",
  path: "/work",
})

const order: ProjectGroup[] = ["platforms", "tools", "macos", "web"]

export default function WorkPage() {
  let n = 0
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "work" }]}
        title="Work"
        lede="Everything here is open source. Each card opens a short case study: the problem, how it works, and what I would point a reviewer at."
        meta={`${projects.length} projects`}
      />

      <div className="mx-auto mt-24 max-w-6xl space-y-24 px-6 sm:px-10">
        {order.map((g) => {
          const list = projects.filter((p) => p.group === g)
          return (
            <section key={g} aria-labelledby={`group-${g}`}>
              <div className="flex items-end justify-between gap-6">
                <SpecLabel>{groups[g].title.toLowerCase()}</SpecLabel>
                <span className="font-mono text-xs text-muted-foreground">
                  {list.length}
                </span>
              </div>
              <Rule className="mt-3" />
              <div className="mt-8 grid gap-4 md:grid-cols-12">
                <h2
                  id={`group-${g}`}
                  className="font-heading text-2xl font-medium tracking-tight md:col-span-5"
                >
                  {groups[g].title}
                </h2>
                <p className="text-muted-foreground md:col-span-7">
                  {groups[g].blurb}
                </p>
              </div>
              <ul className="mt-10 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
                {list.map((p, i) => {
                  n++
                  return (
                    <li
                      key={p.slug}
                      data-reveal
                      style={{ "--reveal-delay": i } as React.CSSProperties}
                    >
                      <ProjectCard project={p} index={n} />
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ]}
      />
    </>
  )
}
