import Link from "next/link"

import { Sheet } from "@/components/print/sheet"
import { WorkProof } from "@/components/home/work-proof"
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
      <div data-reveal>
        <WorkProof
          projects={featuredProjects.map(
            ({ slug, name, kind, year, tagline, stack, object, stock }) => ({
              slug,
              name,
              kind,
              year,
              tagline,
              stack,
              object,
              stock,
            })
          )}
        />
      </div>
    </Sheet>
  )
}
