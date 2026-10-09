import { PrintSlug } from "@/components/print/print-slug"
import {
  about,
  credentials,
  education,
  principles,
  stack,
} from "@/lib/content/profile"
import { featuredProjects, kindPhrase } from "@/lib/content/projects"
import { siteConfig, socialLinks } from "@/lib/site"

const edition = (process.env.BUILD_COMMIT ?? "").slice(0, 7)
const link = (key: string) => socialLinks.find((l) => l.key === key)!

/** A heading on the printed sheet: mono label over a dotted rule. */
function Head({ children }: { children: string }) {
  return (
    <h2 className="mb-[2.4mm] border-b border-dotted border-[#9a928b] pb-[1mm] font-mono text-[7.5pt] font-normal tracking-wide text-[#6b635c] uppercase">
      <span className="text-[#c4553c]">{"// "}</span>
      {children}
    </h2>
  )
}

/** Crop marks in the corners of the sheet. */
function Crops() {
  const c = "absolute size-[5mm] border-[#1a1715]"
  return (
    <div aria-hidden="true">
      <span
        className={`${c} top-[6mm] left-[6mm] border-t-[0.25mm] border-l-[0.25mm]`}
      />
      <span
        className={`${c} top-[6mm] right-[6mm] border-t-[0.25mm] border-r-[0.25mm]`}
      />
      <span
        className={`${c} bottom-[6mm] left-[6mm] border-b-[0.25mm] border-l-[0.25mm]`}
      />
      <span
        className={`${c} right-[6mm] bottom-[6mm] border-r-[0.25mm] border-b-[0.25mm]`}
      />
    </div>
  )
}

/**
 * The page ⌘P prints, from anywhere on the site: a one-page A4 résumé
 * typeset like a proof off the press. Hidden on screen; the print styles
 * in globals.css show it alone. Built from the same content as the site.
 */
export function PrintResume() {
  return (
    <div className="print-resume hidden">
      <div className="relative h-[297mm] w-[210mm] overflow-hidden bg-white px-[16mm] pt-[15mm] pb-[13mm] text-[#1a1715]">
        <Crops />

        {/* masthead */}
        <header className="flex items-end justify-between gap-[8mm] border-b-[0.4mm] border-[#1a1715] pb-[4mm]">
          <div>
            <p className="font-mono text-[7.5pt] tracking-wide text-[#c4553c]">
              {"// "}
              {siteConfig.role.toLowerCase()} /{" "}
              {siteConfig.location.toLowerCase()}
            </p>
            <h1 className="mt-[1.5mm] font-heading text-[30pt] leading-none font-medium tracking-tight">
              {siteConfig.name}
            </h1>
          </div>
          <ul className="text-right font-mono text-[7.5pt] leading-[1.55] text-[#3d3732]">
            <li>{link("email").handle}</li>
            <li>khaledsaeed.tech</li>
            <li>github.com/{link("github").handle}</li>
            <li>linkedin.com/in/{link("linkedin").handle}</li>
          </ul>
        </header>

        <div className="mt-[6mm] grid grid-cols-[1fr_58mm] gap-[9mm]">
          {/* main column */}
          <div>
            <section>
              <Head>profile</Head>
              <p className="text-[9pt] leading-[1.5]">{about.short}</p>
            </section>

            <section className="mt-[6mm]">
              <Head>selected work</Head>
              <ol className="space-y-[3.2mm]">
                {featuredProjects.map((p) => (
                  <li key={p.slug} className="break-inside-avoid">
                    <p className="font-heading text-[10.5pt] font-medium">
                      {p.name}
                      <span className="ml-[2mm] font-mono text-[7pt] font-normal text-[#6b635c]">
                        {kindPhrase(p.kind)}, {p.year}
                      </span>
                    </p>
                    <p className="mt-[0.6mm] text-[8.5pt] leading-[1.45] text-[#3d3732]">
                      {p.tagline}
                    </p>
                    <p className="mt-[0.4mm] flex justify-between gap-[3mm] font-mono text-[7pt] text-[#6b635c]">
                      <span>{p.stack.slice(0, 4).join(" / ")}</span>
                      <span className="shrink-0">/work/{p.slug}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-[6mm]">
              <Head>how I work</Head>
              <ol className="space-y-[2mm]">
                {principles.map((p) => (
                  <li key={p.title} className="text-[8.5pt] leading-[1.45]">
                    <span className="font-medium">{p.title}.</span>{" "}
                    <span className="text-[#3d3732]">{p.body}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* side column */}
          <div>
            <section>
              <Head>education</Head>
              <ol className="space-y-[2.6mm]">
                {education.map((e) => (
                  <li key={e.degree}>
                    <p className="text-[8.5pt] leading-snug font-medium">
                      {e.degree}, {e.field}
                    </p>
                    <p className="text-[8pt] leading-snug text-[#3d3732]">
                      {e.school}
                    </p>
                    <p className="font-mono text-[7pt] text-[#6b635c]">
                      {e.start} to {e.end}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-[5.5mm]">
              <Head>certifications</Head>
              <ol className="space-y-[1.8mm]">
                {credentials.map((c) => (
                  <li key={c.name} className="text-[8pt] leading-snug">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-[#3d3732]">, {c.issuer}</span>
                    <span className="font-mono text-[7pt] text-[#6b635c]">
                      {" "}
                      {c.date}
                    </span>
                    {c.highlight && c.note && (
                      <span className="block font-mono text-[7pt] text-[#c4553c]">
                        {c.note}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-[5.5mm]">
              <Head>stack</Head>
              <dl className="space-y-[1.4mm]">
                {stack.map((l) => (
                  <div key={l.layer}>
                    <dt className="font-mono text-[7pt] text-[#6b635c] lowercase">
                      {l.layer}
                    </dt>
                    <dd className="text-[8pt] leading-snug">
                      {l.items.join(", ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        {/* slug line */}
        <p className="absolute right-[16mm] bottom-[10mm] left-[16mm] flex justify-between gap-[6mm] border-t border-dotted border-[#9a928b] pt-[1.5mm] font-mono text-[6.5pt] text-[#6b635c]">
          <span>
            <PrintSlug edition={edition} />
          </span>
          <span className="shrink-0">case studies at khaledsaeed.tech</span>
        </p>
      </div>
    </div>
  )
}
