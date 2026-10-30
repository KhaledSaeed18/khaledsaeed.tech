import Link from "next/link"

import { Sheet } from "@/components/print/sheet"
import { WorkProof } from "@/components/home/work-proof"
import { featuredProjects, projects } from "@/lib/content/projects"

export function SelectedWork({ index }: { index: number }) {
  return (
    <Sheet
      id="work"
      index={index}
      label="selected work"
      title="Things I built because they should exist."
      lede="Platforms that keep tenants apart at the database and a team's board live across browsers, and Linux tools that show their evidence: where the battery went, what a link really does."
      meta={
        <Link
          href="/work"
          className="hit-area transition-colors hover:text-foreground"
        >
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
