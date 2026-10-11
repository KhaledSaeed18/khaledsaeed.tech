import type { Metadata } from "next"

import { ContactSheet } from "@/components/home/contact-sheet"
import {
  abs,
  BreadcrumbJsonLd,
  degreeLd,
  JsonLd,
  personRef,
} from "@/components/json-ld"
import { OutLink } from "@/components/print/out-link"
import { FactStrip, type Fact } from "@/components/print/fact-strip"
import { PageIntro } from "@/components/print/page-intro"
import { CropMarks, Sheet } from "@/components/print/sheet"
import { SheetLink } from "@/components/print/sheet-link"
import { ProjectRows } from "@/components/work/project-rows"
import { education, type Education } from "@/lib/content/education"
import { projectsBySlug } from "@/lib/content/projects"
import { formatIso, formatMonth } from "@/lib/format"
import { pageMeta } from "@/lib/metadata"
import { siteIdentity } from "@/lib/site"

export const metadata: Metadata = pageMeta({
  title: "Education",
  description: `Education of ${siteIdentity}: an M.S. in Computer Engineering in progress and a B.S. in Computer Engineering from the Lebanese International University.`,
  path: "/about/education",
})

const span = (e: Education) =>
  `${formatMonth(e.start)} to ${formatMonth(e.end)}`.toLowerCase()

export default function EducationPage() {
  return (
    <>
      <PageIntro
        crumbs={[
          { href: "/", label: "home" },
          { href: "/about", label: "about" },
          { label: "education" },
        ]}
        title="Education"
        lede="Two degrees in computer engineering at the Lebanese International University. The bachelor's closed with an award for the senior project, and the master's is under way, focused on machine learning and communication systems."
        meta={
          <span className="hidden sm:inline">{education.length} degrees</span>
        }
      />

      <div className="mt-24 space-y-32 sm:space-y-40">
        {education.map((e, i) => (
          <Degree key={e.slug} degree={e} index={i + 1} />
        ))}

        <nav
          aria-label="Related pages"
          className="frame grid gap-4 sm:grid-cols-2"
        >
          <SheetLink href="/about" eyebrow="back to" title="About" />
          <SheetLink
            href="/about/certifications"
            eyebrow="related sheet"
            title="Certifications"
            alignEnd
          />
        </nav>
      </div>

      <div className="mt-32">
        <ContactSheet index={education.length + 1} />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          url: abs("/about/education"),
          name: "Education",
          about: personRef,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: education.length,
            itemListElement: education.map((e, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: degreeLd(e),
            })),
          },
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Education", path: "/about/education" },
        ]}
      />
    </>
  )
}

/** One degree as a sheet: facts, what it covered, honors and the work it produced. */
function Degree({ degree: e, index }: { degree: Education; index: number }) {
  const work = projectsBySlug(e.projects)
  return (
    <Sheet
      id={e.slug}
      index={index}
      label={e.abbr.toLowerCase()}
      title={`${e.degree}, ${e.field}`}
      lede={e.summary}
      meta={
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          {span(e)}
          {e.current && (
            <span className="inline-flex items-center gap-1.5 text-brand">
              <span aria-hidden="true" className="size-1.5 bg-brand" />
              now
            </span>
          )}
        </span>
      }
    >
      <FactStrip
        facts={[
          ["school", e.school],
          ["degree", e.degree],
          ...(e.program ? ([["program", e.program]] as Fact[]) : []),
          ["years", span(e)],
          ["status", e.current ? "in progress" : "graduated"],
        ]}
      />

      <div data-reveal className="mt-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h3 className="font-mono text-xs font-normal text-muted-foreground">
            {e.current ? "studying" : "studied"}
          </h3>
          <ul className="mt-4 space-y-4">
            {e.studies.map((s) => (
              <li key={s} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-2 size-2 shrink-0 bg-brand"
                />
                <span className="text-lg">{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <h3 className="font-mono text-xs font-normal text-muted-foreground">
            skills
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {e.skills.map((s) => (
              <li
                key={s}
                className="border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {e.honors && e.honors.length > 0 && (
        <div data-reveal className="mt-16">
          <h3 className="font-mono text-xs font-normal text-muted-foreground">
            honors
          </h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {e.honors.map((h) => (
              <li
                key={h.title}
                className="relative flex flex-col border border-border p-6 sm:p-8 md:[&:last-child:nth-child(odd)]:col-span-2"
              >
                <CropMarks />
                <p className="font-mono text-xs text-brand">
                  <time dateTime={h.date}>
                    {formatIso(h.date).toLowerCase()}
                  </time>
                </p>
                <p className="mt-3 font-heading text-2xl font-medium tracking-tight text-balance">
                  {h.title}
                </p>
                <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
                  {h.body}
                </p>
                {h.documents && h.documents.length > 0 && (
                  <p className="mt-auto flex flex-wrap gap-2 pt-6">
                    {h.documents.map((d) => (
                      <OutLink
                        key={d.href}
                        href={d.href}
                        context={`${d.label} for ${h.title}`}
                      >
                        {d.label}
                      </OutLink>
                    ))}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {work.length > 0 && (
        <div data-reveal className="mt-16">
          <h3 className="font-mono text-xs font-normal text-muted-foreground">
            {e.current ? "work from it so far" : "work from it"}
          </h3>
          <div className="mt-4">
            <ProjectRows projects={work} />
          </div>
        </div>
      )}
    </Sheet>
  )
}
