import type { Metadata } from "next"
import Link from "next/link"

import { RunStrip } from "@/components/experience/run-strip"
import { ContactSheet } from "@/components/home/contact-sheet"
import {
  abs,
  BreadcrumbJsonLd,
  employmentLd,
  JsonLd,
  personRef,
} from "@/components/json-ld"
import { OutLink } from "@/components/print/out-link"
import { FactStrip, type Fact } from "@/components/print/fact-strip"
import { PageIntro } from "@/components/print/page-intro"
import { CropMarks, Rule, Sheet, SpecLabel } from "@/components/print/sheet"
import { SheetLink } from "@/components/print/sheet-link"
import {
  careerStart,
  currentCompany,
  currentRole,
  employers,
  experience,
  formatTenure,
  monthsBetween,
  spanOf,
  type Company,
} from "@/lib/content/experience"
import { formatMonth } from "@/lib/format"
import { pageMeta } from "@/lib/metadata"
import { siteConfig, siteIdentity } from "@/lib/site"

// The tenure and the open chapter count up to the day, so re-render daily.
export const revalidate = 86400

export const metadata: Metadata = pageMeta({
  title: "Experience",
  description: `${siteIdentity} is a software engineer at JSS Technology, after an internship and a full-stack role at 3E Tech in Beirut. Client work since ${formatMonth(careerStart)}.`,
  path: "/experience",
})

export default function ExperiencePage() {
  const total = formatTenure(monthsBetween(careerStart))
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/", label: "home" }, { label: "experience" }]}
        title="Experience"
        lede={`${total} of client work without a gap, in two companies. An internship at a Beirut software startup that turned into a full-stack developer role, then a software engineer at a company that builds across web, mobile, desktop and AI. The projects belong to the clients, so they are described here by what they do, not by name.`}
        meta={
          <span className="hidden sm:inline">
            since {formatMonth(careerStart).toLowerCase()}
          </span>
        }
      />

      <div className="frame mt-20">
        <section aria-labelledby="run">
          <div className="flex items-end justify-between gap-6">
            <SpecLabel>the run so far</SpecLabel>
            <p className="font-mono text-xs text-muted-foreground">
              one cell a month
            </p>
          </div>
          <Rule className="mt-3" />
          <h2 id="run" className="sr-only">
            Timeline
          </h2>
          <div data-reveal className="mt-10">
            <RunStrip />
          </div>
        </section>
      </div>

      <div className="mt-24 space-y-32 sm:space-y-40">
        {experience.map((c, i) => (
          <Employer key={c.slug} company={c} index={i + 1} />
        ))}

        <section aria-labelledby="open-work" className="frame">
          <SpecLabel index={experience.length + 1}>and the open work</SpecLabel>
          <Rule className="mt-3" />
          <div className="mt-10">
            <div>
              <h2
                id="open-work"
                className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl"
              >
                What is on the work page is the part I can show.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Everything on{" "}
                <Link
                  href="/work"
                  className="hit-area text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
                >
                  the work page
                </Link>{" "}
                is my own: open source, published as {siteConfig.username}, each
                with a case study. The client systems above are the other half
                of the record, built in teams and shipped under someone
                else&apos;s name. Ask about them and I will talk through what I
                can.
              </p>
            </div>
          </div>
          <nav
            aria-label="Related pages"
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            <SheetLink href="/work" eyebrow="open source" title="Work" />
            <SheetLink
              href="/about"
              eyebrow="the person"
              title="About"
              alignEnd
            />
          </nav>
        </section>
      </div>

      <div className="mt-32">
        <ContactSheet index={experience.length + 2} />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": abs("/experience"),
              url: abs("/experience"),
              name: "Experience",
              description: metadata.description,
              isPartOf: { "@id": abs("/#website") },
              about: personRef,
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: experience.length,
                itemListElement: experience.map((c, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  item: employmentLd(c),
                })),
              },
            },
            {
              "@type": "Person",
              ...personRef,
              jobTitle: currentRole.title,
              worksFor: {
                "@type": "Organization",
                name: currentCompany.name,
                ...(currentCompany.url ? { url: currentCompany.url } : {}),
              },
              alumniOf: employers
                .filter((e) => e.name !== currentCompany.name)
                .map((e) => ({ "@type": "Organization", ...e })),
            },
          ],
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Experience", path: "/experience" },
        ]}
      />
    </>
  )
}

