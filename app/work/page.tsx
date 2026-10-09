import type { Metadata } from "next"

import { BreadcrumbJsonLd } from "@/components/json-ld"
import { PageIntro } from "@/components/print/page-intro"
import { WorkLedger } from "@/components/work/work-ledger"
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
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "work" }]}
        title="Work"
        lede="Everything here is open source. Each job opens a short case study: the problem, how it works, and what I would point a reviewer at."
        meta={`${projects.length} projects`}
      />

      <div className="frame mt-20">
        <WorkLedger
          projects={order.flatMap((g) => projects.filter((p) => p.group === g))}
          groups={order.map((key) => ({ key, ...groups[key] }))}
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
