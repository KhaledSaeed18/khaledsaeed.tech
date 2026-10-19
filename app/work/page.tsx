import type { Metadata } from "next"

import { abs, BreadcrumbJsonLd, JsonLd, personRef } from "@/components/json-ld"
import { FactStrip, type Fact } from "@/components/print/fact-strip"
import { PageIntro } from "@/components/print/page-intro"
import { WorkLedger } from "@/components/work/work-ledger"
import { catalog, groupOrder, groups } from "@/lib/content/projects"
import { getMyRepos } from "@/lib/data/github"
import { formatNumber } from "@/lib/format"
import { pageMeta } from "@/lib/metadata"
import { siteConfig, siteIdentity } from "@/lib/site"

export const metadata: Metadata = pageMeta({
  title: "Work",
  description: `${catalog.length} open-source projects by ${siteIdentity}, each with a case study: multi-tenant platforms, developer CLIs, native macOS apps, Linux system tools and embedded systems.`,
  path: "/work",
  keywords: [
    "Khaled Saeed projects",
    "KhaledSaeed18",
    "open source portfolio",
    "case studies",
    ...groupOrder.map((g) => groups[g].title),
  ],
})

export default async function WorkPage() {
  const repos = await getMyRepos()
  const stars = catalog.reduce((n, p) => n + (repos[p.repo]?.stars ?? 0), 0)
  const languages = new Set(
    catalog.flatMap((p) =>
      p.stack.filter((s) =>
        ["TypeScript", "Python", "Swift", "Go", "Rust", "C", "MATLAB"].includes(
          s
        )
      )
    )
  )
  const measured = catalog.reduce((n, p) => n + (p.proof?.length ?? 0), 0)
  const releases = catalog.reduce(
    (n, p) =>
      n + (p.timeline?.filter((m) => /^v?\d+\.\d+/.test(m.title)).length ?? 0),
    0
  )
  const totals: Fact[] = [
    ["projects", catalog.length],
    ["languages", languages.size],
    ["releases", releases],
    ["measured figures", measured],
    ...(Object.keys(repos).length
      ? ([["github stars", formatNumber(stars)]] as Fact[])
      : []),
  ]

  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "work" }]}
        title="Work"
        lede={
          <>
            Everything here is open source, published as{" "}
            <a
              href={`https://github.com/${siteConfig.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hit-area text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
            >
              {siteConfig.username}
            </a>
            . Each job opens a case study: the problem, how it works, what was
            measured, the decisions behind it and how to try it.
          </>
        }
        meta={`${catalog.length} projects`}
      >
        <FactStrip facts={totals} className="mt-12" />
      </PageIntro>

      <div className="frame mt-12">
        <WorkLedger
          projects={catalog}
          groups={groupOrder.map((key) => ({ key, ...groups[key] }))}
        />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": abs("/work"),
          name: "Work",
          description: `Open-source projects by ${siteIdentity}, each with a case study.`,
          url: abs("/work"),
          author: personRef,
          mainEntity: {
            "@type": "ItemList",
            "@id": abs("/work#catalog"),
            name: `Projects by ${siteConfig.name}`,
            numberOfItems: catalog.length,
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            itemListElement: catalog.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              description: p.tagline,
              url: abs(`/work/${p.slug}`),
              item: { "@id": abs(`/work/${p.slug}#project`) },
            })),
          },
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ]}
      />
    </>
  )
}