/** One company as a sheet: facts, the chapters there, what was built and with what. */
function Employer({ company: c, index }: { company: Company; index: number }) {
  const { start, end } = spanOf(c)
  const current = !end
  return (
    <Sheet
      id={c.slug}
      index={index}
      label={c.name.toLowerCase()}
      title={
        <>
          {c.roles.length > 1
            ? `${c.roles[0].title}, then ${c.roles.at(-1)!.title}`
            : c.roles[0].title}
          {/* the label above names the company on screen; the heading names it for outlines */}
          <span className="sr-only"> at {c.name}</span>
        </>
      }
      lede={c.summary}
      meta={
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          {formatMonth(start).toLowerCase()} to{" "}
          {end ? (
            formatMonth(end).toLowerCase()
          ) : (
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
          [
            "company",
            c.url ? (
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hit-area underline decoration-border underline-offset-4 transition-colors hover:decoration-brand"
              >
                {c.name}
              </a>
            ) : (
              c.name
            ),
          ],
          ["kind", c.kind],
          ["where", c.location],
          ["mode", c.mode],
          ["tenure", formatTenure(monthsBetween(start, end))],
          ...(c.roles.length > 1
            ? ([["chapters", String(c.roles.length)]] as Fact[])
            : []),
        ]}
      />

      {/* chapters */}
      <ol data-reveal className="mt-16 space-y-4">
        {c.roles.map((r, i) => (
          <li
            key={r.title}
            className="relative grid gap-x-10 gap-y-6 border border-border p-6 sm:p-8 lg:grid-cols-12"
          >
            <CropMarks />
            <div className="lg:col-span-4">
              <p className="font-mono text-xs text-brand">
                <span className="tabular-nums">
                  ch. {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ml-3 text-muted-foreground">
                  <time dateTime={r.start}>
                    {formatMonth(r.start).toLowerCase()}
                  </time>{" "}
                  to{" "}
                  {r.end ? (
                    <time dateTime={r.end}>
                      {formatMonth(r.end).toLowerCase()}
                    </time>
                  ) : (
                    "now"
                  )}
                </span>
              </p>
              <h3 className="mt-3 font-heading text-2xl font-medium tracking-tight text-balance sm:text-3xl">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {r.lede}
              </p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {formatTenure(monthsBetween(r.start, r.end))}
              </p>
            </div>
            <ul className="space-y-3.5 lg:col-span-8">
              {r.body.map((line) => (
                <li key={line} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-2 shrink-0 bg-brand"
                  />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div data-reveal className="mt-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h3 className="font-mono text-xs font-normal text-muted-foreground">
            {current ? "building" : "built"}
          </h3>
          <ul className="mt-4 space-y-4">
            {c.domains.map((d) => {
              const [field, rest] = splitDomain(d)
              return (
                <li key={d} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-2 shrink-0 bg-brand"
                  />
                  <span className="text-lg">
                    {field ? (
                      <>
                        <span className="font-medium">{field}:</span> {rest}
                      </>
                    ) : (
                      d
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <h3 className="font-mono text-xs font-normal text-muted-foreground">
            stack, as used there
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {c.stack.map((s) => (
              <li
                key={s}
                className="border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
          {c.url && (
            <p className="mt-8">
              <OutLink href={c.url} context={`${c.name} website`}>
                {c.url.replace(/^https?:\/\/(www\.)?/, "")}
              </OutLink>
            </p>
          )}
        </div>
      </div>

      <figure
        data-reveal
        className="mt-16 border-l-2 border-brand pl-6 sm:pl-8"
      >
        <figcaption className="font-mono text-xs text-muted-foreground">
          what it taught me
        </figcaption>
        <blockquote className="mt-3 font-heading text-xl leading-snug font-medium tracking-tight text-balance sm:text-2xl">
          {c.learned}
        </blockquote>
      </figure>
    </Sheet>
  )
}

/** "Events: ticketing with..." -> ["Events", "ticketing with..."]; no colon -> [null, line]. */
function splitDomain(line: string): [string | null, string] {
  const i = line.indexOf(": ")
  return i === -1 ? [null, line] : [line.slice(0, i), line.slice(i + 2)]
}
