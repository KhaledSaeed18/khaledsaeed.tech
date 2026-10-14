"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { DitherObject } from "@/components/print/dither-object"
import { PrintSlug } from "@/components/print/print-slug"
import { kindPhrase, type Project } from "@/lib/content/projects"
import { siteConfig, socialLinks } from "@/lib/site"

const edition = (process.env.BUILD_COMMIT ?? "").slice(0, 7)
const link = (key: string) => socialLinks.find((l) => l.key === key)!

/** A heading on the printed sheet: mono label over a dotted rule. */
function Head({ index, children }: { index: number; children: string }) {
  return (
    <h2 className="mb-[2.4mm] border-b border-dotted border-[#9a928b] pb-[1mm] font-mono text-[7.5pt] font-normal tracking-wide text-[#6b635c] uppercase">
      <span className="text-[#c4553c]">{"// "}</span>
      <span className="mr-[2mm] tabular-nums">
        {String(index).padStart(2, "0")}
      </span>
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

/** A link printed as its address, since paper cannot be clicked. */
const bare = (href: string) => href.replace(/^https?:\/\//, "")

/**
 * The sheet ⌘P prints on a case study: the project on one A4 page, typeset
 * like the résumé, so it can be attached to an application on its own.
 *
 * Rendered into a portal at the end of body so the print styles can show it
 * alone; hidden on screen and from assistive tech, since it repeats the page.
 */
const noop = () => () => {}

export function PrintProject({ project: p }: { project: Project }) {
  // a portal needs document.body, which exists only after hydration
  const mounted = React.useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
  if (!mounted) return null

  // A long study (five or six approach steps) gets the tighter setting and
  // skips the summary, which the tagline and problem already cover.
  const dense = p.approach.reduce((n, a) => n + a.body.length, 0) > 1500
  const body = dense
    ? "text-[7.6pt] leading-[1.4]"
    : "text-[8pt] leading-[1.45]"
  let n = 0
  const next = () => ++n

  const sheet = (
    <div className="print-sheet hidden" aria-hidden="true">
      <div className="relative h-[297mm] w-[210mm] overflow-hidden bg-white px-[16mm] pt-[15mm] pb-[13mm] text-[#1a1715]">
        <Crops />

        {/* masthead */}
        <header className="flex items-end justify-between gap-[8mm] border-b-[0.4mm] border-[#1a1715] pb-[4mm]">
          <div className="min-w-0">
            <p className="font-mono text-[7.5pt] tracking-wide text-[#c4553c]">
              {"// "}
              {kindPhrase(p.kind)}, {p.year}
              {p.status ? ` / ${p.status.toLowerCase()}` : ""}
            </p>
            <h1 className="mt-[1.5mm] font-heading text-[30pt] leading-none font-medium tracking-tight">
              {p.name}
            </h1>
            <p className="mt-[2.5mm] max-w-[120mm] text-[10.5pt] leading-[1.35]">
              {p.tagline}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-[3mm]">
            <div
              className="flex size-[26mm] items-center justify-center"
              style={{ backgroundColor: `var(--stock-${p.stock})` }}
            >
              <DitherObject kind={p.object} stock={p.stock} dot={0.8} />
            </div>
            <ul className="text-right font-mono text-[7pt] leading-[1.55] text-[#3d3732]">
              <li>case study by {siteConfig.name}</li>
              <li>{link("email").handle}</li>
              <li>khaledsaeed.tech/work/{p.slug}</li>
            </ul>
          </div>
        </header>

        {/* where to find it, printed as addresses since paper cannot be clicked */}
        <ul className="mt-[2.5mm] flex flex-wrap gap-x-[6mm] gap-y-[1mm] font-mono text-[7pt] leading-snug text-[#3d3732]">
          {p.links.map((l) => (
            <li key={l.href}>
              <span className="text-[#6b635c]">{l.label.toLowerCase()} </span>
              {bare(l.href)}
            </li>
          ))}
        </ul>

        <div className="mt-[5mm] grid grid-cols-[1fr_58mm] gap-[9mm]">
          {/* main column */}
          <div>
            {!dense && (
              <section className="mb-[5mm]">
                <Head index={next()}>summary</Head>
                <p className="text-[9pt] leading-[1.5]">{p.summary}</p>
              </section>
            )}

            <section>
              <Head index={next()}>the problem</Head>
              <p className="text-[9pt] leading-[1.5]">{p.problem}</p>
            </section>

            <section className="mt-[5mm]">
              <Head index={next()}>how it works</Head>
              <ol className="space-y-[2.2mm]">
                {p.approach.map((a, k) => (
                  <li key={a.title} className="break-inside-avoid">
                    <p className="font-heading text-[9.5pt] font-medium">
                      <span className="mr-[2mm] font-mono text-[7pt] font-normal text-[#c4553c] tabular-nums">
                        {String(k + 1).padStart(2, "0")}
                      </span>
                      {a.title}
                    </p>
                    <p className={`mt-[0.5mm] text-[#3d3732] ${body}`}>
                      {a.body}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* side column */}
          <div>
            {p.proof && (
              <section>
                <Head index={next()}>measured</Head>
                <dl className="grid grid-cols-2 gap-px border border-[#9a928b] bg-[#9a928b]">
                  {p.proof.map((m) => (
                    <div key={m.label} className="bg-white px-[2.5mm] py-[2mm]">
                      <dd className="font-heading text-[14pt] leading-none font-medium tracking-tight tabular-nums">
                        {m.value}
                      </dd>
                      <dt className="mt-[1.2mm] text-[7.5pt] leading-snug">
                        {m.label}
                      </dt>
                      {m.note && (
                        <dd className="mt-[0.5mm] font-mono text-[6.5pt] leading-snug text-[#6b635c]">
                          {m.note}
                        </dd>
                      )}
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section className={p.proof ? "mt-[5mm]" : undefined}>
              <Head index={next()}>highlights</Head>
              <ul className="space-y-[1.4mm]">
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-[2mm] text-[8pt] leading-[1.4]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[1.4mm] size-[1.4mm] shrink-0 bg-[#c4553c]"
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-[5mm]">
              <Head index={next()}>built with</Head>
              <p className="text-[8pt] leading-[1.5] text-[#3d3732]">
                {p.stack.join(", ")}
              </p>
            </section>
          </div>
        </div>

        {/* slug line */}
        <p className="absolute right-[16mm] bottom-[10mm] left-[16mm] flex justify-between gap-[6mm] border-t border-dotted border-[#9a928b] pt-[1.5mm] font-mono text-[6.5pt] text-[#6b635c]">
          <span>
            <PrintSlug edition={edition} />
          </span>
          <span className="shrink-0">
            résumé and more work at khaledsaeed.tech
          </span>
        </p>
      </div>
    </div>
  )

  return createPortal(sheet, document.body)
}

/** A button that prints the sheet, for people who do not know about ⌘P. */
export function PrintSheetButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={className}
      title="Print this case study as a one-page sheet (⌘P)"
    >
      print sheet
    </button>
  )
}
