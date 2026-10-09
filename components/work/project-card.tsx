import Link from "next/link"

import { DitherObject } from "@/components/print/dither-object"
import type { Project } from "@/lib/content/projects"
import { cn } from "@/lib/utils"

/**
 * A project printed on card stock: kind and number along the top, the dithered
 * object in the card's own ink, the name at the bottom. Hovering plays the
 * object's swing. `still` renders it as a plain box (no link), for previews.
 */
export function ProjectCard({
  project,
  index,
  still = false,
  className,
}: {
  project: Project
  index: number
  still?: boolean
  className?: string
}) {
  const { stock } = project
  const style = {
    backgroundColor: `var(--stock-${stock})`,
    color: `var(--ink-${stock})`,
  }
  const cls = cn(
    "group relative flex aspect-[5/7] flex-col overflow-hidden p-4 transition-transform duration-300 ease-out hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none sm:p-5",
    className
  )
  const body = (
    <>
      <div className="flex items-center justify-between font-mono text-xs">
        <span>
          {"// "}
          {project.kind.toLowerCase()}
        </span>
        <span className="tabular-nums">{String(index).padStart(2, "0")}</span>
      </div>

      <div className="[container-type:size] my-2 flex min-h-0 w-full flex-1 items-center justify-center">
        <DitherObject kind={project.object} stock={stock} play={still} fluid />
      </div>

      <div>
        <p className="font-heading text-2xl leading-tight font-medium tracking-tight sm:text-[1.7rem]">
          {project.name}
        </p>
        <p className="mt-1.5 font-mono text-xs">
          {project.year} / {project.stack.slice(0, 2).join(", ").toLowerCase()}
        </p>
      </div>
    </>
  )
  if (still)
    return (
      <div className={cls} style={style}>
        {body}
      </div>
    )
  return (
    <Link href={`/work/${project.slug}`} className={cls} style={style}>
      {body}
    </Link>
  )
}
