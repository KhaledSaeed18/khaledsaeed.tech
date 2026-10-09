import {
  about,
  credentials,
  education,
  principles,
} from "@/lib/content/profile"
import { groups, projects } from "@/lib/content/projects"
import { getArticle, getArticles } from "@/lib/data/devto"
import { standfirst } from "@/lib/writing"
import { siteConfig, siteIdentity, socialLinks } from "@/lib/site"

export const revalidate = 86400

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
- Languages and platforms: TypeScript (Node.js, NestJS, React, Next.js, React Native, Electron), Swift (SwiftUI, macOS), Rust (systemd, eBPF, Linux), Go, Python
- Education: ${education.map((e) => `${e.degree} in ${e.field}, ${e.school} (${e.start} to ${e.end})`).join("; ")}
- Credentials: ${credentials.map((c) => `${c.name} (${c.issuer}, ${c.date})${c.note ? `: ${c.note.replace(/\.$/, "")}` : ""}`).join("; ")}
- Approach: software that explains itself. ${principles.map((p) => `${p.title}: ${p.body}`).join(" ")}

## Pages

- [Home](${url("/")}): overview, selected work, the stack and working principles, latest writing
- [Work](${url("/work")}): all projects with case studies
- [About](${url("/about")}): background, specifications, education and certifications
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
            `- [${p.name}](${url(`/work/${p.slug}`)}): ${p.tagline} Stack: ${p.stack.join(", ")}.`
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
