import Link from "next/link"

import { DitherObject } from "@/components/print/dither-object"
import type { Project } from "@/lib/content/projects"

/**
 * Case studies referenced from another page, as ledger rows: a swatch of the
 * project's card stock with its object, the name and tagline, and the kind.
 */
export function ProjectRows({ projects }: { projects: Project[] }) {
  return (
    <ul className="border-t border-dashed border-border">
      {projects.map((p) => (
        <li key={p.slug} className="border-b border-dashed border-border">
          <Link
            href={`/work/${p.slug}`}
            className="group grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-4 py-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:grid-cols-[4rem_minmax(0,1fr)_auto]"
          >
            <span
              aria-hidden="true"
              className="[container-type:size] flex size-16 items-center justify-center"
              style={{ backgroundColor: `var(--stock-${p.stock})` }}
            >
              <DitherObject kind={p.object} stock={p.stock} dot={0.5} />
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-xl font-medium tracking-tight transition-colors group-hover:text-brand">
                {p.name}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground sm:line-clamp-1">
                {p.tagline}
              </span>
            </span>
            <span className="hidden font-mono text-xs text-muted-foreground sm:block">
              {p.kind.toLowerCase()}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
