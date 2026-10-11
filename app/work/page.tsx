import type { Metadata } from "next"

import { BreadcrumbJsonLd } from "@/components/json-ld"
import { PageIntro } from "@/components/print/page-intro"
import { WorkLedger } from "@/components/work/work-ledger"
import { catalog, groupOrder, groups } from "@/lib/content/projects"
import { pageMeta } from "@/lib/metadata"
import { siteConfig, siteIdentity } from "@/lib/site"

export const metadata: Metadata = pageMeta({
  title: "Work",
  description: `Open-source projects by ${siteIdentity}: web platforms, developer CLIs, native macOS apps, Linux tools and embedded systems.`,
  path: "/work",
})

export default function WorkPage() {
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
            . Each job opens a short case study: the problem, how it works, and
            what I would point a reviewer at.
          </>
        }
        meta={`${catalog.length} projects`}
      />

      <div className="frame mt-12">
        <WorkLedger
          projects={catalog}
          groups={groupOrder.map((key) => ({ key, ...groups[key] }))}
        />
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
