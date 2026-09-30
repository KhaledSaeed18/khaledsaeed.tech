import Link from "next/link"
import type * as React from "react"

import { Sheet } from "@/components/print/sheet"
import { ProjectCard } from "@/components/work/project-card"
import { featuredProjects, projects } from "@/lib/content/projects"

export function SelectedWork() {
  return (
    <Sheet
      id="work"
      index={1}
      label="selected work"
      title="Things I built because they should exist."
      lede="Platforms that keep tenants apart at the database, tools that explain what they are doing, and native apps that stay out of the way."
      meta={
        <Link href="/work" className="transition-colors hover:text-foreground">
          all {projects.length} projects
        </Link>
      }
    >
      <ul className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0">
        {featuredProjects.map((p, i) => (
          <li
            key={p.slug}
            data-reveal
            style={{ "--reveal-delay": i } as React.CSSProperties}
            className="w-[72vw] max-w-[300px] shrink-0 snap-start lg:w-auto lg:max-w-none"
          >
            <ProjectCard project={p} index={i + 1} />
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
