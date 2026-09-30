import type { Metadata } from "next"
import type * as React from "react"

import { BreadcrumbJsonLd } from "@/components/json-ld"
import { PageIntro } from "@/components/print/page-intro"
import { Rule, SpecLabel } from "@/components/print/sheet"
import { ProjectCard } from "@/components/work/project-card"
import { getProject } from "@/lib/content/projects"
import { madeForMyself, now, uses } from "@/lib/content/uses"
import { formatMonth } from "@/lib/format"
import { pageMeta } from "@/lib/metadata"

export const metadata: Metadata = pageMeta({
  title: "Uses",
  description:
    "What Khaled Saeed is working on now, the everyday hardware and software, and the small tools written because nothing else did the job.",
  path: "/uses",
})

export default function UsesPage() {
  const made = madeForMyself
    .map((s) => getProject(s))
    .filter((p) => p !== undefined)
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "uses" }]}
        title="Uses, and now"
        lede="A short, honest list. Most of my setup is defaults plus a few small apps I wrote because nothing else did the job."
      />

      <div className="mx-auto mt-24 max-w-6xl space-y-28 px-6 sm:px-10">
        <section aria-labelledby="now">
          <div className="flex items-end justify-between">
            <SpecLabel index={1}>now</SpecLabel>
            <span className="font-mono text-xs text-muted-foreground">
              updated {formatMonth(`${now.updated}-01`)}
            </span>
          </div>
          <Rule className="mt-3" />
          <h2 id="now" className="sr-only">
            What I am doing now
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {now.items.map((item, i) => (
              <li
                key={item}
                data-reveal
                style={{ "--reveal-delay": i } as React.CSSProperties}
                className="flex gap-4"
              >
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-2 shrink-0 bg-brand"
                />
                <span className="text-lg leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="setup">
          <SpecLabel index={2}>setup</SpecLabel>
          <Rule className="mt-3" />
          <h2 id="setup" className="sr-only">
            Setup
          </h2>
          <div className="mt-4">
            {uses.map((g, i) => (
              <div
                key={g.group}
                data-reveal
                style={{ "--reveal-delay": i } as React.CSSProperties}
                className="grid gap-4 border-b border-dashed border-border py-8 md:grid-cols-12"
              >
                <h3 className="font-mono text-xs text-muted-foreground md:col-span-3 md:pt-1.5">
                  {g.group.toLowerCase()}
                </h3>
                <ul className="space-y-4 md:col-span-9">
                  {g.items.map((it) => (
                    <li
                      key={it.name}
                      className="grid gap-1 sm:grid-cols-[14rem_1fr] sm:gap-6"
                    >
                      {it.href ? (
                        <a
                          href={it.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
                        >
                          {it.name}
                        </a>
                      ) : (
                        <span className="font-medium">{it.name}</span>
                      )}
                      <span className="text-muted-foreground">{it.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="made">
          <SpecLabel index={3}>made for myself</SpecLabel>
          <Rule className="mt-3" />
          <h2
            id="made"
            className="mt-10 max-w-2xl font-heading text-3xl font-medium tracking-tight text-balance"
          >
            When a tool did not exist, I wrote it.
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {made.map((p, i) => (
              <li
                key={p.slug}
                data-reveal
                style={{ "--reveal-delay": i } as React.CSSProperties}
              >
                <ProjectCard project={p} index={i + 1} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Uses", path: "/uses" },
        ]}
      />
    </>
  )
}
