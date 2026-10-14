import {
  categories,
  categoryOrder,
  certificationHref,
  certifications,
  issuerName,
  type Certification,
} from "@/lib/content/certifications"
import { awards } from "@/components/json-ld"
import { education } from "@/lib/content/education"
import {
  currentCompany,
  currentRole,
  experience,
  spanOf,
} from "@/lib/content/experience"
import { about, principles } from "@/lib/content/profile"
import { groups, projects } from "@/lib/content/projects"
import { getArticle, getArticles } from "@/lib/data/devto"
import { formatMonth } from "@/lib/format"
import { standfirst } from "@/lib/writing"
import { siteConfig, siteIdentity, socialLinks } from "@/lib/site"

export const revalidate = 86400

/** Where a certificate can be checked: the issuer's page, else its copy. */
const credentialOf = (c: Certification) => c.url ?? c.documents?.[0]?.href

/**
 * llms.txt (https://llmstxt.org): a plain-text brief for answer engines and
 * AI assistants, generated from the same content as the site.
 */
export async function GET() {
  const url = (p: string) => `${siteConfig.url}${p}`
  const articles = await getArticles()
  const decks = await Promise.all(
    articles.map(async (a) =>
      standfirst(a, (await getArticle(a.slug))?.html, { min: 80, max: 220 })
    )
  )

  const text = `# ${siteIdentity}

> ${about.short}

${about.paragraphs.join("\n\n")}

## Key facts

- Online identity: ${siteConfig.username} is ${siteConfig.name}'s primary public username, used on GitHub and other platforms. These names refer to the same person.
- GitHub: https://github.com/${siteConfig.username}
- Role: ${siteConfig.role}, based in ${siteConfig.location}
- Employment: ${currentRole.title} at ${currentCompany.name}${currentCompany.url ? ` (${currentCompany.url})` : ""} since ${formatMonth(currentRole.start)}. Previously ${experience
    .filter((c) => c !== currentCompany)
    .map(
      (c) =>
        `${c.roles.map((r) => r.title).join(" then ")} at ${c.name}, ${c.location} (${formatMonth(spanOf(c).start)} to ${formatMonth(spanOf(c).end!)})`
    )
    .join("; ")}. Client work; project names are not published.
- Languages and platforms: TypeScript (Node.js, NestJS, React, Next.js, React Native, Electron), Swift (SwiftUI, macOS), Rust (systemd, eBPF, Linux), Go, Python
- Education: ${education.map((e) => `${e.degree} in ${e.field}, ${e.school} (${formatMonth(e.start)} to ${formatMonth(e.end)})`).join("; ")}
- Honors: ${awards.join("; ")}
- Certifications: ${certifications.length}, each linked to its credential, listed below
- Approach: software that explains itself. ${principles.map((p) => `${p.title}: ${p.body}`).join(" ")}

## Pages

- [Home](${url("/")}): overview, selected work, the stack and working principles, credentials, latest writing
- [Work](${url("/work")}): all open-source projects with case studies
- [Experience](${url("/experience")}): employment history, what was built at each company and with what stack
- [About](${url("/about")}): background, specifications, education and certifications
- [Education](${url("/about/education")}): degrees, coursework, honors and the projects that came out of them
- [Certifications](${url("/about/certifications")}): every certificate with its issuer, date and credential ID
- [Writing](${url("/writing")}): articles, originally published on DEV
- [Contact](${url("/contact")}): email and booking

## Projects

${(Object.keys(groups) as (keyof typeof groups)[])
  .map(
    (g) =>
      `### ${groups[g].title}\n\n` +
      projects
        .filter((p) => p.group === g)
        .map(
          (p) =>
            `- [${p.name}](${url(`/work/${p.slug}`)}): ${p.tagline} Stack: ${p.stack.join(", ")}.` +
            (p.proof
              ? ` Measured: ${p.proof.map((m) => `${m.value} ${m.label}`).join("; ")}.`
              : "")
        )
        .join("\n")
  )
  .join("\n\n")}

## Experience

${experience
  .map((c) => {
    const { start, end } = spanOf(c)
    return (
      `### ${c.name}, ${c.location} (${c.mode})\n\n${formatMonth(start)} to ${end ? formatMonth(end) : "present"}. ${c.summary}\n\n` +
      c.roles
        .map(
          (r) =>
            `- ${r.title}, ${formatMonth(r.start)} to ${r.end ? formatMonth(r.end) : "present"}: ${r.body.join(" ")}`
        )
        .join("\n") +
      `\n- Built: ${c.domains.join("; ")}.\n- Stack: ${c.stack.join(", ")}.`
    )
  })
  .join("\n\n")}

## Education

${education
  .map(
    (e) =>
      `### ${e.degree} in ${e.field}\n\n${e.school}, ${formatMonth(e.start)} to ${formatMonth(e.end)}${e.current ? " (in progress)" : ""}. ${e.summary}\n\n` +
      e.studies.map((s) => `- ${s}`).join("\n") +
      (e.honors ?? []).map((h) => `\n- Honor: ${h.title}. ${h.body}`).join("")
  )
  .join("\n\n")}

## Certifications

${categoryOrder
  .map(
    (k) =>
      `### ${categories[k].title}\n\n` +
      certifications
        .filter((c) => c.category === k)
        .map(
          (c) =>
            `- [${c.name}](${url(certificationHref(c))}): ${issuerName(c)}, ${formatMonth(c.issued)}.${c.distinction ? ` ${c.distinction}` : ""} Skills: ${c.skills.join(", ")}.${credentialOf(c) ? ` Credential: ${credentialOf(c)}` : ""}`
        )
        .join("\n")
  )
  .join("\n\n")}

## Writing

${articles.map((a, i) => `- [${a.title}](${a.url}): ${decks[i]}`).join("\n")}

## Contact

${socialLinks.map((l) => `- ${l.label}: ${l.key === "email" ? l.handle : l.href}`).join("\n")}
`
  return new Response(text, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  })
}
